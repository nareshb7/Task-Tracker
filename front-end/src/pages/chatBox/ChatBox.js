import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './ChatBox.css'
import MessageBox from './MessageBox'
import Modal from '../../components/modal/Modal'
import { UserContext } from '../../App'
import { GreenDot, RedDot } from '../../components/utils/Dots/Dots'
import { addActivity } from '../activityPage/ActivityPage'

const ChatBox = () => {
    const { setNotificationRooms, currentUserVal, socket, setTotalMessages, setCurrentUserVal,  currentRoom, setCurrentRoom } = useContext(UserContext)
    const stateData = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [users, setUsers] = useState([])
    const [openMszList, setOpenMszList] = useState(false)
    const [opponent, setOpponent] = useState({})
    const [imgSrc, setImgSrc] = useState('')
    const [imgmodal, setImgmodal] = useState(false)
    socket.off('new-user').on('new-user', (payload) => {
        setUsers(payload)
    })

    const getRoomId = (id1, id2) => {
        if (id1 > id2) {
            return id1 + "-" + id2
        } else {
            return id2 + "-" + id1
        }
    }
    useEffect(() => {
        socket.emit('new-user')
        addActivity(currentUserVal, 'Chat page', `Visited Chat Page`)
        return ()=> {
            socket.emit('join-room', 'sample', currentRoom)
            setCurrentRoom('sample')
        }
    }, [])
    const selectedUser = (user, currentUserVal) => {
        const roomId = getRoomId(user._id, currentUserVal._id)
        setCurrentRoom(roomId)
        socket.emit('join-room', roomId, currentRoom)
        socket.emit('new-user')
        currentUserVal.newMessages && delete currentUserVal.newMessages[roomId]
        setCurrentUserVal(currentUserVal)
        setOpponent(user)
        setOpenMszList(true)
        let totalMessage = Object.values(currentUserVal?.newMessages).length && Object.values(currentUserVal?.newMessages)?.reduce((a, b) => a + b)
        setTotalMessages(totalMessage)
        const roomsCount = Object.keys(currentUserVal?.newMessages).length
      setNotificationRooms(roomsCount)
    }
    const imgPopup = (src, fName) => {
        setImgSrc({ src, fName })
        setImgmodal(true)
    }

    return (
        <>
            {
                currentUserVal._id ? <div className='chatBox-main'>
                    <div className='chatBox-userList'>
                        <div>{users.length < 0 && 'Loading....'}</div>
                        {
                            users.map((user, idx) => {
                                if (user._id === currentUserVal._id) {
                                    return
                                }
                                return <div key={idx} className='chatBox-div'  >
                                    <div onClick={() => imgPopup(user.binaryData, user.fName)} className='chatBox-image'>
                                        <img className='img' src={user.binaryData} />
                                        <span className='online-indicator'>{user.status == 'Online' ? <GreenDot /> : <RedDot />}</span>
                                    </div>
                                    <div onClick={() => selectedUser(user, currentUserVal)} className='author-details'>
                                        <h3 className='chatBox-header'>{user.fName} {user.lName}</h3>
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
                    </div>
                    <MessageBox socket={socket} user={currentUserVal} setOpponent={setOpponent} roomId={currentRoom} opponent={opponent} setOpenMszList={setOpenMszList} imgPopup={imgPopup} /> :
                    <Modal isOpen={imgmodal} setModal={setImgmodal} >
                        <div>
                            <h3>{imgSrc.fName}</h3>
                            <div className='modalImage' >
                                <img src={imgSrc.src} />
                            </div>
                        </div>
                    </Modal>
                </div> : <div style={{ textAlign: 'center' }}>Login to <NavLink to='/login'>click here </NavLink></div>
            }
        </>

    )
}
export default ChatBox