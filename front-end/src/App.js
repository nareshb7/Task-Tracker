import React, {createContext, useEffect, useState} from 'react'
import Nav from './components/Nav'
import RoutesComp from './RoutesComp';
import useAuth from './components/authentication/Authentication';

export const UserContext = createContext()

function App() {
  const userDetails = useAuth()
  const [currentUserVal, setCurrentUserVal] = useState({})
  const value ={currentUserVal, setCurrentUserVal}
  useEffect(()=> {
    console.log('context vall use....')
    setCurrentUserVal(userDetails)
  },[userDetails])
  return (
    <UserContext.Provider value={value}>
      <Nav />
      <RoutesComp />
    </UserContext.Provider>
  );
}

export default App;
