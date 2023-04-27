import { setCookie } from "./CookieComp"
import { fetchCall } from "./fetch/UseFetch"
import { useNavigate } from "react-router-dom"

export const logoutFunc =async  (user, val ) => {
    // setCurrentUserVal({})
    console.log('logout done', val)
    const status = val || 'Offline'
    const res = await fetchCall('/api/logout', {_id: user._id, newMessages: user.newMessages, status})
    return ''
  }
