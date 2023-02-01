import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {CookieComp} from '../cookieset/CookieComp'

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState({})
    const [isAlreadyUser, setIsAlreadyUser] = useState('')
    useEffect(()=> {
        axios.get('/getCurrentUser', {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(data => setCurrentUser(data.data[0].currentUser))
            .catch(err => setCurrentUser(JSON.stringify(err)))
    }, [])
    useEffect(()=> {
        console.log(currentUser, 'auth')
        setIsAlreadyUser(CookieComp())
    }, [currentUser])
    console.log(isAlreadyUser, 'cookie result')
    return currentUser
}

export default useAuth