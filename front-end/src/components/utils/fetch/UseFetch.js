import axios from "axios"
export const fetchCall =async (url,data, method)=> {
    return await axios.post(url, data)
        .then(res => res.data)
        .catch(err => err)
}

export const fetchPutCall = async (url,data)=> {
    return await axios.put(url, data)
    .then(res=> res.data)
    .catch(err => err.message)
}