import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AddData from './AddData'
import Description from '../components/issues/Description'
import GetTask from './GetTask'
import Home from './Home'
import Login from './Login'
import MyProfile from './MyProfile'
import Signup from './Signup'
import AdminPage from './AdminPage'
import UserUpdate from '../components/profile/UserUpdate'
import ForgotPassword from '../components/registration/ForgotPassword'
import MailVerification from '../components/utils/MailVerification'
import ChatBox from '../chatBox/ChatBox'
import { UserContext } from '../App'

const RoutesComp = () => {
    const { currentUserVal } = useContext(UserContext)
    return (
        <div>
            <Routes>
                <Route path='/' element={<Navigate to='home' />} />
                <Route path='home' element={<Home />} />
                <Route path='addIssue' element={<AddData />} />
                <Route path='getIssue' element={<GetTask />} />
                <Route path='description' element={<Description />} />
                {
                    currentUserVal.fName && (
                        <Route path='signup' element={<Signup />} />
                    )
                }
                <Route path='login' element={<Login />} />
                <Route path='/forgotpassword' element={<ForgotPassword />} />
                {/* <Route path='profile' element={<MyProfile/> } /> */}
                <Route path='adminpage' element={<AdminPage />} />
                <Route path='updateuser' element={<UserUpdate />} />
                <Route path='verifymail/:path' element={<MailVerification />} />
                <Route path='/chat' element={<ChatBox />} />
            </Routes>
        </div>
    )
}
export default RoutesComp
