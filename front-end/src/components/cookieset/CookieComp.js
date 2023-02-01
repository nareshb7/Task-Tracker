import React from 'react'


export const setCookie = ( cvalue, exdays)=> {
    const d = new Date()
    d.setTime(d.getTime() + (exdays *24*60* 60* 1000))
    let expires = "expires="+d.toUTCString()
    document.cookie = 'presentTaskUser'+ "="+ cvalue+ ";"+ expires+ ";path=/"
  }

export const CookieComp = (id) => {
  const getCookie =(cname)=> {
    let name =  cname + "="
    let ca = document.cookie.split('=')
    return ca[1]
  }
  const checkCookie =()=> {
    let user = getCookie('presentTaskUser')
    if (user) {
        return user
    } else {
        setCookie('presentTaskUser', "9010586402",2)
        return false
    }
  }
  return checkCookie()
}
