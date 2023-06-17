import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {CookieComp, setCookie} from './CookieComp'
import { addActivity } from '../../pages/activityPage/ActivityPage'

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState({})
    useEffect(()=> {
        console.log('authenticating......')
        const userid = CookieComp() 
        if (userid) {
            axios.post('/api/getparticularuser',{id: userid} )
        .then(data => {
            setCurrentUser(data.data)
            setCookie(userid,2)
            addActivity(data.data, 'App page', `Reopened Application`)
        })
        .catch(err => console.log(err, 'err'))
        }
    }, [])
    return currentUser
}

export default useAuth