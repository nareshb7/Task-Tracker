import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CookieComp, setCookie } from './CookieComp'
import { addActivity } from '../../pages/activityPage/ActivityPage'

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState({})
    const getData = async (userid) => {
        const browserName = getBrowserName()
        const location =await getLocationCoords()
        await axios.post('/api/getparticularuser', { id: userid, browserName, location })
            .then(data => {
                sessionStorage.setItem('userID', JSON.stringify(data.data._id))
                setCurrentUser(data.data)
                setCookie(userid, 2)
                addActivity(data.data, 'App page', `Reopened Application`)
            })
            .catch(err => console.log(err, 'err'))
    }
    useEffect(() => {
        console.log('authenticating......')
        const userid = CookieComp()
        if (userid) {
            getData(userid)
        }
    }, [])
    return currentUser
}

export default useAuth

export async function getLocationCoords() {
    let obj = {}
    window.navigator.geolocation.watchPosition(function (position) {
        obj = {latitude: position.coords.latitude, longitude: position.coords.longitude}
      });
    return await fetch('https://geolocation-db.com/json/')
        .then((res) => res.json())
        .then(data => {
            return {...data, ...obj}
        })
        .catch((err) => console.log(err, 'err'));
}

export function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Firefox')) {
        return 'Mozilla Firefox';
    } else if (userAgent.includes('Edg')) {
        return 'Microsoft Edge'
    } else if (userAgent.includes('Chrome')) {
        return 'Google Chrome';
    } else if (userAgent.includes('Safari')) {
        return 'Apple Safari';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
        return 'Internet Explorer';
    } else {
        return 'Unknown';
    }
}