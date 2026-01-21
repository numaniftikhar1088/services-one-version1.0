import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  SyntheticEvent,
} from 'react';
import useLang from './../../../Shared/hooks/useLanguage';
import Commonservice from 'Services/CommonService';
import {
  setLabType,
  setRefreshToken,
  setTokenData,
  setUserInfo,
  setWebInfo,
} from 'Redux/Actions/Index';
import {
  setFaviconAndTitle,
  setValueIntoSessionStorage,
} from 'Utils/Common/CommonMethods';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VerificationInput from 'react-verification-input';
import { Encrypt, getTokenData } from 'Utils/Auth';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { IApiResponse } from 'Interface/Shared/ApiResponse';
import AccountService from 'Services/Account/AccountService';
import useAuth from 'Shared/hooks/useAuth';
import { getFingerprint } from 'Utils/Common/HelperFunction';

interface CustomJwtPayload extends JwtPayload {
  Lab_Classification: string;
}

const VerificationCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();
  const dispatch = useDispatch();
  const { labId, userId, senderType } = useParams();
  const senderTypeDecoded = senderType ? atob(senderType) : '';
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<any>(
    sessionStorage.getItem('expiryTime') || location?.state?.expiryTime
  );
  const [disabled, setDisabled] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { LoginRoute }: any = useAuth();
  const [countdown, setCountdown] = useState<string>('');
  const verificationInputRef = useRef<any>(null);
  useEffect(() => {
    if (location?.state?.expiryTime) {
      sessionStorage.setItem('expiryTime', location.state.expiryTime);
      setTimeLeft(location.state.expiryTime);
    }
  }, [location?.state?.expiryTime]);
  // Prevent browser back button
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handleBackButton = () => {
      navigate('/login', { state: { ...location?.state } });
    };
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, []);

  // Auto-focus on verification input
  useEffect(() => {
    if (verificationInputRef.current) {
      verificationInputRef.current.focus();
    }
  }, []);
  // Focus first input box when OTP is cleared
  useEffect(() => {
    if (otp === '' && verificationInputRef.current) {
      verificationInputRef.current.focus();
    }
  }, [otp]);
  // Fetch logo & site info
  const getLogoUrl = () => {
    Commonservice.getLoginPageLogo()
      .then((res: any) => {
        setLogoUrl(res.data.logo);
        dispatch(
          setWebInfo({
            smartLogoUrl: res.data?.smartLogo,
            title: res.data?.labName,
          })
        );
        setFaviconAndTitle(res.data?.smartLogo, res.data?.labName);
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  // Generate device id
  useEffect(() => {
    const loadFingerprint = async () => {
      const id = await getFingerprint();
      setDeviceId(id);
    };
    loadFingerprint();
  }, []);

  useLayoutEffect(() => {
    getLogoUrl();
  }, []);

  // Submit OTP
  const handleVerify = () => {
    if (otp.length === 6) {
      loginUser({ preventDefault: () => { } } as SyntheticEvent);
    }
  };

  // Verify OTP and login function
  const loginUser = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginRequest = {
      userName: location?.state?.username,
      password: location?.state?.password,
      deviceId: deviceId,
      userId: userId,
      code: otp,
      labId: labId,
      trustedDays: trustDevice ? location?.state?.mfaTrustedDeviceDays : 0,
    };

    await AccountService.userLogin(loginRequest)
      .then((res: IApiResponse<any>) => {
        if (res.data.status === 400) {
          toast.error(res.data.message);
          setLoading(false);
          setOtp('');
          return;
        }
        if (res.data.isNewUser) {
          navigate('/security-questions-username', {
            state: { userId: res.data.userId, username: res.data.username },
          });
          return;
        }
        const data = res.data;
        const encryptData: any = Encrypt(JSON.stringify(res.data));
        const decodedToken: CustomJwtPayload = jwtDecode(data.token);

        sessionStorage.setItem('userinfo', encryptData);

        dispatch(setLabType(decodedToken?.Lab_Classification));
        dispatch(setRefreshToken(data.refreshToken));
        dispatch(setUserInfo(encryptData));

        if (window.location.pathname === '/externallogin') {
          setValueIntoSessionStorage('externalLogin', 'true');
        }

        LoginRoute(data);
        const TokenDetails = getTokenData();
        dispatch(setTokenData(TokenDetails));

        if (process.env.NODE_ENV === 'production') {
          setLoading(false);
          if (res.status === 200) {
            toast.success(t('Logged In!'));
            setTimeLeft('');
            sessionStorage.removeItem('expiryTime');
          }
        }
      })
      .catch(err => {
        if (err.response.data.status === 401) {
          toast.error(t('Incorrect Username or Password'));
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Resend code function
  const getMFACode = async () => {
    setDisabled(true)
    const objToSend = {
      userId: userId,
      labId: labId,
      sendType: senderTypeDecoded,
    };
    await Commonservice.getCode(objToSend)
      .then((res: any) => {
        if (res?.data?.isCodeGenerated) {
          setTimeLeft(res?.data?.expireTime);
          sessionStorage.setItem('expiryTime', res?.data?.expireTime);
          toast.success(`Code sent to ${senderTypeDecoded}`);
          setDisabled(false)
        }
      })
      .catch(() => { setDisabled(false) })
  };

  // Effect to handle countdown timer
  useEffect(() => {
    if (!timeLeft) return;

    const expiryDate = new Date(timeLeft).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = expiryDate - now;

      if (diff <= 0) {
        setCountdown('');
        return false;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const hours = Math.floor(diff / (1000 * 60 * 60));

      const formatted =
        hours > 0
          ? `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          : `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;

      setCountdown(formatted);
      return true;
    };

    const isValid = updateCountdown();

    if (!isValid) return;

    const interval = setInterval(() => {
      const stillValid = updateCountdown();
      if (!stillValid) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);
  return (
    <div
      className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
      style={{
        backgroundImage: `url('${process.env.PUBLIC_URL}/media/illustrations/login/sketch-1.png')`,
      }}
    >
      <div
        className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20"
        style={{ minHeight: '100vh' }}
      >
        <div className="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
          {logoUrl && (
            <a href="#" className="mb-12 d-flex justify-content-center">
              <img alt="Logo" src={logoUrl} className="h-45px" />
            </a>
          )}

          <div className="text-center mb-10">
            <h4 className="fw-bold">Enter Verification Code</h4>
            <p>
              Please enter the 6-digit code sent to{' '}
              {senderTypeDecoded}.
            </p>
          </div>

          <div className="fv-row mb-10 d-flex justify-content-center">
            <VerificationInput
              ref={verificationInputRef}
              length={6}
              validChars="0-9"
              placeholder=""
              onChange={(val: string) => {
                setOtp(val);
                if (val.length === 6) {
                  handleVerify();
                }
              }}
              value={otp}
              inputProps={{ inputMode: 'numeric' }}
              classNames={{
                container: 'd-flex gap-2',
                character: 'form-control form-control-lg text-center',
                characterInactive: 'opacity-50',
              }}
            />
          </div>

          <div className="text-center">
            <button
              className="btn btn-primary b-0 w-100 mb-5 h-40px"
              onClick={handleVerify}
              disabled={loading || otp.length !== 6 || !countdown}
              id="mfaVerifyCodeButton"
            >
              {loading ? <>Verifying ...</> : <span>Verify</span>}
            </button>
          </div>
          {countdown ? (
            <div className="text-center mt-2 text-muted">
              Code expires in <strong>{countdown}</strong>
            </div>
          ) : (
            <div className="text-center mt-2 text-danger">
              Code has expired.
              <div
                className="d-flex justify-content-center cursor-pointer text-primary mt-2"
                onClick={() => {
                  if (disabled) return;
                  setOtp('');
                  getMFACode();
                }}

              >
                <span
                  id="mfaResendCodeButton"
                  className="text-primary text-decoration-none text-decoration-underline hover:no-underline"
                >
                  Resend Code
                </span>
              </div>
            </div>
          )}
          <div className="form-check form-check-inline form-check-solid m-0 d-flex align-items-center gap-2 mt-4">
            <input
              className="form-check-input h-15px w-15px rounded-01 m-0"
              type="checkbox"
              id="trustDeviceCheckboxMFA"
              onChange={(e: any) => setTrustDevice(e.target.checked)}
              checked={trustDevice}
            />
            <label
              className="form-check-label text-muted"
              htmlFor="trustDevice"
              style={{
                fontSize: '0.85rem',
                lineHeight: '1.2',
              }}
            >
              Trust this device for {location?.state?.mfaTrustedDeviceDays} days{' '}
              <span className="d-none d-sm-inline">
                (skip verification next time)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
