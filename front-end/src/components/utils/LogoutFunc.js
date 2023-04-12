import { setCookie } from "./CookieComp"
import { fetchCall } from "./fetch/UseFetch"
import { useNavigate } from "react-router-dom"

export const logoutFunc =async  (id) => {
    // setCurrentUserVal({})
    setCookie("63dab3b51d791ebc7821db51", 2)
    const res = await fetchCall('/api/logout', {id})
    return ''
  }