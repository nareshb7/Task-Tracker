import React, { useContext, useEffect, useState } from 'react'
import { fetchGetCall } from '../../utils/fetch/UseFetch'
import './ChatBox.css'
import MessageBox from './MessageBox'
import Modal from '../../modal/Modal'
import { UserContext } from '../../../App'
import { GreenDot, RedDot } from '../../utils/Dots/Dots'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AddNotification } from '../../../redux/actions/Actions'

const ChatBox = () => {
    const { currentUserVal, socket } = useContext(UserContext)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    console.log('state user', user)
    const [users, setUsers] = useState([])
    const [openMszList, setOpenMszList] = useState(false)
    const [opponent, setOpponent] = useState({})
    const [imgSrc, setImgSrc] = useState('')
    const [imgmodal, setImgmodal] = useState(false)
    const [currentRoom, setCurrentRoom] = useState('')

    socket.off('new-user').on('new-user', (payload) => {
        setUsers(payload)
      })

    socket.off('notifications').on('notifications', (room)=> {
        console.log('notification to ', room)
        dispatch(AddNotification(room, currentUserVal))
    })
    const getRoomId = (id1, id2) => {
        if (id1 > id2) {
            return id1 + "-" + id2
        } else {
            return id2 + "-" + id1
        }
    }
    useEffect(()=> {
        socket.emit('new-user')
    },[])
    const selectedUser = (user, currentUserVal) => {
        const roomId = getRoomId(user._id, currentUserVal._id)
        setCurrentRoom(roomId, currentRoom)
        socket.emit('join-room', roomId)
        socket.emit('new-user')
        setOpponent(user)
        setOpenMszList(true)
    }
    const imgPopup = (src) => {
        setImgSrc(src)
        setImgmodal(true)
    }

    return (
        <>
        {
            currentUserVal._id ? <div className='chatBox-main'>
            <div className='chatBox-userList'> 
            <div>{users.length< 0 && 'Loading....'}</div>
            {
                users.map((user, idx) => {
                    if (user._id === currentUserVal._id) {
                        return
                    }
                    return <div key={idx} className='chatBox-div'  >
                        <div onClick={() => imgPopup(user.binaryData)} className='chatBox-image'>
                            <img className='img' src={user.binaryData} />
                            <span className='online-indicator'>{user.status == 'Online' ? <GreenDot/> : <RedDot/>}</span>
                        </div>
                        <div onClick={() => selectedUser(user, currentUserVal)}>
                            <h3 className='chatBox-header'>{user.fName} {user.lName}</h3>
                            <h4 className='chatBox-technology'>React JS </h4>
                        </div>
                        <div>
                            <span>''</span>
                        </div>
                    </div>
                })
            }
            </div>
            <MessageBox socket={socket} user={currentUserVal} setOpponent={setOpponent} roomId={currentRoom} opponent={opponent} setOpenMszList={setOpenMszList} imgPopup={imgPopup} /> :
            <Modal isOpen={imgmodal} setModal={setImgmodal} >
                <div className='modalImage' >
                    <img src={imgSrc} />
                </div>
            </Modal>
        </div> : <div style={{textAlign:'center'}}>Login to <NavLink to='/login'>click here </NavLink></div>
        }
        </>
        
    )
}
export default ChatBox