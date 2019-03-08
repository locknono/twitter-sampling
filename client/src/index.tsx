import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import dataTree from "./reducers/dataTree";
import { uiState } from "./reducers/uiState";
import { DOC_PR_DATA, setData } from "./actions/setDataAction";
import { fetchJsonData } from "./shared";
//import dataTree from "./reducers/dataTree";

const rootReducer = combineReducers({
  dataTree,
  uiState
});

const store = createStore(rootReducer);

fetchJsonData("./idLdaDict.json").then(data => {
  store.dispatch(setData(DOC_PR_DATA, data));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();
