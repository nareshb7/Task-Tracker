import axios from "axios"
export const fetchCall =async (url,data)=> {
    console.log(data, 'dataapi')
    return await axios.post(url, data)
        .then(res => res.data)
        .catch(err => err)
}