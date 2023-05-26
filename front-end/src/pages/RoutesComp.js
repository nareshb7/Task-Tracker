import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AddData from './AddData'
import Description from '../components/issues/Description'
import GetTask from './IssueList'
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
import Dashboard from './Dashboard'
import EmployeeStats from './employeeStats/EmployeeStats'
import ContactUs from './contactUs/ContactUs'
import ContactUsAdmin from './contactUs/ContactUsAdmin'

const RoutesComp = () => {
    const { currentUserVal } = useContext(UserContext)
    return (
        <div className='container-fluid'>
            <Routes>
                <Route path='/' element={<Navigate to='home' />} />
                <Route path='home' element={<Home />} />
                <Route path='addIssue' element={<AddData />} />
                <Route path='getIssue' element={<GetTask />} />
                <Route path='description' element={<Description />} />
                <Route path='/chat' element={<ChatBox />} />
                <Route path='adminpage' element={<AdminPage />} />
                <Route path='login' element={<Login />} /> 
                <Route path='verifymail/:path' element={<MailVerification />} />
                <Route path='contact' element={<ContactUs/>}/>
                <Route path='contactData' element={<ContactUsAdmin/>}/>
                {
                    !currentUserVal.fName && (
                        <Route path='signup' element={<Signup />} />
                    )
                }
                {
                    currentUserVal.fName && <>
                        <Route path='/forgotpassword' element={<ForgotPassword />} />
                        <Route path='updateuser' element={<UserUpdate />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/empstats' element={<EmployeeStats/>}/>
                    </>
                }
                {/* <Route path='profile' element={<MyProfile/> } /> */}
            </Routes>
        </div>
    )
}
export default RoutesComp
