import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import './style.css'
import Modal from '../../modal/Modal'

const MultiplicationGame = () => {
    const [maxNum, setMaxNum] = useState(10)
    const generateNum = () => {
        return Math.ceil(Math.random() * maxNum)
    }
    const [num1, setNum1] = useState(generateNum())
    const [num2, setNum2] = useState(generateNum())
    const [score, setScore] = useState(JSON.parse(localStorage.getItem("score")) || 0)
    const [userAns, setUserAns] = useState('')
    const [showAns, setShowAns] = useState(false)
    const [isCorrectAns, setIsCorrectAns] = useState(false)
    const [openTImerInput, setOpenTimerInput] = useState(false)
    const [timer, setTimer] = useState(0)
    const [remainSeconds,setRemainSeconds] = useState(1)
    const [val,setVal] = useState('')
    const [totalScore, setTotalScore] = useState({
        correct:0,
        wrong:0,
        total:0,
        attempted:0
    })
    const [isModalOpen, setIsModalOpen] = useState(false)

    function updateLocalStorage() {
        localStorage.setItem("score", JSON.stringify(score));
    }
    
    function resetScore() {
        localStorage.setItem("score", 0);
        setScore(0)
        setTotalScore({
            correct:0,
            wrong:0,
            total:0,
            attempted:0
        })
        generateNewNumbers()
        clearInterval(val)
        setRemainSeconds(1)
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setShowAns(true)
        const correctAnswer = num1 * num2
        if (userAns == correctAnswer) {
            setScore(s => s + 1)
            updateLocalStorage()
            generateNewNumbers()
            setIsCorrectAns(true)
            setUserAns('')
            setTotalScore({...totalScore, correct: totalScore.correct + 1, total: totalScore.total + 1, attempted: totalScore.attempted + 1})
        } else {
            score > 0 && setScore(s => s - 1)
            setTotalScore({...totalScore, correct: totalScore.wrong + 1, total: totalScore.total - 1})
            updateLocalStorage()
            setIsCorrectAns(false)
        }
    }
    const generateNewNumbers = () => {
        setNum1(generateNum())
        setNum2(generateNum())
    }
    const timerFunc = () => {
        setOpenTimerInput(!openTImerInput)
    }
    const startCountdown = ()=> {
        setTotalScore({
            correct:0,
            wrong:0,
            total:0,
            attempted:0
        })
        setOpenTimerInput(false)
        setRemainSeconds(timer)
        setVal(setInterval(()=> {
            setRemainSeconds(c=> c - 1)
        }, 1000))
    }
    const maxNumFunc = ()=> {
        const val = window.prompt('Enter max value')
        if (val) {
            setMaxNum(val)
            generateNewNumbers()
        }
    }
    useEffect(()=> {
        if (remainSeconds == 0) {
            clearInterval(val)
            setIsModalOpen(true)
        }
    },[remainSeconds])
   
    return (
        <Container>
            <form className="form" id="form" onSubmit={handleSubmit}>
                <h4 className="score" id="score">Score : {totalScore.total}</h4>
                <h4 className='score'><span className='bg-success rounded text-center d-inline-block' style={{minWidth:'90px', padding:'3px'}}> {remainSeconds} sec's </span></h4>
                <h2 className="question" id="question">What is {num1} multiply by {num2}? </h2>
                <div className='d-flex'>
                    <Button className='bg-success fw-600' onClick={maxNumFunc}>Set Max Number - <span style={{color:'#ff0'}}>{maxNum}</span></Button>
                    <Button className='bg-success' onClick={timerFunc}>Set Timer</Button>
                    {openTImerInput && <>
                        <input
                            value={timer}
                            onChange={(e) => setTimer(e.target.value)}
                            style={{ width: '50%' }} type='number'
                            className='form-control'
                            placeholder='enter value in seconds...' 
                        />
                        <Button onClick={startCountdown}>Set</Button> </>
                    }
                </div>
                <input 
                type="text" 
                className="input" 
                id="input" 
                value={userAns} 
                placeholder="Enter your answer" 
                onChange={(e) => setUserAns(e.target.value)} 
                autoFocus 
                autoComplete="off"></input>
                <div className=' my-2 fw-bold fs-5'>
                    {
                        showAns && <>
                            {isCorrectAns ?
                                <span style={{ color: '#f0f' }}> Correct </span> : <span style={{ color: '#f00' }}>You are Mistaken!</span>
                            }
                        </>
                    }

                </div>
                <button type="submit" className="mul-btn">Submit</button>
                <button type="button" className="mul-btn" onClick={resetScore}>Reset</button>
            </form>
            <Modal isOpen={isModalOpen} setModal={setIsModalOpen} >
                    <div>
                        <h4>Time : <span className='text-end'>{timer} sec's</span></h4>
                        <h4>Your Total Score : <span>{totalScore.total}</span></h4>
                        <h4>Corrected Ans : <span>{totalScore.correct}</span></h4>
                        <h4>Wrong Ans: <span>{totalScore.wrong}</span></h4>
                        <h4>Attempeted Questions : <span>{totalScore.attempted}</span></h4>
                    </div>
            </Modal>
        </Container>
    )
}

export default MultiplicationGame