import axios from "axios"

const getToken = ()=> {
    return sessionStorage.getItem('userID')
}
const headers = {
    'Content-Type': 'application/json',
    'Authorization': getToken()
  }
export const fetchCall =async (url,data)=> {
    return await axios.post(url, data,{headers})
        .then(res => res.data)
        .catch(err => err.response.data)
}

export const fetchPutCall = async (url,data)=> {
    return await axios.put(url, data, {headers})
    .then(res=> res.data)
        .catch(err => err.message)
}
export const fetchGetCall = async (url, params) => {
    return await axios.get(url, {params,headers})
    .then(res=> {
        return {data: res.data, success: true, error:false}
    })
    .catch(err => {
        return {error: err.response.data?.message, success: false, data: false}
    })
}
export const fetchDeletecall = async (url, data) => {
    return await axios.delete(url, {data, headers})
        .then(res => res.data)
        .catch(err => err.message)
}