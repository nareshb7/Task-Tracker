import React, { useEffect, useState } from 'react'
import { fetchGetCall } from '../../utils/fetch/UseFetch'
import './ChatBox.css'
import MessageBox from './MessageBox'
import Modal from '../../modal/Modal'

const ChatBox = ({ currentUser }) => {
    const [users, setUsers] = useState([])
    const [openMszList, setOpenMszList] = useState(false)
    const [opponent, setOpponent] = useState({})
    const [imgSrc, setImgSrc] = useState('')
    const [imgmodal, setImgmodal] = useState(false)

    useEffect(() => {
        const getData = async () => {
            const res = await fetchGetCall('api/getallusers')
            if (res.length) {
                console.log('Users,', res)
                setUsers(res)
            }
        }
        getData()
    }, [])
    const selectedUser = (user, currentUser) => {
        // console.log(user, 'currentUser', currentUser)
        setOpponent(user)
        setOpenMszList(true)
    }
    const imgPopup =(src)=> {
        setImgSrc(src)
        setImgmodal(true)
    }


    return (
        <div className='chatBox-main'>
            {
                openMszList ? <MessageBox user={currentUser} opponent={opponent} setOpenMszList={setOpenMszList} /> :
                    <div className='chatBox-userList'> {
                        users.map((user, idx) => {
                            if (user._id === currentUser._id) {
                                return
                            }
                            return <div key={idx} className='chatBox-div'  >
                                <div onClick={()=> imgPopup(user.binaryData)}>
                                    <img className='img' src={user.binaryData} />
                                </div>
                                <div onClick={() => selectedUser(user, currentUser)}>
                                <h3 className='chatBox-header'>{user.fName} {user.lName}</h3>
                                <h4 className='chatBox-technology'>React JS </h4>
                                </div>
                            </div>
                        })
                    }
                    </div>
            }
            <div>
                <Modal isOpen={imgmodal} setModal={setImgmodal} >
                    <div className='modalImage' >
                        <img src={imgSrc}  />
                    </div>
            </Modal>
                
                
            </div>

        </div>
    )
}
export default ChatBox