import React, { createContext, useContext, useEffect, useState } from 'react'
import { Provider } from 'react-redux';
import RoutesComp from './pages/RoutesComp';
import useAuth from './components/utils/Authentication';
import { store } from './redux/store/Store';
import Footer from './pages/Footer';
import { logoutFunc } from './components/utils/LogoutFunc';
import Navigation from './pages/Nav';
import { fetchGetCall } from './components/utils/fetch/UseFetch';
import ChatBot from './components/bot/ChatBot';
import cLogo from './assets/company-logo.jpg'
import MszNotification from './components/messageNotification/MszNotification';

export const UserContext = createContext()

function App() {

  const userDetails = useAuth()
  const {
    setNotificationRooms,
    setNewsData,
    currentUserVal,
    setCurrentUserVal,
    socket,
    setTotalMessages,
    currentRoom,
    setQuote,
    isLoggedIn,
    setIsLoggedIn
  } = useContext(UserContext)
  const [showAlert, setShowAlert] = useState({
    content:'',
    status:false
  })
  const handleVisible = async () => {
    if (currentUserVal._id) {
      if (document.visibilityState === 'hidden') {
        await logoutFunc(currentUserVal)
        socket.emit('new-user')
      } else {
        await logoutFunc(currentUserVal, 'Online')
        socket.emit('new-user')
      }
    }
  }
  const onUnload = e => { // the method that will be used for both add and remove event
    e.preventDefault();
    handleVisible()
    e.returnValue = '';
 }
  socket.off("ticketAssigned").on("ticketAssigned", (val, id, sender) => {
    if (currentUserVal._id == id) {
      // alert(`${sender.fName} assigned you ticket`)
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Ticket Assgned', {
          body: `${sender.fName} assigned you ticket`,
          icon: cLogo,
          // Other options like icon, badge, etc.
        });
      }
      setShowAlert({content:`${sender.fName} assigned you ticket`,status:true})
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
      // alert('You got a message from ' + sender.fName)
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Message', {
          body: `You got a message from ${sender.fName}`,
          icon: cLogo,
          // Other options like icon, badge, etc.
        });
      }
      setShowAlert({content:`You got a message from ${sender.fName}`,status:true})

    }
  })
  useEffect(() => {
    window.addEventListener('visibilitychange', handleVisible)
    window.addEventListener('beforeunload', onUnload)
    return () => {
      window.addEventListener('visibilitychange', handleVisible)
      window.addEventListener('beforeunload', onUnload)
    };
  }, [isLoggedIn]);
  useEffect(()=> {
    if(showAlert.status) {
      setTimeout(()=> {
        setShowAlert({...showAlert,status:false})
      }, 3000)
    }
  }, [showAlert.status])


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
    if ('Notification' in window) {
      Notification.requestPermission()
        .then(permission => {
          if (permission === 'granted') {
            // Permission granted, you can now show notifications
            const notification = new Notification('Wel-Come', {
              body: `Welcome to ResourceOne ChatBox`,
              icon: cLogo,
              tag: 'Welcome Message'
              // Other options like icon, badge, etc.
            });
          }
        });
    }
  }, [])
  useEffect(() => {
    if (userDetails?._id) {
      let totalMessage = Object.values(userDetails?.newMessages).length && Object.values(userDetails?.newMessages)?.reduce((a, b) => a + b)
      const roomsCount = Object.keys(userDetails?.newMessages).length
      setNotificationRooms(roomsCount)
      setTotalMessages(totalMessage)
      setIsLoggedIn(true)
      setCurrentUserVal(userDetails)
      socket.emit('new-user')
    }
  }, [userDetails])
  return (
    <Provider store={store} >
      <div className='scrollbar-container '>
          <Navigation />
          <RoutesComp />
          <Footer />
          <ChatBot />
          {showAlert.status && <MszNotification setShowAlert={setShowAlert} content={showAlert.content}/>}
      </div>
    </Provider>
  );
}

export default App;
// <AlertBox showAlert={showAlert} setShowAlert={setShowAlert} message={alertMessage} />
