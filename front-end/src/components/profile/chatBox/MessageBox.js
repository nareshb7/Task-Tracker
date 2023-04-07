import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { fetchCall } from '../../utils/fetch/UseFetch'

const MessageBox = ({ user, opponent, setOpenMszList }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState(['hii', 'hello', 'hii 1', 'hello 1', ' hii 2', 'hello 2', 'hii', 'hello', 'hii 1', 'hello 1', ' hii 2', 'hello 2', 'hiii', 'hello','hello', 'hii 1', 'hello 1', ' hii 2', 'hello 2', 'hiii', 'hello'])
    useEffect(() => {
        console.log(user, opponent, 'userrrrr')
        const getMessages = async () => {
            let messages = await fetchCall('api/usermessages', { from: user._id, to: opponent._id, messages: ['hiiii'] })
            console.log(messages, 'mszs')

        }
        // getMessages()
    }, [])

    const sendMessage = () => {
        setMessage('')
        setMessages([...messages, message])
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