import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import AddData from './components/addSolution/AddData'
import Description from './components/Description'
import GetTask from './components/GetTask'
import Home from './components/Home'
import Login from './components/login/Login'
import MyProfile from './components/profile/MyProfile'
import Signup from './components/signup/Signup'

const RoutesComp =()=> {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Navigate to='home' />} />
                <Route path='home' element={<Home /> } />
                <Route path='adddata' element={<AddData/> } />
                <Route path='getData' element={<GetTask/> } />
                <Route path='description' element={<Description/> } />
                <Route path='signup' element={<Signup /> } />
                <Route path='login' element={<Login /> } />
                <Route path='profile' element={<MyProfile/> } />
            </Routes>
        </div>
    )
}
export default RoutesComp
