import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, CloseButton } from 'react-bootstrap'
import { UserContext } from '../../App'
import { getFullName } from '../utils/GetFullName'
import data from './messages.json'
import DotTyping from '../utils/typing/DotTyping'

import { responseMessage } from './ResponseMessage'
import { useNavigate } from 'react-router-dom'

const ChatBot1 = ({ setShowBot, showBot }) => {
    const { currentUserVal } = useContext(UserContext)
    const messageEndRef = useRef(null)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [mszLoading, setMszLoading] = useState(false)
    const botStyle = {
        position: 'fixed',
        right: '70px',
        bottom: '95px',
        height: '450px',
        width: '350px',
        backgroundColor: '#fff',
        borderRadius: '10px 10px 0 10px',
        boxShadow: '2px 3px 10px 3px'
    }
    const mszFormatter = (value, cls='left')=> {
        return {class: cls, value: value}
    }
    const addMessage =async () => {
        setMessages((e) => [...e, mszFormatter(message, 'right')])
        setMszLoading(true)
        const replyMessage =await responseMessage(currentUserVal, message)
        setMessage('')
        setTimeout(() => {
            if (replyMessage) setMessages((e) => [...e, mszFormatter(replyMessage)])
            else setMessages((e) => [...e, mszFormatter('Oops!,Maybe I m not able to understand ur question., Try new One!')])
            setMszLoading(false)
        }, 500);
    }
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])
    useEffect(() => {
        const msz = `Hii ${currentUserVal?.fName ? getFullName(currentUserVal) : 'User'}, This is Hoyna, How may i help you?`
        currentUserVal?.fName ? setMessages([mszFormatter(msz)]) : setMessages([mszFormatter(msz),mszFormatter('May I know ur name?')])
    }, [currentUserVal])
    return (
        <div id='chat-bot' style={botStyle}>
            <span onClick={() => setShowBot(!showBot)} style={{ position: 'absolute', right: '10px', top: '5px' }}><CloseButton onClick={() => setShowBot(!showBot)} /></span>
            <div className='bot-header'>
                <h3>Resource One IT Solutions</h3>
                <p>We typically reply in few minutes.</p>
            </div>
            <div className='bot-body scrollbar-container'>
                {
                    messages.map((msz, idx) => {
                        return <div key={idx} className={msz.class} dangerouslySetInnerHTML={{__html: msz.value}}></div>
                    })
                }
                { mszLoading && <DotTyping /> }
                <div ref={messageEndRef}></div>
            </div>
            <div className='bot-footer d-flex gap-1 p-1' >
                <input list='keys' value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key == 'Enter' && addMessage()} type='text' className='form-control' placeholder='Ask me...' />
                {/* <datalist id='keys'>
                    {
                        keys.map((val, idx)=> <option value={val} key={idx} />)
                    }
                </datalist> */}
                <Button onClick={addMessage}><i className='fas fa-arrow-right'></i></Button>
            </div>
        </div>
    )
}

export default ChatBot1