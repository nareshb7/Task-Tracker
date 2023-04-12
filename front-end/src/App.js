import React, { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Nav from './components/Nav'
import { Provider } from 'react-redux';
import RoutesComp from './components/RoutesComp';
import useAuth from './components/utils/Authentication';
import { store } from './redux/store/Store';
import Footer from './components/Footer';
import { BE_URL } from './components/utils/Constants';

export const UserContext = createContext()
const SOCKET_URL = BE_URL
const socket = io(SOCKET_URL)

function App() {
  const userDetails = useAuth()
  const [currentUserVal, setCurrentUserVal] = useState({})
  const value = { currentUserVal, setCurrentUserVal, socket }
  useEffect(() => {
    console.log('context vall use....', userDetails)
    setCurrentUserVal(userDetails)
  }, [userDetails])
  return (
    <Provider store={store} >
      <UserContext.Provider value={value}>
        <Nav />
        <RoutesComp />
        <Footer/>
      </UserContext.Provider>
    </Provider>
  );
}

export default App;
