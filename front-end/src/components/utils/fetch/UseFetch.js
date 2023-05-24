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
    .then(res=> res.data)
    .catch(err => err.message)
}
export const fetchDeletecall = async (url, data) => {
    return await axios.delete(url, {data})
        .then(res => res.data)
        .catch(err => err.message)
}