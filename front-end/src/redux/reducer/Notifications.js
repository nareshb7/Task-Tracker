// import {createSlice } from '@reduxjs/toolkit'
// import useAuth from '../../components/utils/Authentication'

// export const userSlice = createSlice({
//     name: 'user',
//     initialState: null,
//     reducers: {
//         addNotification: (state, {payload, user})=> {
            
//             console.log('state', state, user, payload)
//             if (state.newMessages[payload]){
//                 state.newMessages[payload] = state.newMessages[payload] + 1
//             } else {
//                 state.newMessages[payload] = 1
//             }
//         },
//         resetNotification: (state, {payload})=> {
//             delete state.newMessages[payload]
//         },
//     }
// })

// export const {addNotification, resetNotification} = userSlice.actions

// export default userSlice.reducer


import { ADD_NOTIFICATION, RESET_NOTIFICATION } from "../actionTypes/ActionTypes";

export const NotificationReducer =(state= null, action)=> {
    state = action.val || state
    switch(action.type) {
        case ADD_NOTIFICATION : {
            return state.newMessages[action.payload]  = (state.newMessages[action.payload] || 0) + 1
        }
        case RESET_NOTIFICATION : {
            delete state.newMessages[action.payload]
            return state
        }
        default: return state
    }
}

