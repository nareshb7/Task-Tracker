import React, { useEffect, useRef, useState } from 'react'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import { fetchDeletecall, fetchGetCall } from '../../components/utils/fetch/UseFetch'
import { COMPANY_NAME } from '../../components/utils/Constants'
import { RenderMessages } from './MessageRender'

export const lastSeenTimeFormat = (time) => {
    const val = new Date(time).toLocaleString()
    return val
}
export const getFormattedDate = (date, format) => {
    // const date = new Date()
    const year = date.getFullYear()
    let month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : "0" + month
    let day = date.getDate().toString()
    day = day.length > 1 ? day : "0" + day
    switch (format) {
        case 'dd/mm/yyyy': {
            return `${day}/${month}/${year}`
        }
        case 'yyyy/mm/dd': {
            return `${year}/${month}/${day}`
        }
        default: {
            return `${month}/${day}/${year}`
        }
    }
}
export const dateIndicator = (date) => {

    const dt = new Date()
    const today = getFormattedDate(dt)
    const y = new Date(dt.setDate(dt.getDate() - 1))
    const yesterday = getFormattedDate(y)
    const d = getFormattedDate(new Date(date))
    if (today == d) return 'Today'
    if (yesterday == d) return 'Yesterday'
    return d
}

const MessageBox = ({ user, opponent, setOpponent, socket, roomId, imgPopup }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const scrollRef = useRef(null)
    // const initialMsz = useRef(null)
    const [showClientsList, setShowClientsList] = useState(false)
    const [clientsData, setClientsData] = useState([])
    const [searchClientsData, setSearchClientsData] = useState([])
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const [lastMszId, setLastMszId] = useState('')
    const todayDate = getFormattedDate(new Date())

    socket.off('room-messages').on('room-messages', (roomMessages, room, LAST_MSZ) => {
        console.log('MESSAGES', roomMessages, LAST_MSZ)
        getLastMsz(roomMessages)
        if (LAST_MSZ) {
            const dates = roomMessages.map(val => val._id)
            const formattedMsz = messages.map(val => {
                if (dates.includes(val._id)) {
                    const mszs = roomMessages.find(value => value._id == val._id)
                    const idx = roomMessages.findIndex(value => value._id == val._id)
                    val.messageByDate = [...mszs.messageByDate, ...val.messageByDate]
                    roomMessages.splice(idx, 1)
                }
                return val
            })
            if (roomMessages.length) {
                setMessages([...roomMessages, ...formattedMsz])
            } else {
                setMessages(formattedMsz)
            }
        } else setMessages(roomMessages)
    })

    const getLastMsz = (messages) => {
        const lastObjId = messages.findLast(m => m)?.messageByDate.findLast(m => m)._id
        console.log(messages, "LASTMSZ", lastObjId)
        setLastMszId(lastObjId)
    }

    const sendMessage = (message, type = 'message', fileLink = '') => {
        if (!message) return;
        const today = new Date()
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()
        const time = today.getHours() + ':' + minutes;
        const val = { fName: user.fName, lName: user.lName, id: user._id }
        socket.emit('message-room', roomId, message, val, time, todayDate, opponent._id, type, fileLink)
        setMessage('')
        socket.emit('new-user', val.id, opponent._id )
        return
    }
    const deleteMessage = async (id, author) => {
        if (author) {
            const res = window.confirm('Do u want to delete this message??')
            if (res) {
                const res = await fetchDeletecall('api/deletemessage', { id, roomId })
                setMessages(res)
            }
        } else {
            alert("U can't delete others message")
        }

    }
    const getClientsList = async () => {
        const { data, success } = await fetchGetCall('/api/getclientslist')
        if (success) {
            setClientsData(data)
            setSearchClientsData(data)
        }
    }
    const handleDrag = (e, val) => {
        e.dataTransfer.setData('DragItem', JSON.stringify(val))
    }
    const handleOnDrop = (e) => {
        const dragItem = e.dataTransfer.getData('DragItem')
        setMessage(dragItem)
        sendMessage(dragItem, 'CONTACT')
    }
    const handleDragOver = (e) => {
        e.preventDefault()
    }
    const handleSearch = (e) => {
        console.log(e.target.value, 'search val')
        if (e.target.value) {
            const regexPattern = new RegExp(e.target.value, 'gi')
            const data = clientsData.filter(val => val.consultantName.match(regexPattern))
            setSearchClientsData(data)
        } else setSearchClientsData(clientsData)
    }
    const uploadImage = async (file) => {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', 'jeibislh')
        try {
            let res = await fetch("https://api.cloudinary.com/v1_1/dachjilv2/image/upload", {
                method: 'post',
                body: data
            })
            let urlData = await res.json()
            return urlData.url
        } catch (err) {
        }
    }
    const handleFileUpload = async (e) => {
        console.log('FILE', e.target.files[0])
        const file = e.target.files[0]
        const types = ['image/jpeg', 'application/pdf', 'application/x-zip-compressed', 'image/png']
        if (types.includes(file.type)) {
            if (file.size < 300000) {
                const fileLink = await uploadImage(file)
                console.log('CONVERTED', fileLink)
                sendMessage(file.name, file.type, fileLink)
            }
            else alert('More than 300kb not allowed')
        }
        else alert('This format is not supported to send')
    }
    const handleSendContact = (contact) => {
        const cnfrm = window.confirm(`Do u want to share ${contact.consultantName} contact?`)
        if (cnfrm) {
            const msz = { name: contact.consultantName, contact: contact.phone }
            sendMessage(JSON.stringify(msz), 'CONTACT')
        }
    }

    useEffect(() => {
        getClientsList()
    }, [])
    useEffect(() => {
        setIsOptionsOpen(false)
        setShowClientsList(false)
        setMessages([])
    }, [roomId])

    return (<>
        {
            opponent._id ? <div ref={scrollRef} style={{ display: 'flex', width: '70%' }}>
                <div className='message-Box'>
                    <div className='messageBox-header'>
                        <span className='icon' onClick={() => setOpponent('')}> <i className='fas fa-arrow-left'></i> </span>
                        <img src={opponent.binaryData} className='img' onClick={() => imgPopup(opponent.binaryData)} />
                        <span className='opponent-header'>
                            <span className='opponent-name' > {opponent.fName} {opponent.lName}</span>
                            <span className='last-seen'>{opponent.status === 'Online' ? 'Online' : lastSeenTimeFormat(opponent.lastActiveOn)}</span>
                        </span>
                        <div style={{ alignSelf: 'end', position:'absolute', right:'25px', bottom: '15px' }}>
                            <i className='fas fa-ellipsis-v'> </i>
                        </div>
                    </div>
                    <RenderMessages
                        socket={socket}
                        room={roomId}
                        messages={messages}
                        opponent={opponent}
                        user={user}
                        deleteMessage={deleteMessage}
                        lastMszId={lastMszId}
                    />
                    {
                        isOptionsOpen && <div className='w-25 list-options'  >
                            <ListGroup>
                                <ListGroupItem style={{ cursor: 'pointer' }} onClick={() => setShowClientsList(!showClientsList)}>Client Contacts</ListGroupItem>
                                <ListGroupItem>
                                    <input style={{ width: '5px', visibility: 'hidden' }} onChange={handleFileUpload} type='file' id='fileUploadOpt' />
                                    <label style={{ cursor: 'pointer' }} htmlFor='fileUploadOpt'> Files </label>
                                </ListGroupItem>
                                <ListGroupItem>Test 1</ListGroupItem>
                            </ListGroup>
                        </div>
                    }
                    <div className='message-input'>
                        <div className='plusIcon' onClick={() => { setIsOptionsOpen(!isOptionsOpen); setShowClientsList(false) }}><i className='fas fa-plus'></i></div>
                        <input
                            type='text'
                            onDrop={handleOnDrop}
                            onDragOver={handleDragOver}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key == 'Enter' && sendMessage(message)}
                            placeholder='Hey.....'
                        />
                        <button disabled={!opponent.fName} onClick={() => sendMessage(message)}><i className='fas fa-arrow-right'></i></button>
                    </div>

                </div>
                {
                    showClientsList && <div>
                        <div>
                            <input type={'search'} placeholder='search client name...' className='form-control my-1' onChange={handleSearch} />
                        </div>
                        {
                            searchClientsData.map((val, idx) => {
                                return <Card key={idx} draggable className='my-1' onClick={() => handleSendContact(val)} onDragStart={(e) => handleDrag(e, { name: val.consultantName, contact: val.phone })}>
                                    <h4>{val.consultantName}</h4>
                                    <h6>{val.phone}</h6>
                                </Card>
                            })
                        }
                    </div>
                }

            </div> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><h3>{COMPANY_NAME}</h3></div>
        }
    </>

    )
}
export default MessageBox