import React, { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Provider } from 'react-redux';
import RoutesComp from './pages/RoutesComp';
import useAuth from './components/utils/Authentication';
import { store } from './redux/store/Store';
import Footer from './pages/Footer';
import { BE_URL } from './components/utils/Constants';
import { logoutFunc } from './components/utils/LogoutFunc';
import { setCookie } from './components/utils/CookieComp';
import Navigation from './pages/Nav';
import { Toast } from 'react-bootstrap';
import { fetchCall, fetchGetCall } from './components/utils/fetch/UseFetch';

export const UserContext = createContext()
const SOCKET_URL = BE_URL
const socket = io(SOCKET_URL)

function App() {
  const userDetails = useAuth()
  const [currentUserVal, setCurrentUserVal] = useState({})
  const [totalMessages, setTotalMessages] = useState(0)
  const [currentRoom, setCurrentRoom] = useState('')
  const [messageClose, setMessageClose] = useState(false)
  const [quote, setQuote] = useState({})
  const value = { currentUserVal, setCurrentUserVal, socket, totalMessages, setTotalMessages, currentRoom, setCurrentRoom , quote}
  useEffect(() => {
    socket.emit('new-user')
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
  window.addEventListener('beforeunload', async function (e) {
    e.preventDefault();
    currentUserVal._id && await logoutFunc(currentUserVal)
    socket.emit('new-user')
    e.returnValue = '';
  });
  socket.off("ticketAssigned").on("ticketAssigned", (val, id,sender)=> {
    if (currentUserVal._id == id) {
      alert(`${sender.fName} assigned you ticket`)
    }
  })
  socket.off('notifications').on('notifications', (room, id, sender) => {
    if (room != currentRoom && currentUserVal._id == id) {
        currentUserVal.newMessages[room] = (currentUserVal.newMessages[room] || 0) + 1
        let totalMessage = Object.values(currentUserVal?.newMessages).length && Object.values(currentUserVal?.newMessages)?.reduce((a, b) => a + b)
        setTotalMessages(totalMessage)
        setCurrentUserVal(currentUserVal)
        alert('You got a message from ' + sender.fName)
    }
})
useEffect(()=> {
    const getQuote = async ()=> {
      const d = new Date()
      const quote =await fetchGetCall('/api/getquote', {date: d})
      setQuote(quote)
}
getQuote()

},[])
  useEffect(() => {
    socket.emit('new-user')
    setCurrentUserVal(userDetails)
    if (userDetails?.newMessages) {
      let totalMessage = Object.values(userDetails?.newMessages).length && Object.values(userDetails?.newMessages)?.reduce((a,b)=> a+b)
      setTotalMessages(totalMessage)
    }
  }, [userDetails])
  return (
    <Provider store={store} >
      <UserContext.Provider value={value}>
        <Navigation />
        <RoutesComp />
        <Footer />
      </UserContext.Provider>
    </Provider>
  );
}

export default App;
