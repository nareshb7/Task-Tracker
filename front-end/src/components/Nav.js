import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { setCookie } from './utils/CookieComp'
import { GreenDot, RedDot } from './utils/Dots/Dots'

const Nav = () => {
    const { currentUserVal, setCurrentUserVal } = useContext(UserContext)
    const [be,setBe] = useState({
        db:200,
        server:200
    })
    const navigate = useNavigate()
    useEffect(()=> {
        axios.get('http://localhost:4040/server')
        .then(res=> setBe({...be, server: res.data.statusCode}))
        .catch(err=> setBe({...be, server: err?.statusCode}))

        axios.get('http://localhost:4040/db')
        .then(res=> setBe({...be, db : res.data.statusCode}))
        .catch(err=> setBe({...be, db : err?.statusCode}))
        console.log("Backend",be)
    },[window.location.pathname])
    const logoutFunc = () => {
        setCurrentUserVal({})
        setCookie("63dab3b51d791ebc7821db51", 2)
        navigate('/login')
      }
    return (
        <nav>
            <ul style={{display:'flex', justifyContent:'space-between'}}>
                <div>
                    <li>
                        <img src='' alt='' />
                        Task-Tracker
                    </li>
                    <li><NavLink to='/'>Home </NavLink> </li>
                    <li><NavLink to='addIssue'>Add Issue</NavLink> </li>
                    <li><NavLink to='getIssue'>Issue's List</NavLink> </li>
                    <li><NavLink to='adminpage'>Admin Page </NavLink> </li>
                    <li>DB : {be.db == 200 ? <GreenDot/>: <RedDot/>}</li>
                    <li>Server : {be.server == 200 ? <GreenDot/>: <RedDot/>}</li>
                </div>
                <div>
                    <li><NavLink to='login'>{currentUserVal.mobile ? "My  Profile" : "Login"}</NavLink> </li>
                    <li style={{ display: `${currentUserVal.mobile ? 'none' : 'inline-block'}` }}><NavLink to='signup'>Sign Up</NavLink> </li>
                    <li><h3 style={{ marginBlock: '0' }}>{currentUserVal.hasOwnProperty('fName') && currentUserVal.fName + " " + currentUserVal.lName} </h3></li>
                    <li style={{ display: `${currentUserVal.mobile ?  'inline-block': 'none'}` }}><button onClick={logoutFunc}>LogOut </button> </li>
                    <li><button onClick={() => navigate(-1)}>Back</button></li>
                </div>
            </ul>
        </nav>
    )
}
export default Nav