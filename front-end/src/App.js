import React, { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Provider } from 'react-redux';
import RoutesComp from './pages/RoutesComp';
import useAuth from './components/utils/Authentication';
import { store } from './redux/store/Store';
import Footer from './pages/Footer';
import { BE_URL } from './components/utils/Constants';
import { logoutFunc } from './components/utils/LogoutFunc';
import Navigation from './pages/Nav';
import { fetchGetCall } from './components/utils/fetch/UseFetch';
import ChatBot from './components/bot/ChatBot';
import AlertBox from './components/utils/alert/AlertBox';

export const UserContext = createContext()
const SOCKET_URL = BE_URL
const socket = io(SOCKET_URL);

function App() {

  const userDetails = useAuth()
  const [currentUserVal, setCurrentUserVal] = useState({})
  const [totalMessages, setTotalMessages] = useState(0)
  const [currentRoom, setCurrentRoom] = useState('')
  const [quote, setQuote] = useState({})
  const [newsData, setNewsData] = useState([])
  const [notificationRooms, setNotificationRooms] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const value = {
    notificationRooms,
    setNotificationRooms,
    newsData,
    currentUserVal,
    setCurrentUserVal,
    socket,
    totalMessages,
    setTotalMessages,
    currentRoom,
    setCurrentRoom,
    quote
  }
  useEffect(() => {
    // socket.emit('new-user')
    const handleTabClose = async (event) => {
      event.preventDefault();
      if (currentUserVal._id) {
        await logoutFunc(currentUserVal)
        socket.emit('new-user')
        console.log('iffff')
      }
      if (event) {
        event.returnValue = 'want to close...?'
      }
      // return (event.returnValue =
      //   'Are you sure you want to exit?');
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [currentUserVal]);
  socket.off("ticketAssigned").on("ticketAssigned", (val, id, sender) => {
    if (currentUserVal._id == id) {
      alert(`${sender.fName} assigned you ticket`)
    }
  })
  socket.off('notifications').on('notifications', (room, id, sender) => {
    if (room != currentRoom && currentUserVal._id == id) {
      currentUserVal.newMessages[room] = (currentUserVal.newMessages[room] || 0) + 1
      let totalMessage = Object.values(currentUserVal?.newMessages).length && Object.values(currentUserVal?.newMessages)?.reduce((a, b) => a + b)
      const roomsCount = Object.keys(currentUserVal.newMessages).length
      setNotificationRooms(roomsCount)
      setTotalMessages(totalMessage)
      setCurrentUserVal(currentUserVal)
      setAlertMessage('You got a message from ' + sender.fName)
      setShowAlert(true)
      // alert('You got a message from ' + sender.fName)
    }
  })
  useEffect(() => {
    const getQuote = async () => {
      const d = new Date()
      const { success, data } = await fetchGetCall('/api/getquote', { date: d })
      if (success) {
        setQuote(data)
      }
    }
    const getNews = async () => {
      const d = new Date()
      const { success, data } = await fetchGetCall('/api/getnews', { date: d })
      if (success) {
        setNewsData(data)
      }
    }
    getNews()
    getQuote()
  }, [])
  useEffect(() => {
    socket.emit('new-user')
    setCurrentUserVal(userDetails)
    if (userDetails?.newMessages) {
      let totalMessage = Object.values(userDetails?.newMessages).length && Object.values(userDetails?.newMessages)?.reduce((a, b) => a + b)
      const roomsCount = Object.keys(userDetails?.newMessages).length
      setNotificationRooms(roomsCount)
      setTotalMessages(totalMessage)

    }
  }, [userDetails])
  return (
    <Provider store={store} >
      <div className='scrollbar-container '>

      <UserContext.Provider value={value}>
        <Navigation />
        <RoutesComp />
        <Footer />
        <ChatBot />
        <AlertBox showAlert={showAlert} setShowAlert={setShowAlert} message={alertMessage}/>
      </UserContext.Provider>
      </div>

    </Provider>
  );
}

export default App;
