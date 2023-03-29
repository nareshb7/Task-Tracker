import { ADDISSUE } from '../../actionTypes/issues/ActionTYpes'

export const addIssue =(obj)=> {
    return {
        type:ADDISSUE,
        payload: obj
    }
}
