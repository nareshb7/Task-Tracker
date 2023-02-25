import React, {createContext, useEffect, useState} from 'react'
import Nav from './components/Nav'
import RoutesComp from './components/RoutesComp';
import useAuth from './components/utils/Authentication';

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
