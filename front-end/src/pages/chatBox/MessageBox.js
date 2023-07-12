import React, { useEffect, useRef, useState } from 'react'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import ScrollToBottom from 'react-scroll-to-bottom'
import { fetchDeletecall, fetchGetCall } from '../../components/utils/fetch/UseFetch'
import { COMPANY_NAME } from '../../components/utils/Constants'

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
    const messageEndRef = useRef(null)
    const [showClientsList, setShowClientsList] = useState(false)
    const [clientsData, setClientsData] = useState([])
    const [searchClientsData, setSearchClientsData] = useState([])
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)

    const todayDate = getFormattedDate(new Date())

    socket.off('room-messages').on('room-messages', (roomMessages) => {
        setMessages(roomMessages)
    })
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }

    const sendMessage = (message, type = 'message', fileLink='') => {
        if (!message) return;
        const today = new Date()
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()
        const time = today.getHours() + ':' + minutes;
        const val = { fName: user.fName, lName: user.lName, id: user._id }
        socket.emit('message-room', roomId, message, val, time, todayDate, opponent._id, type, fileLink)
        setMessage('')
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
    const openClientsList = () => {

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
    const uploadImage =async (file) => {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', 'jeibislh')
        try {
            let res = await fetch("https://api.cloudinary.com/v1_1/dachjilv2/image/upload", {
                method:'post',
                body: data
            })
            let urlData = await res.json()
            return urlData.url
        } catch(err){
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
    useEffect(() => {
        getClientsList()
    }, [])
    useEffect(()=> {
        setIsOptionsOpen(false)
        setShowClientsList(false)
    },[roomId])

    return (<>
        {
            opponent._id ? <div style={{ display: 'flex', width: '70%' }}>
                <div className='message-Box'>
                    <div className='messageBox-header'>
                        <span className='icon' onClick={() => setOpponent('')}> <i className='fas fa-arrow-left'></i> </span>
                        <img src={opponent.binaryData} className='img' onClick={() => imgPopup(opponent.binaryData)} />
                        <span className='opponent-header'>
                            <span className='opponent-name' > {opponent.fName} {opponent.lName}</span>
                            <span className='last-seen'>{opponent.status === 'Online' ? 'Online' : lastSeenTimeFormat(opponent.lastActiveOn)}</span>
                        </span>
                        <span style={{ alignSelf: 'end' }}>
                            <i className='fas fa-ellipsis-v'> </i>
                        </span>
                    </div>
                    <ScrollToBottom className='message-container message-body' >
                        {
                            messages.map((dayMsz) => (
                                <div key={dayMsz._id} className='m-auto text-center'> <span className='p-1 fw-bolder' style={{ borderRadius: '8px', border: '1px solid #ccc', color: '#85807b' }}>{dateIndicator(dayMsz._id)}</span>
                                    {
                                        dayMsz.messageByDate.map((msz) => {
                                            return <div key={msz._id} className={msz.from.id == user._id ? 'user-message' : 'opponent-message'}>
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
                    </ScrollToBottom>
                    {
                        isOptionsOpen && <div className='w-25'>
                            <ListGroup>
                                <ListGroupItem style={{ cursor: 'pointer' }} onClick={() => setShowClientsList(!showClientsList)}>Client Contacts</ListGroupItem>
                                <ListGroupItem onClick={openClientsList}>
                                    <input style={{ width: '5px', visibility: 'hidden' }} onChange={handleFileUpload} type='file' id='fileUploadOpt' />
                                    <label style={{ cursor: 'pointer' }} htmlFor='fileUploadOpt'> Files </label>
                                </ListGroupItem>
                                <ListGroupItem>Test 1</ListGroupItem>
                            </ListGroup>
                        </div>
                    }
                    <div className='message-input'>
                        <div className='plusIcon' onClick={() => {setIsOptionsOpen(!isOptionsOpen); setShowClientsList(false)}}><i className='fas fa-plus'></i></div>
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