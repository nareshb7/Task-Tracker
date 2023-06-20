import React, { useContext, useEffect, useState } from 'react'
import './chatbot.css'
import { Button, CloseButton } from 'react-bootstrap'
import { UserContext } from '../../App'

const ChatBot = () => {
    const {currentUserVal} = useContext(UserContext)
    const [showBot, setShowBot] = useState(false)
    const [message, setMessage] = useState('')
    const mszs = ['Hii, This is Hoyna, How may i help you?']
    const [messages, setMessages] = useState(mszs)
    const botStyle = {
        position: 'fixed',
        right: '70px',
        bottom: '95px',
        height: '450px',
        width: '350px',
        backgroundColor: '#fff',
        borderRadius: '10px 10px 0 10px',
        boxShadow:'2px 3px 10px 3px'
    }
    const addMessage = ()=> {
        setMessage('')
        setMessages([...messages, message])
    }
    useEffect(()=> {
        setTimeout(()=> {
            setShowBot(!showBot)
        },3000)
    }, [])
    return (
        <div>
            <div className='bg-primary rounded' style={{ position: 'fixed', right: '40px', bottom: '50px' }}>
                <i style={{ cursor: 'pointer' }} className={`fas fa-${showBot ? 'xmark': 'comment'} fs-1 bot-icon`} onClick={() => setShowBot(!showBot)}></i>
            </div>
            {
                showBot && <div id='chat-bot' style={botStyle}>
                    <span onClick={() => setShowBot(!showBot)} style={{position:'absolute', right:'10px', top:'5px'}}><CloseButton onClick={() => setShowBot(!showBot)}/></span>
                    <div className='bot-header'>
                        <h3>Resource One IT Solutions</h3>
                        <p>We typically reply in few minutes.</p>
                    </div>
                    <div className='bot-body'>{
                        messages.map((msz, idx)=> {
                            const side = idx %2 == 0 ? 'left' : 'right'
                            return <p key={idx} className={side}>{msz}</p>
                        })
                    }
                    </div>
                    <div className='bot-footer d-flex gap-1 p-1' >
                        <input value={message} onChange={(e)=> setMessage(e.target.value)} onKeyPress={(e)=> e.key == 'Enter' && addMessage()} type='text' className='form-control' placeholder='Ask me...'/>
                        <Button onClick={addMessage}><i className='fas fa-arrow-right'></i></Button>
                    </div>
                </div>
            }


        </div>
    )
}

export default ChatBot