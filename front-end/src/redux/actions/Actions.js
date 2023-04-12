import React from "react";
import { ADD, ADD_NOTIFICATION, RESET_NOTIFICATION } from "../actionTypes/ActionTypes";

export const addUser =(val)=> {
    return {
        type:ADD,
        payload: val
    }
}
export const AddNotification = (id, val)=> {
    return {
        type: ADD_NOTIFICATION, 
        payload: id,
        val
    }
}
export const ResetNotification = (room, val)=> {
    return {
        type: RESET_NOTIFICATION,
        payload:room,
        val
    }
}