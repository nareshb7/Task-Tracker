import axios from "axios"
export const fetchCall =async (url,data)=> {
    return await axios.post(url, data)
        .then(res => res.data)
        .catch(err => err)
}

export const fetchPutCall = async (url,data)=> {
    return await axios.put(url, data)
    .then(res=> res.data)
        .catch(err => err.message)
}
export const fetchGetCall = async (url, params) => {
    return await axios.get(url, {params})
    .then(res=> {
        return {data: res.data, success: true, error:false}
    })
    .catch(err => {
        return {error: err, success: false, data: false}
    })
}
export const fetchDeletecall = async (url, data) => {
    return await axios.delete(url, {data})
        .then(res => res.data)
        .catch(err => err.message)
}