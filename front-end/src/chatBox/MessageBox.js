import React, { useEffect, useRef, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { fetchDeletecall } from '../components/utils/fetch/UseFetch'

const MessageBox = ({ user, opponent, setOpponent, socket, roomId, imgPopup }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const messageEndRef = useRef(null)

    const getFormattedDate = () => {
        const date = new Date()
        const year = date.getFullYear()
        let month = (1 + date.getMonth()).toString()
        month = month.length > 1 ? month : "0" + month
        let day = date.getDate().toString()
        day = day.length > 1 ? day : "0" + day
        return `${month}/${day}/${year}`
    }
    const todayDate = getFormattedDate()
    useEffect(() => {
        socket.on('room-messages', (data) => {
            setMessages([])
            if (data && data.length) {
                setMessages(data)
            }
        })
    }, [socket])
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }

    const sendMessage = () => {
        if (!message) return;
        const today = new Date()
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()
        const time = today.getHours() + ':' + minutes;
        const val = { fName: user.fName, lName: user.lName, id: user._id }
        socket.emit('message-room', roomId, message, val, time, todayDate)
        setMessage('')
        return
    }
    const deleteMessage =async (id, author)=> {
        if(author) {
            const res = window.confirm('Do u want to delete this message??')
            if (res) {
                const res = await fetchDeletecall('api/deletemessage', {id, roomId})
                setMessages(res)
            }
        } else {
            alert("U can't delete others message")
        }
        
    }
    return (<>
        {
            opponent._id ? <div className='message-Box'>
                <h3 className='messageBox-header'>
                    <span className='icon' onClick={() => setOpponent('')}> &lt;- </span><img src={opponent.binaryData} className='img' onClick={() => imgPopup(opponent.binaryData)} /> <span > {opponent.fName} {opponent.lName} </span> </h3>
                <div className='message-body' id='message-body'>
                    <ScrollToBottom className='message-container' >
                        {
                            messages.map((dayMsz) => (
                                <div key={dayMsz._id}> <h3 style={{textAlign:'center'}}>{dayMsz._id}</h3>
                                    {
                                        dayMsz.messageByDate.map((msz) => {
                                            return <div key={msz._id} className={msz.from.id == user._id ? 'user-message' : 'opponent-message'}>
                                                <div><span onClick={()=> deleteMessage(msz._id,msz.from.id == user._id )} className='message-text' >{msz.content}</span></div>
                                                <div>
                                                    <span className='message-time'>{msz.time}</span>
                                                    <span className='message-author'>{msz.from.id == user._id ? 'You' : opponent.fName}</span>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            ))
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
                    <button disabled={!opponent.fName} onClick={sendMessage}>{'->'}</button>
                </div>
            </div> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><h3>ResourceOne IT</h3></div>
        }
    </>

    )
}
export default MessageBox