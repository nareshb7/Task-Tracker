import { ADDISSUE } from "../../actionTypes/issues/ActionTYpes";

const initialState = {
    issues:[]
}

export const issuesReducer = (state = initialState,action)=> {
    switch(action.type) {
        case ADDISSUE : {
            return {
                issues: [...state.issues, action.payload]
            }
        }
        default: return state
    }
}