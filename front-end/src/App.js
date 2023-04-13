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

export const UserContext = createContext()
const SOCKET_URL = BE_URL
const socket = io(SOCKET_URL)

function App() {
  const userDetails = useAuth()
  const [currentUserVal, setCurrentUserVal] = useState({})
  const value = { currentUserVal, setCurrentUserVal, socket }
  useEffect(() => {
    const handleTabClose =async  event => {
      event.preventDefault();
      console.log('currentuzuser',currentUserVal);
      if(currentUserVal._id) {
        await logoutFunc(currentUserVal)
        socket.emit('new-user')
        console.log('iffff')
      }
      return (event.returnValue =
        'Are you sure you want to exit?');
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [currentUserVal]);

  useEffect(() => {
    socket.emit('new-user')
    setCurrentUserVal(userDetails)
  }, [userDetails])
  return (
    <Provider store={store} >
      <UserContext.Provider value={value}>
        <Navigation />
        <RoutesComp />
        <Footer/>
      </UserContext.Provider>
    </Provider>
  );
}

export default App;
