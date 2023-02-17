import React, {useContext, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../App'

const Nav =()=>{
    const {currentUserVal} = useContext(UserContext)
    return (
        <nav>
            <ul>
                <li>
                    <img src='' alt='' />
                    Task-Tracker
                </li>
                <li><NavLink to='react'>React </NavLink> </li>
                <li><NavLink to='addIssue'>Add Data</NavLink> </li>
                <li><NavLink to='getIssue'>Get Data</NavLink> </li>
                <li><NavLink to='login'>{currentUserVal.mobile ? "My  Profile":"Login" }</NavLink> </li>
                <li><NavLink to='getallusers'>Get All Users </NavLink> </li>
                <li style={{display: `${currentUserVal.mobile ? 'none': 'inline-block'}`}}><NavLink to='signup'>Sign Up</NavLink> </li>
            </ul>
        </nav>
    )
}
export default Nav