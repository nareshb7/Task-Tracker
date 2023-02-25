import React, {useContext, useEffect} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'

const Nav =()=>{
    const {currentUserVal} = useContext(UserContext)
    const navigate = useNavigate()
    return (
        <nav>
            <ul>
                <li>
                    <img src='' alt='' />
                    Task-Tracker
                </li>
                <li><NavLink to='/'>React </NavLink> </li>
                <li><NavLink to='addIssue'>Add Issue</NavLink> </li>
                <li><NavLink to='getIssue'>Issue's List</NavLink> </li>
                <li><NavLink to='login'>{currentUserVal.mobile ? "My  Profile":"Login" }</NavLink> </li>
                <li><NavLink to='adminpage'>Admin Page </NavLink> </li>
                <li style={{display: `${currentUserVal.mobile ? 'none': 'inline-block'}`}}><NavLink to='signup'>Sign Up</NavLink> </li>
                <li><h3 style={{marginBlock:'0'}}>{currentUserVal.hasOwnProperty('fName') &&  currentUserVal.fName +" "+ currentUserVal.lName} </h3></li>
                <li><button onClick={()=> navigate(-1)}>Back</button></li>
            </ul>
        </nav>
    )
}
export default Nav