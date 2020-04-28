import {combineReducers} from "redux";
import { tuckmanReducer } from "./Tuckman/Reducer";
import { comfortReducer } from "./Comfort/Reducer";

export default combineReducers({
    tuckmanReducer,
    comfortReducer
});
