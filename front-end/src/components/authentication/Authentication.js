import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {CookieComp} from '../cookieset/CookieComp'

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState({})
    const [isAlreadyUser, setIsAlreadyUser] = useState('')
    useEffect(()=> {
        // axios.get('/api/getCurrentUser', {
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // })
        //     .then(data => console.log(data, 'data auth'))
        //     .catch(err => setCurrentUser(JSON.stringify(err)))
        const userid = CookieComp() 
        if (userid) {
            axios.post('/api/getparticularuser',{id: userid} )
        .then(data => setCurrentUser(data.data))
        .catch(err => console.log(err, 'err'))
        }
        
    }, [])
    useEffect(()=> {
        // console.log(currentUser, 'auth')
        // setIsAlreadyUser(CookieComp())
    }, [currentUser])
    // console.log(isAlreadyUser, 'cookie result')
    return currentUser
}

export default useAuth