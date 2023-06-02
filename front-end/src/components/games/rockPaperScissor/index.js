import React, { useEffect } from 'react'
import './style.css'

const RockPaperScissor = () => {
    
const getComputerChoice=()=>{
    const arr= ['Rock', 'Paper', 'Scissor']
    let  random = Math.floor(Math.random()* arr.length)
    return arr[random]
}

const getResult =(playerChoice, computerChoice)=>{
    let score ;
    if (playerChoice==computerChoice){
        score=0
    }
    else if (playerChoice== 'Rock' && computerChoice== 'Scissor'){
        score=1
    }
    else if (playerChoice == 'Scissor' && computerChoice== 'Paper'){
        score=1
    }
    else if (playerChoice == 'Paper' && computerChoice=='Rock'){
        score=1
    }
    else {
        score= -1
    }
    return score
}
const showResult =(score, playerChoice, computerChoice)=>{
    let resultEl= document.getElementById('result')
    switch (score){
        case 1:{
            resultEl.innerText= '😎 You Won'
            break
        }
        case 0:{
            resultEl.innerText= " It's Draw"
            break
        }
        case -1:{
            resultEl.innerText= '😐 You Lose'
            break
        }
    }
    let scoreEl= document.getElementById('score')
    scoreEl.innerText = `${Number(scoreEl.innerText) + score}`
    let hands= document.getElementById('hands')
    hands.innerText = `👨 ${playerChoice} vs 💻 ${computerChoice}`
}

const onClickRPS= (playerChoice)=>{
    let computerChoice = getComputerChoice()
    let score = getResult(playerChoice.value, computerChoice)
    showResult(score, playerChoice.value, computerChoice)
}

const playGame= ()=>{
    let playerOptions= document.querySelectorAll('.rpsButton')
    playerOptions.forEach((option)=>{
        option.onclick =()=> onClickRPS(option)
    })

    let reset = document.getElementById('resetBtn')
    reset.onclick=()=> resetGame()
}

const resetGame=()=>{
    let scoreEl = document.getElementById('score')
    let handsEl = document.getElementById('hands')
    let resultEl= document.getElementById('result')
    scoreEl.innerText =''
    handsEl.innerText=''
    resultEl.innerText=''
}
useEffect(()=> {
    playGame();
},[])
  return (
    <div class="wrapper">
        <div>
            <button class="rpsButton" value="Rock">Rock</button>
            <button class="rpsButton" value="Paper">Paper</button>
            <button class="rpsButton" value="Scissor">Scissor</button>
        </div>
        <div class='result'>
            <h3 id="score"></h3>
            <h3 id="hands"></h3>
            <h3 id="result"></h3>
        </div>
        <div>
            <button id="resetBtn">Reset</button>
        </div>
    </div>
  )
}

export default RockPaperScissor