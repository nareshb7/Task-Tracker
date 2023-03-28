import React, { useContext, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { setCookie } from './utils/CookieComp'

const Nav = () => {
    const { currentUserVal, setCurrentUserVal } = useContext(UserContext)
    const navigate = useNavigate()
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
                    <li><button onClick={() => navigate(-1)}>Back</button></li>
                </div>
                <div>
                    <li><NavLink to='login'>{currentUserVal.mobile ? "My  Profile" : "Login"}</NavLink> </li>
                    <li style={{ display: `${currentUserVal.mobile ? 'none' : 'inline-block'}` }}><NavLink to='signup'>Sign Up</NavLink> </li>
                    <li><h3 style={{ marginBlock: '0' }}>{currentUserVal.hasOwnProperty('fName') && currentUserVal.fName + " " + currentUserVal.lName} </h3></li>
                    <li style={{ display: `${currentUserVal.mobile ?  'inline-block': 'none'}` }}><button onClick={logoutFunc}>LogOut </button> </li>
                </div>
            </ul>
        </nav>
    )
}
export default Nav