import React, { memo, useEffect, useRef, useState } from 'react'
import { dateIndicator } from './MessageBox'

const formatMsz = (msz) => {
    switch (msz.type) {
        case 'application/pdf': {
            return <span>{msz.content} <a target='_blank' href={msz.fileLink} download={msz.content} ><i className='fas fa-download' ></i></a></span>
        }
        case 'image/jpeg': {
            return <div>
                <div><img style={{ width: "70px", height: '70px' }} src={msz.fileLink} /></div>
                <span>{msz.content} <a href={msz.fileLink} download={msz.content + '.jpeg'} ><i className='fas fa-download' ></i></a></span>
            </div>
        }
        case 'CONTACT': {
            const contact = JSON.parse(msz.content)
            return <div>
                <span>Name : {contact.name} </span>
                <span>Phone: {contact.contact}</span>
            </div>
        }
        default: return <span>{msz.content} <a href={msz.fileLink} download={msz.content + '.jpeg'} ><i className='fas fa-download' ></i></a></span>
    }
}
export const RenderMessages = memo(({ messages, opponent, user, deleteMessage }) => {
    const [lastMszId, setLastMszId] = useState('')
    const messageEndRef = useRef(null)
    const sampleRef= useRef(null)
    const getLastMsz = () => {
        const lastObjId = messages.findLast(m => m)?.messageByDate.findLast(m => m)._id
        console.log(messages, "LASTMSZ", lastObjId)
        setLastMszId(lastObjId)
    }
    const scrollToBottom = () => {
        console.log('REF', messageEndRef)
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }
    const handleScroll = ()=> {
        const idEl = document.getElementById('msz-box')
        console.log('HANDLE-SCROLL', idEl)
        const isTouchedTop = idEl.scrollTop < 10
        if (isTouchedTop) {
            // setMessages([...messages, ...messages])
        }
    }
    useEffect(()=> {
        const idEl = document.getElementById('msz-box')
        idEl.addEventListener('scroll', handleScroll)
        return ()=> {
            idEl.removeEventListener('scroll', handleScroll)
        }
    }, [messages])
    useEffect(() => {
        scrollToBottom()
    }, [messageEndRef.current])
    useEffect(() => {
        getLastMsz()
    }, [messages])
    
    return <div id='msz-box' className='message-container message-body' >
        {
            messages.map((dayMsz, idx) => (
                <div key={dayMsz._id + Math.random()} className='m-auto text-center'> <span className='p-1 fw-bolder' style={{ borderRadius: '8px', border: '1px solid #ccc', color: '#85807b' }}>{dateIndicator(dayMsz._id)}</span>
                    {
                        dayMsz.messageByDate.map((msz, index) => {
                            return <div
                                id={idx == index == 1 ? 'initialMsz' : ''}
                                key={msz._id + Math.random()}
                                ref={lastMszId == msz._id ? messageEndRef: sampleRef}
                                className={msz.from.id == user._id ? 'user-message' : 'opponent-message'}>
                                <div>
                                    {
                                        msz.type == 'message' ?
                                            <span onClick={() => deleteMessage(msz._id, msz.from.id == user._id)} className='message-text' >{msz.content} </span> :
                                            formatMsz(msz)
                                    }
                                </div>
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
    </div>
})