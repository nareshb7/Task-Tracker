import React, { memo, useEffect, useRef, useState } from 'react'
// import { Document, Page } from 'react-pdf';
import { dateIndicator } from './MessageBox'
import { fetchGetCall } from '../../components/utils/fetch/UseFetch'
import Modal from '../../components/modal/Modal'
import { getFullName } from '../../components/utils/GetFullName';

const ImgLoader = ({ getFileFromDB, msz }) => {
    const [fileURL, setFileURL] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const imageData = await getFileFromDB(msz);
                setFileURL(imageData)
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, [getFileFromDB, msz]);

    if (!fileURL) {
        return <div>Loading...</div>;
    }
    switch (msz.type) {
        case 'application/pdf': {

            return <span style={{ position: 'relative' }}><embed src={fileURL} type="application/pdf" width="250px" height="100px" /> <a target='_blank' href={fileURL} download={msz.content} >
                <i className='fas fa-download' style={{ position: 'absolute', bottom: '10px', right: '30px' }} ></i></a>
            </span>
        }
        case 'image/jpeg': {
            return <div className='imageWrapper'><img style={{ width: "100px", height: '100px' }} src={fileURL} alt="Image" ></img> <a href={fileURL} download={msz.content} ><i className='fas fa-download' ></i></a></div>
        }
        case 'CONTACT': {
            const contact = JSON.parse(msz.content)
            return <div>
                <span>Name : {contact.name} </span>
                <span>Phone: {contact.contact}</span>
            </div>
        }
        default: return <span>{msz.content} <a href={fileURL} download={msz.content} ><i className='fas fa-download' ></i></a></span>
    }
};

export default ImgLoader;


const getFileFromDB = async (msz) => {
    try {
        if (msz.fileID) {
            const resp = await fetchGetCall(`/api/getFile/?id=${msz.fileID}`, {
                responseType: 'arraybuffer', // Tell Axios to treat the response as binary data
            })
            if (resp.success) {
                const base64 = new Uint8Array(resp.data.data)
                const url = URL.createObjectURL(new Blob([base64], { type: msz.type }))
                return url
            }
        }
        return 'http://localhost:3030/'
    } catch {
        return 'http://localhost:3030/'
    }


}

export const RenderMessages = memo(({ lastMszId, messages, opponent, user, deleteMessage, socket, room , employessList, sendMessage}) => {
    const messageEndRef = useRef(null)
    const sampleRef = useRef(null)
    const [openForwardModal, setOpenForwardModal] = useState(false)
    const [forwardModelContent, setForwardModelContent] = useState({})
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth', block: 'center', inline: 'center' })
    }
    const handleScroll = () => {
        const idEl = document.getElementById('msz-box')
        const isTouchedTop = idEl.scrollTop == 0
        if (isTouchedTop) {
            socket.emit('get-last-mszs', room)
        }
    }
    const handleCopyMsz = async (message, window) => {
        try {
            // Create a temporary textarea element
            const textarea = document.createElement('textarea');
            textarea.value = message;
            document.body.appendChild(textarea);

            // Select and copy the text
            textarea.select();
            document.execCommand('copy');

            // Remove the temporary element
            document.body.removeChild(textarea);

            console.log('Text copied to clipboard.');
        } catch (error) {
            console.error('Error copying text:', error);
        }
    }
    const handleForward =(msz)=> {
        console.log('MSZ', msz)
        setOpenForwardModal(true)
        setForwardModelContent(msz)
    }
    const handleForwardMessage =(emp)=> {
        console.log('FORWRD::', {emp, forwardModelContent})
        sendMessage(forwardModelContent.content,forwardModelContent.type, forwardModelContent.fileID, emp )
    }
    useEffect(() => {
        const idEl = document.getElementById('msz-box')
        idEl.addEventListener('scroll', handleScroll)
        return () => {
            idEl.removeEventListener('scroll', handleScroll)
        }
    }, [messages])
    useEffect(() => {
        scrollToBottom()
    }, [lastMszId])
    return <div id='msz-box' className='message-container message-body' >
        {
            messages.map((dayMsz, idx) => (
                <div key={dayMsz._id + Math.random()} className='m-auto text-center'> <span className='p-1 fw-bolder' style={{ borderRadius: '8px', border: '1px solid #ccc', color: '#85807b' }}>{dateIndicator(dayMsz._id)}</span>
                    {console.count('MESSAGES RENDERING')}
                    {
                        dayMsz.messageByDate.map((msz, index) => {
                            return <div
                                id={idx == index == 1 ? 'initialMsz' : ''}
                                key={msz._id + Math.random()}
                                ref={lastMszId === msz._id ? messageEndRef : sampleRef}
                                className={msz.from.id == user._id ? 'user-message' : 'opponent-message'}>
                                <div onDoubleClick={()=> console.log('CLICKED DOUBLR')} style={{position:"relative"}}>
                                    {/* () => deleteMessage(msz._id, msz.from.id == user._id) */}
                                    {
                                        msz.type == 'message' ?
                                            <span className='message-text' >{msz.content} </span> :
                                            <ImgLoader getFileFromDB={getFileFromDB} msz={msz} />
                                    }
                                    <span>
                                    <i class="fa-solid fa-share" onClick={()=> handleForward(msz)}></i>
                                    <i className="fa-solid fa-copy" style={{ cursor: 'pointer' }} onClick={() => handleCopyMsz(msz.content, window)}></i>
                                    </span>
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
        <Modal isOpen={openForwardModal} setModal={setOpenForwardModal}  >
            <ul className='forward-modal'>
            {
                employessList.map(emp => {
                    return <li className='forward-modal-li' onClick={()=> handleForwardMessage(emp)} title={getFullName(emp)}>{getFullName(emp)}</li>
                })
            }
            </ul>
        </Modal>
    </div>
})


/*
 */