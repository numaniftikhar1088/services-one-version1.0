import { useLayoutEffect, useState } from 'react';
import Commonservice from 'Services/CommonService';
import { setWebInfo } from 'Redux/Actions/Index';
import { setFaviconAndTitle } from 'Utils/Common/CommonMethods';
import { useDispatch } from 'react-redux';
import { FaMobileAlt, FaEnvelope } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Loader } from 'Shared/Common/Loader';

const AuthenticateWithCode = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoUrl, setLogoUrl] = useState<string>('');
  const location = useLocation();
  const [types, setTypes] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { labId, userId } = useParams();
  const [check, setCheck] = useState(false);
  const [buttonLoading, setButtonLoading] = useState<{
    [key: string]: boolean;
  }>({
    sms: false,
    email: false,
  });

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
      .catch(console.error);
  };

  const getMFSTypes = async () => {
    setLoading(true);
    await Commonservice.getMFATypes(labId, userId)
      .then((res: any) => {
        if (typeof res.data.data === 'string') {
          setTypes(JSON.parse(res.data.data));
          setLoading(false);
        }
      })
      .catch(console.error);
  };

  useLayoutEffect(() => {
    getLogoUrl();
    getMFSTypes();
  }, []);

  const getMFACode = async (senderType: any) => {
    setCheck(true);
    setButtonLoading(prev => ({ ...prev, [senderType.toLowerCase()]: true }));
    const objToSend = {
      userId: userId,
      labId: labId,
      sendType: senderType,
    };
    await Commonservice.getCode(objToSend)
      .then((res: any) => {
        if (res.data.isCodeGenerated) {
          setCheck(false);
          navigate(`/verify/${labId}/${userId}/${btoa(senderType)}`, {
            state: {
              userId: userId,
              labId: labId,
              expiryTime: res.data.expireTime,
              senderType: senderType,
              mfaTrustedDeviceDays: location?.state?.mfaTrustedDeviceDays,
              username: location?.state?.username,
              password: location?.state?.password,
            },
          });
        }
      })
      .catch(console.error)
      .finally(() => {
        setButtonLoading(prev => ({
          ...prev,
          [senderType.toLowerCase()]: false,
        }));
      });
  };

  const SkeletonLoader = () => (
    <div
      className="skeleton-loader"
      style={{
        height: '50px',
        width: '100%',
        background:
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite',
        borderRadius: '8px',
      }}
    >
      <style>
        {`
          @keyframes skeleton-loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}
      </style>
    </div>
  );

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
        <div className="w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto text-center">
          {logoUrl && (
            <a href="#" className="mb-10 d-flex justify-content-center">
              <img alt="Logo" src={logoUrl} className="h-45px" />
            </a>
          )}

          <h4 className="fw-bold text-dark mb-8">Authenticate with Code</h4>
          {loading ? (
            <Loader />
          ) : (
            <div className="d-flex flex-column gap-3">
              {types.map((typ: any, index: number) => (
                <div className="d-flex flex-column gap-4 mt-2" key={index}>
                  {typ.toLowerCase() === 'sms' &&
                    (buttonLoading.sms ? (
                      <SkeletonLoader />
                    ) : (
                      <button
                        onClick={() => getMFACode(typ)}
                        className="btn border d-flex align-items-center gap-2 justify-content-start px-4 hover-gray"
                        style={{
                          height: '50px',
                          backgroundColor: 'white',
                          fontSize: '16px',
                          fontWeight: 500,
                        }}
                        disabled={check}
                        id="verifyWithMobile"
                      >
                        <FaMobileAlt className="text-success" />
                        <span className="text-dark">Send to mobile</span>
                      </button>
                    ))}

                  {typ.toLowerCase() === 'email' &&
                    (buttonLoading.email ? (
                      <SkeletonLoader />
                    ) : (
                      <button
                        onClick={() => getMFACode(typ)}
                        className="btn border d-flex align-items-center gap-2 justify-content-start px-4 hover-gray"
                        style={{
                          height: '50px',
                          backgroundColor: 'white',
                          fontSize: '16px',
                          fontWeight: 500,
                        }}
                        disabled={check}
                        id="verifyWithEmail"
                      >
                        <FaEnvelope className="text-success" />
                        <span className="text-dark">Send to email</span>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthenticateWithCode;





