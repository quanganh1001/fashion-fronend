import { combineReducers } from "redux";
import accountReducer from "./accountReducer.js";

const rootReducer = combineReducers({
    account: accountReducer
});

export default rootReducer;
