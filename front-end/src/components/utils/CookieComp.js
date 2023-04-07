export const setCookie = ( cvalue, exdays)=> {
  const d = new Date()
  d.setTime(d.getTime() + (exdays *24*60* 60* 1000))
  let expires = "expires="+d.toUTCString()
  document.cookie = 'presentTaskUser'+ "="+ cvalue+ ";"+ expires+ ";path=/"
}

export const CookieComp = (id) => {
const getCookie =(cname)=> {
  let totalCookie = document.cookie.split(';')
  let ca = totalCookie.find(val => val.includes(cname))
  if (ca){
    ca = ca.split('=')
    return ca[1]
  }
  return null
}
const checkCookie =()=> {
  let user = getCookie('presentTaskUser')
  if (user) {
      return user
  } else {
      setCookie("63daa3b51d791ebc7921db51",2)
      return false
  }
}
return checkCookie()
}
