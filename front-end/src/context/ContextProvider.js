import React, { createContext, useState } from 'react'
import { io } from 'socket.io-client'
import { BE_URL } from '../components/utils/Constants';
import { UserContext } from '../App';

const socket = io(BE_URL);
const ContextProvider = ({children}) => {
    const [notificationRooms, setNotificationRooms] = useState(0)
    const [currentUserVal, setCurrentUserVal] = useState({})
    const [totalMessages, setTotalMessages] = useState(0)
    const [currentRoom, setCurrentRoom] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [quote, setQuote] = useState({})
    const [newsData, setNewsData] = useState([])

    const value = {
        notificationRooms,
        setNotificationRooms,
        newsData,
        setNewsData,
        currentUserVal,
        setCurrentUserVal,
        socket,
        totalMessages,
        setTotalMessages,
        currentRoom,
        setCurrentRoom,
        quote,
        setQuote,
        isLoggedIn,
        setIsLoggedIn
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default ContextProvider