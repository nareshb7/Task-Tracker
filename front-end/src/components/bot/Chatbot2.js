import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, CloseButton } from 'react-bootstrap'
import { UserContext } from '../../App'
import { getFullName } from '../utils/GetFullName'
import DotTyping from '../utils/typing/DotTyping'
import { responseMessage } from './ResponseMessage'

const Chatbot2 = ({ setShowBot, showBot }) => {
    const { currentUserVal } = useContext(UserContext)
    const messageEndRef = useRef(null)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [mszLoading, setMszLoading] = useState(false)
    const [lastSystemMsz, setLastSystemMsz] = useState('initial-response')
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
    const addMessage =async (msz) => {
        console.log('ADDMSZ', msz)
    }
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }
    const handleClick = (response)=> {
        console.log(lastSystemMsz,response )
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])
    useEffect(() => {
        let msz = `Hii ${currentUserVal?.fName ? getFullName(currentUserVal) : 'User'}, This is Hoyna, How may i help you?`
        // msz += `<br>1.Tickets <br>2.Technical Issue <br>3.Contact Admin <br>4.Profile Update <br>5.Feedback/Suggestions`
        let reply = <div><Button onClick={()=> handleClick(1)} className='btn btn-primary my-1'>1.Tickets</Button><br/>
        <Button onClick={()=> handleClick(2)} className='btn btn-primary my-1'>2.Technical Issue</Button><br/>
        <Button onClick={()=> handleClick(3)} className='btn btn-primary my-1'>3.Contact Admin</Button><br/>
        <Button onClick={()=> handleClick(4)} className='btn btn-primary my-1'>4.Profile Update</Button><br/>
        <Button onClick={()=> handleClick(5)} className='btn btn-primary my-1'>5.Feedback/ Suggestions</Button></div>
        currentUserVal?.fName ? setMessages([mszFormatter(msz), mszFormatter(reply, 'right')]) : setMessages([mszFormatter(msz),mszFormatter('May I know ur name?')])
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
                        console.log('MSZ', msz.value)
                        return <div key={idx} className={msz.class} > {msz.value}</div>
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

export default Chatbot2