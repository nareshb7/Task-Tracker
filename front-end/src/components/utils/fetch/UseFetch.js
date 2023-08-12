import axios from "axios"

const getToken = ()=> {
    return sessionStorage.getItem('userID')
}
const headers = {
    'Content-Type': 'application/json',
    'Authorization': getToken()
  }

export const fetchCall =async (url,data, options)=> {
    return await axios.post(url, data,{...options, headers})
        .then(res => res.data)
        .catch(err => err.response.data)
}
export const fileUpload =async (url,data, options)=> {
    return await axios.post(url, data,{headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
            return {data: res.data, success: true}
        })
        .catch(err => {
            return {error: err.response.data, success: false}
        })
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
        return {error: err.response.data, success: false, data: false}
    })
}
export const fetchDeletecall = async (url, data) => {
    return await axios.delete(url, {data, headers})
        .then(res => res.data)
        .catch(err => err.message)
}