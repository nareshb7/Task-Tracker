import React, { createContext, useEffect, useState } from 'react'
import Nav from './components/Nav'
import { Provider } from 'react-redux';
import RoutesComp from './components/RoutesComp';
import useAuth from './components/utils/Authentication';
import { store } from './redux/store/Store';
import Footer from './components/Footer';

export const UserContext = createContext()

function App() {
  const userDetails = useAuth()
  const [currentUserVal, setCurrentUserVal] = useState({})
  const value = { currentUserVal, setCurrentUserVal }
  useEffect(() => {
    console.log('context vall use....')
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
