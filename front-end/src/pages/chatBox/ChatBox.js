import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './ChatBox.css'
import MessageBox from './MessageBox'
import Modal from '../../components/modal/Modal'
import { UserContext } from '../../App'
import { GreenDot, RedDot } from '../../components/utils/Dots/Dots'
import { addActivity } from '../activityPage/ActivityPage'
import { getFullName } from '../../components/utils/GetFullName'
import { Spinner } from 'react-bootstrap'
import Loader from '../../components/utils/loader/Loader'

const ChatBox = () => {
    const { setNotificationRooms, currentUserVal, socket, setTotalMessages, setCurrentUserVal, currentRoom, setCurrentRoom } = useContext(UserContext)
    const { state } = useLocation()
    const [users, setUsers] = useState([])
    const [opponent, setOpponent] = useState({})
    const [imgSrc, setImgSrc] = useState('')
    const [imgmodal, setImgmodal] = useState(false)
    const [employessList, setEmployeesList] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const [loading, setLoading] = useState(false)
    socket.off('new-user').on('new-user', (payload) => {
        setLoading(false)
        setUsers(payload)
    })

    const getRoomId = (id1, id2) => {
        if (id1 > id2) {
            return id1 + "-" + id2
        } else {
            return id2 + "-" + id1
        }
    }

    const selectedUser = (user, currentUserVal) => {
        const roomId = getRoomId(user._id, currentUserVal._id)
        setCurrentRoom(roomId)
        socket.emit('join-room', roomId, currentRoom)
        socket.emit('new-user')
        currentUserVal.newMessages && delete currentUserVal.newMessages[roomId]
        setCurrentUserVal(currentUserVal)
        setSearchVal('')
        setOpponent(user)
        let totalMessage = Object.values(currentUserVal?.newMessages).length && Object.values(currentUserVal?.newMessages)?.reduce((a, b) => a + b)
        setTotalMessages(totalMessage)
        const roomsCount = Object.keys(currentUserVal?.newMessages).length
        setTotalMessages(totalMessage)
        setNotificationRooms(roomsCount)
    }
    const imgPopup = (src, fName) => {
        setImgSrc({ src, fName })
        setImgmodal(true)
    }
    const handleSearchUsers = (e) => {
        setSearchVal(e.target.value)
        const filteredUsers = users.filter(user => getFullName(user).toLowerCase().includes(e.target.value.toLowerCase()))
        setEmployeesList(filteredUsers)
    }
    useEffect(() => {
        setLoading(true)
        socket.emit('new-user')
        addActivity(currentUserVal, 'Chat page', `Visited Chat Page`)
        if (state?._id && currentUserVal?._id) {
            selectedUser(state, currentUserVal)
        }
        return () => {
            socket.emit('join-room', 'sample', currentRoom)
            setCurrentRoom('sample')
        }
    }, [])
    useEffect(() => {
        setEmployeesList(users)
    }, [users])
    return (<div className='chatBox-main'>
        <div className='chatBox-userList'>
            <div>
                <input placeholder='Search here...' value={searchVal} className='form-control' type='search' onChange={handleSearchUsers} />
            </div>
            <>{
                loading ? <Loader /> : <>
                    {
                        employessList.map((user, idx) => {
                            if (user._id === currentUserVal._id) {
                                return
                            }
                            return <div key={idx} className='chatBox-div'  >
                                <div onClick={() => imgPopup(user.binaryData, user.fName)} className='chatBox-image'>
                                    <img className='img' src={user.binaryData} />
                                    <span className='online-indicator'>{user.status == 'Online' ? <GreenDot /> : <RedDot />}</span>
                                </div>
                                <div onClick={() => selectedUser(user, currentUserVal)} className='author-details'>
                                    <h3 className='chatBox-header'>{getFullName(user)}</h3>
                                    <h5 className='chatBox-technology'>{user.designation ? user.designation : 'React JS'}</h5>
                                </div>
                                <div> {
                                    currentUserVal.newMessages[getRoomId(user._id, currentUserVal._id)] &&
                                    <span className='notification-icon'>{currentUserVal.newMessages[getRoomId(user._id, currentUserVal._id)]}</span>
                                }
                                </div>
                            </div>
                        })
                    }
                </>
            }
            </>
        </div>
        {
            opponent?._id && <MessageBox
            socket={socket}
            user={currentUserVal}
            setOpponent={setOpponent}
            roomId={currentRoom}
            opponent={opponent}
            imgPopup={imgPopup} />
        }
        
        <Modal isOpen={imgmodal} setModal={setImgmodal} >
            <div>
                <h3>{imgSrc.fName}</h3>
                <div className='modalImage' >
                    <img src={imgSrc.src} />
                </div>
            </div>
        </Modal>
    </div>
    )
}
export default ChatBox