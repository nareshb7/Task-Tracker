import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import './style.css'

const MultiplicationGame = () => {
    const generateNum = () => {
        return Math.ceil(Math.random() * 10)
    }
    const [num1, setNum1] = useState(generateNum())
    const [num2, setNum2] = useState(generateNum())
    const [score, setScore] = useState(JSON.parse(localStorage.getItem("score")) || 0)
    const [userAns, setUserAns] = useState(null)
    const [isCorrectAns, setIsCorrectAns] = useState(false)

    function updateLocalStorage() {
        localStorage.setItem("score", JSON.stringify(score));
    }

    function resetScore() {
        localStorage.setItem("score", 0);
        setScore(0)
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        const correctAnswer = num1 * num2
        if (userAns == correctAnswer) {
            setScore(s => s + 1)
            updateLocalStorage()
            generateNewNumbers()
            setIsCorrectAns(true)
        } else {
            score > 0 && setScore(s => s - 1)
            updateLocalStorage()
            setIsCorrectAns(false)
        }
    }
    const generateNewNumbers = () => {
        setNum1(generateNum())
        setNum2(generateNum())
    }
    return (
        <Container>
            <form class="form" id="form" onSubmit={handleSubmit}>
                <h4 className="score" id="score">Score : {score}</h4>
                <h2 className="question" id="question">What is {num1} multiply by {num2}?</h2>
                <input type="text" className="input" id="input" placeholder="Enter your answer" onChange={(e) => setUserAns(e.target.value)} autofocus autocomplete="off"></input>
                <div className=' my-2 fw-bold fs-5'>
                    {
                        userAns && <>
                            {isCorrectAns ?
                                <span style={{ color: '#f0f' }}> Correct </span> : <span style={{ color: '#f00' }}>You are Mistaken!</span>
                            }
                        </>
                    }

                </div>
                <button type="submit" className="mul-btn">Submit</button>
                <button type="button" className="mul-btn" onClick={resetScore}>Reset</button>
            </form>
        </Container>
    )
}

export default MultiplicationGame