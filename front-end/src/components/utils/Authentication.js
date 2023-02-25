import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {CookieComp} from './CookieComp'

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState({})
    useEffect(()=> {
        console.log('authenticating......')
        const userid = CookieComp() 
        if (userid) {
            axios.post('/api/getparticularuser',{id: userid} )
        .then(data => setCurrentUser(data.data))
        .catch(err => console.log(err, 'err'))
        }
        
    }, [])
    return currentUser
}

export default useAuth