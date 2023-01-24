import React from 'react'
import { NavLink } from 'react-router-dom'

const Nav =()=>{
    return (
        <nav>
            <ul>
                <li>
                    <img src='' alt='' />
                    Task-Tracker
                </li>
                <li><NavLink to='react'>React </NavLink> </li>
                <li><NavLink to='addData'>Add Data</NavLink> </li>
                <li><NavLink to='getData'>Get Data</NavLink> </li>
                <li><NavLink to='signup'>Sign Up</NavLink> </li>
                <li><NavLink to='login'>Log In </NavLink> </li>
                <li><NavLink to='profile' >My Profile</NavLink> </li>
            </ul>
        </nav>
    )
}
export default Nav