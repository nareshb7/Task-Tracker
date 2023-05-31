import React, { useEffect, useRef, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { fetchDeletecall } from '../components/utils/fetch/UseFetch'

export const lastSeenTimeFormat = (time)=> {
    const val = new Date(time).toLocaleString()
    return val
}
const getFormattedDate = (date) => {
    // const date = new Date()
    const year = date.getFullYear()
    let month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : "0" + month
    let day = date.getDate().toString()
    day = day.length > 1 ? day : "0" + day
    return `${month}/${day}/${year}`
}
export const dateIndicator =(date) => {

    const dt = new Date()
    const today = getFormattedDate(dt)
    const y = new Date(dt.setDate(dt.getDate()-1))
    const yesterday = getFormattedDate(y)
    const d = getFormattedDate(new Date(date))
    if (today == d) return 'Today'
    if (yesterday == d) return 'Yesterday'
    return d
}

const MessageBox = ({ user, opponent, setOpponent, socket, roomId, imgPopup }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const messageEndRef = useRef(null)

    
    const todayDate = getFormattedDate(new Date())

    socket.off('room-messages').on('room-messages', (roomMessages)=> {
        setMessages(roomMessages)
    })
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }

    const sendMessage = () => {
        if (!message) return;
        const today = new Date()
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()
        const time = today.getHours() + ':' + minutes;
        const val = { fName: user.fName, lName: user.lName, id: user._id }
        socket.emit('message-room', roomId, message, val, time, todayDate, opponent._id)
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
                <div className='messageBox-header'>
                    <span className='icon' onClick={() => setOpponent('')}> <i className='fas fa-arrow-left'></i> </span>
                    <img src={opponent.binaryData} className='img' onClick={() => imgPopup(opponent.binaryData)} />
                    <span className='opponent-header'>
                        <span className='opponent-name' > {opponent.fName} {opponent.lName}</span>
                        <span className='last-seen'>{opponent.status === 'Online' ? 'Online' : lastSeenTimeFormat(opponent.lastActiveOn)}</span>
                    </span>
                </div>
                <div className='message-body' id='message-body'>
                    <ScrollToBottom className='message-container' >
                        {
                            messages.map((dayMsz) => (
                                <div key={dayMsz._id} className='m-auto text-center'> <span className='p-1 text-center fw-bolder' style={{borderRadius:'8px', border:'1px solid #ccc', color:'#85807b' }}>{dateIndicator(dayMsz._id)}</span>
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
                    <button disabled={!opponent.fName} onClick={sendMessage}><i className='fas fa-arrow-right'></i></button>
                </div>
            </div> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><h3>ResourceOne IT</h3></div>
        }
    </>

    )
}
export default MessageBox