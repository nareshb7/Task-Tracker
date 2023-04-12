import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import AddData from './issues/AddData'
import Description from './issues/Description'
import GetTask from './issues/GetTask'
import Home from './Home'
import Login from './registration/Login'
import MyProfile from './profile/MyProfile'
import Signup from './registration/Signup'
import AdminPage from './profile/AdminPage'
import UserUpdate from './profile/UserUpdate'
import ForgotPassword from './registration/ForgotPassword'
import MailVerification from './utils/MailVerification'
import ChatBox from './profile/chatBox/ChatBox'

const RoutesComp =()=> {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Navigate to='home' />} />
                <Route path='home' element={<Home /> } />
                <Route path='addIssue' element={<AddData/> } />
                <Route path='getIssue' element={<GetTask/> } />
                <Route path='description' element={<Description/> } />
                <Route path='signup' element={<Signup /> } />
                <Route path='login' element={<Login /> } />
                <Route path='/forgotpassword' element={<ForgotPassword />} />
                {/* <Route path='profile' element={<MyProfile/> } /> */}
                <Route path='adminpage' element={<AdminPage/>} />
                <Route path='updateuser' element={<UserUpdate />} />
                <Route path='verifymail/:path' element={<MailVerification/>} />
                <Route path='/chat' element={<ChatBox/>} />
            </Routes>
        </div>
    )
}
export default RoutesComp
