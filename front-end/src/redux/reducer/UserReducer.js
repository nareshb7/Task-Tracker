import React from "react";
import { ADD } from "../actionTypes/ActionTypes";

const initialState = {
    count : 0
}

const userReducer =(state = initialState, action)=> {
    switch(action.type) {
        case ADD : 
        return  {
            count : state.count + 1
        }
        default : return state
    }
}
export default userReducer