import { LoaderProvider } from "Shared/Loader/LoaderContext";
import "Shared/toastPatch/index";
import { Suspense, useEffect, useState } from "react";
import Lottie from "react-lottie";
import { QueryClient, QueryClientProvider } from "react-query";
import { useLocation } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Main from "./Routes/Main";
import Splash from "./Shared/Common/Pages/Splash";
import CourierContextProvider from "./Shared/CourierContext";
import DataContextProvider from "./Shared/DataContext";
import AuthDialog from "./Shared/Modal/AuthDialog";
import ResultDataContextProvider from "./Shared/ResultDataContext";
import ToxResultDataContextProvider from "./Shared/ToxResultDataContext";
import LOADING_ANIMATION_JSON from "./Utils/LottieAnimations/Animation - 1715773504778.json";
import VersionChecker from "Utils/VersionChecker";

function App() {
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    setLoading(false);
    clearLocalStorage();
  }, []);

  const queryClient = new QueryClient();
  const { pathname } = useLocation();


  const clearLocalStorage = () => {
    if (pathname === "/ResetPassword" || pathname === "/InitializePassword") {
      localStorage.clear();
    }
  };


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingAnimation />}>
          <LoaderProvider>
            <DataContextProvider>
              <ToxResultDataContextProvider>
                <ResultDataContextProvider>
                  <CourierContextProvider>
                    <div>
                      <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={true}
                        transition={Flip}
                        limit={1}
                      />
                      <AuthDialog />
                      <VersionChecker />
                      {loading ? <Splash /> : <Main />}
                    </div>
                  </CourierContextProvider>
                </ResultDataContextProvider>
              </ToxResultDataContextProvider>
            </DataContextProvider>
          </LoaderProvider>
        </Suspense>
      </QueryClientProvider>
    </>
  );
}

export default App;

const LoadingAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LOADING_ANIMATION_JSON,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={200} width={200} />;
};
