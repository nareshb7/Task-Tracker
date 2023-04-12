import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { setCookie } from './utils/CookieComp'
import { GreenDot, RedDot } from './utils/Dots/Dots'
import { BE_URL } from './utils/Constants'
import { fetchCall } from './utils/fetch/UseFetch'
import { logoutFunc } from './utils/LogoutFunc'

const Nav = () => {
    const { currentUserVal, setCurrentUserVal, socket } = useContext(UserContext)
    const [be,setBe] = useState({
        db:200,
        server:200
    })
    const navigate = useNavigate()
    useEffect(()=> {
        axios.get(`${BE_URL}/server`)
        .then(res=> setBe({...be, server: res.data.statusCode}))
        .catch(err=> setBe({...be, server: err?.statusCode}))

        axios.get(`${BE_URL}/db`)
        .then(res=> setBe({...be, db : res.data.statusCode}))
        .catch(err=> setBe({...be, db : err?.statusCode}))
        console.log("Backend",be)
    },[window.location.pathname])
    const logout =async (id)=> {
        await logoutFunc(id)
        setCurrentUserVal({})
        navigate('/login')
        socket.emit('new-user')
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
                    <li><NavLink to='/chat' >Members</NavLink> </li>
                    <li>DB : {be.db == 200 ? <GreenDot/>: <RedDot/>}</li>
                    <li>Server : {be.server == 200 ? <GreenDot/>: <RedDot/>}</li>
                </div>
                <div>
                    <li><NavLink to='login'>{currentUserVal.mobile ? "My  Profile" : "Login"}</NavLink> </li>
                    <li style={{ display: `${currentUserVal.mobile ? 'none' : 'inline-block'}` }}><NavLink to='signup'>Sign Up</NavLink> </li>
                    <li><h3 style={{ marginBlock: '0' }}>{currentUserVal.hasOwnProperty('fName') && currentUserVal.fName + " " + currentUserVal.lName} </h3></li>
                    <li style={{ display: `${currentUserVal.mobile ?  'inline-block': 'none'}` }}><button onClick={()=> logout(currentUserVal._id)}>LogOut </button> </li>
                    <li><button onClick={() => navigate(-1)}>Back</button></li>
                </div>
            </ul>
        </nav>
    )
}
export default Nav