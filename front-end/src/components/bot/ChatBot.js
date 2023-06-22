import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './chatbot.css'
import ChatBot1 from './ChatBot1'
import data from './messages.json'

const ChatBot = () => {
    const navigate = useNavigate()
    const [showBot, setShowBot] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setShowBot(true)
            console.log('Questions', data.map(val => val.key))
        }, 3000)
    }, [])
    return (
        <div>
            <div className='rounded' style={{ position: 'fixed', right: '40px', bottom: '50px' }}>
                <i style={{ cursor: 'pointer' }} className={`fas fa-${showBot ? 'xmark' : 'comment'} fs-1 bot-icon`} onClick={() => setShowBot(!showBot)}></i>
            </div>
            {
                showBot && <ChatBot1 setShowBot={setShowBot} showBot={showBot} />
            }
        </div>
    )
}

export default ChatBot