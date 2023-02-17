import React, {useContext, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../App'

const Nav =()=>{
    const {currentUserVal} = useContext(UserContext)
    console.log(currentUserVal, 'nav')
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
                <li><h3 style={{marginBlock:'0'}}>{currentUserVal.hasOwnProperty('fName') &&  currentUserVal.fName +" "+ currentUserVal.lName} </h3></li>
            </ul>
        </nav>
    )
}
export default Nav