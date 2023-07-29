import React from 'react'
import './MszNotification.css'

const MszNotification = ({setShowAlert, content}) => {
    const type = content.includes('message') ? 'Message': 'Ticket'
  return (
    <div className='notification' >
        <h2>Notification:</h2>
        <div className='d-flex'>
        <div className='notification-logo'>
            <img src='https://media.licdn.com/dms/image/C560BAQFYCcCZ6hWFGA/company-logo_200_200/0/1519910499757?e=1695859200&v=beta&t=8rcR_Thc-O5dA4U6lOoNMhF5SiYTv6pL_PspEtY-0cE' alt='cmpnyLogo' />
        </div>
            <div className='d-flex flex-column justify-content-center'>
                <h3>{type}</h3>
                <h5>{content}</h5>
            </div>
        </div>
        <span><button onClick={()=> setShowAlert({content:'', status:false})} className='btn-close close-btn'></button></span>
    </div>
  )
}

export default MszNotification