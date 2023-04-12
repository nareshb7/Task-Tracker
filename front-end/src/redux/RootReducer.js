import { issuesReducer } from "./reducer/issues/IssueReducers";
import { NotificationReducer } from "./reducer/Notifications";
import userReducer from "./reducer/UserReducer";

export const rootReducer = {
    data : userReducer,
    issues: issuesReducer,
    user: NotificationReducer
}