import React from "react";
import { ADD } from "../actionTypes/ActionTypes";

export const addUser =(val)=> {
    return {
        type:ADD,
        payload: val
    }
}