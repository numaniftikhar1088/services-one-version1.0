import './Shared/toastPatch/index'
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./i18n";
import store from "./Redux/Store/AppStore";
import reportWebVitals from "./reportWebVitals";
import { useDispatch } from "react-redux";

// ******************* Global Style *********************
import "./_theme/assets/css/customTable.css";
import "./_theme/assets/css/style.css";
import { setBaseUrl } from "Redux/Actions/Index";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const persistor = persistStore(store);

const fetchConfig = async () => {
  const response = await fetch("/config.json");
  const config = await response.json();
  return config;
};

fetchConfig().then((config) => {
  store.dispatch(setBaseUrl(config.REACT_APP_BASE_URL))
  
  root.render(
    <React.StrictMode>
      <Router>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </Router>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
