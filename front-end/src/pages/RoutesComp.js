import React, { Suspense, lazy, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from '../App'
import Loader from '../components/utils/loader/Loader'
const MyProfile = lazy(()=> import('../pages/MyProfile'))
const MailVerification = lazy(()=> import('../components/utils/MailVerification'))
const ForgotPassword = lazy(()=> import('../components/registration/ForgotPassword'))
const UserUpdate = lazy(()=> import('../components/profile/UserUpdate'))
const Home = lazy(()=> import('./Home'))
const NoRouteFound = lazy(()=> import('../components/utils/NoRouteFound'))
const MultiplicationGame = lazy(()=> import('../components/games/multiplication'))
const RockPaperScissor = lazy(()=> import('../components/games/rockPaperScissor'))
const ContactUsAdmin = lazy(()=> import('./contactUs/ContactUsAdmin'))
const ContactUs = lazy(()=> import('./contactUs/ContactUs'))
const ChatBox = lazy(()=> import('../pages/chatBox/ChatBox'))
const Tickets = lazy(()=> import('./Tickets'))
const Description = lazy(()=> import('../components/issues/Description'))
const AdminPage = lazy(()=> import('./adminPage/AdminPage'))
const Login = lazy(()=> import('./Login'))
const Signup = lazy(()=> import('./Login'))
const Dashboard = lazy(()=> import('./dashboard/Dashboard'))
const EmployeeStats = lazy(()=> import('./employeeStats/EmployeeStats'))
const ActivityPage = lazy(()=> import('./activityPage/ActivityPage'))
const AdminBotPage = lazy(()=> import('../components/bot/AdminBotPage'))
const ClientStats = lazy(()=> import('./employeeStats/ClientStats'))

const RoutesComp = () => {
    const { isLoggedIn } = useContext(UserContext)
    const routes = [
        {path:'/', element: <Navigate to='home'/>},
        {path:'tickets', element:<Tickets />},
        {path:'description', element:<Description />},
        {path:'chat', element:<ChatBox />},
        {path:'adminpage', element:<AdminPage />},
        {path:'verifymail/:path', element:<MailVerification /> },
        {path:'contact', element: <ContactUs/>},
        {path:'contactData', element:<ContactUsAdmin/> },
        {path:'activity', element:<ActivityPage/> },
        {path:'*', element:<NoRouteFound/> },
        {path:'forgotpassword', element:<ForgotPassword />},
        {path:'dashboard', element:<Dashboard />},
        {path:'updateuser', element:<UserUpdate />},
        {path:'empstats', element:<EmployeeStats/>},
        {path:'game/1', element:<RockPaperScissor/>},
        {path:'game/2', element:<MultiplicationGame/>},
        {path:'clientstats', element:<ClientStats />},
        {path:'botrequest', element:<AdminBotPage />},
        {path:'profile', element: <MyProfile/>}
    ]
    const defaultRoutes= [
        {path:'/', element:<Navigate to='home' />},
        {path:'home', element:<Home />},
        {path:'login', element:<Login />},
        {path:'*', element:<NoRouteFound/>},
        {path:'signup', element:<Signup />},
    ]
    return (
        <div className=''>
            <Routes>
                {
                    defaultRoutes.map((route, idx)=> <Route key={idx} path={route.path} element= {<Suspense fallback={<Loader/>}>{route.element}</Suspense> }/>)
                }
                {
                    isLoggedIn && routes.map((route, idx)=> <Route key={idx} path={route.path} element= {<Suspense fallback={<Loader/>}>{route.element}</Suspense> }/>)
                }
            </Routes>
        </div>
    )
}
export default RoutesComp
