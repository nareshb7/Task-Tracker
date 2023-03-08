import { issuesReducer } from "./reducer/issues/IssueReducers";
import userReducer from "./reducer/UserReducer";

export const rootReducer = {
    data : userReducer,
    issues: issuesReducer
}