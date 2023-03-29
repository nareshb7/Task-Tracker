import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../redux/actions/Actions'

const Home =()=> {
    const dispatch = useDispatch()
    const data = useSelector(state=> state.data)
    const handleClick =()=> {
        dispatch(addUser(0))
    }
    return (
        <div>
            <h1>Homee</h1>
            <button onClick={handleClick}>Count : {data.count}</button>
        </div>
    )
}
export default Home