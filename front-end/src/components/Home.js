import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Home =()=> {
    const dispatch = useDispatch()
    const state = useSelector(state=> state)
    console.log(state, 'state 972==')
    return (
        <div>
            <h1>Homee</h1>
            <button onClick={handleClick}>Count : </button>
        </div>
    )
}
export default Home