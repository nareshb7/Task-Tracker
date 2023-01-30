import React, {useState, useEffect} from 'react'
import axios from 'axios'

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState({})
    useEffect(()=> {
        axios.get('/getCurrentUser', {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(data => setCurrentUser(data.data[0].currentUser))
            .catch(err => setCurrentUser(JSON.stringify(err)))
    
    }, [])
    return currentUser
}

export default useAuth