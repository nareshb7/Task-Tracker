import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

const MessageBox = ({ user, opponent, setOpenMszList, socket, roomId }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const getFormattedDate =()=> {
        const date = new Date()
        const year = date.getFullYear()
        let month = (1+ date.getMonth()).toString()
        month = month.length > 1 ? month : "0"+ month
        let day = date.getDate().toString()
        day = day.length > 1 ? day : "0"+ day
        return `${month}/${day}/${year}` 
    }
    const todayDate = getFormattedDate()

    const sendMessage = () => {
        if(!message) return;
        const today = new Date()
        const minutes = today.getMinutes() < 10 ? "0"+ today.getMinutes() : today.getMinutes()
        const time = today.getHours()+ ':'+ minutes;
        console.log('messge-sent',roomId, message, user,time, todayDate , socket)
        socket.emit('message-room',roomId, message, user,time, todayDate)
        // socket.emit('check', 'check')
        setMessage('')
        setMessages([...messages, message])
        return
    }
    return (
        <div className='message-Box'>
            <h3 className='messageBox-header'>
                <span className='icon' onClick={() => setOpenMszList(false)}> &lt;- </span><img src={opponent.binaryData} className='img' /> <span className='user'> {opponent.fName} {opponent.lName} </span></h3>
            <div className='message-body' id='message-body'>
                <ScrollToBottom className='message-container' >
                    {
                        messages.map((msz, idx) => {
                            return <div key={idx} className={idx % 2 == 0 ? 'user-message' : 'opponent-message'}>
                                <div><span className='message-text' >{msz}</span></div>
                                <div>
                                    <span className='message-time'>12:00</span>
                                    <span className='message-author'>{idx%2 == 0 ? user.fName : opponent.fName }</span>
                                </div>
                            </div>
                        })
                    }
                </ScrollToBottom>
            </div>
            <div className='message-input'>
                <input
                    type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key == 'Enter' && sendMessage()}
                    placeholder='Hey.....'
                />
                <button disabled={!message} onClick={sendMessage}>{'->'}</button>
            </div>
        </div>
    )
}
export default MessageBox