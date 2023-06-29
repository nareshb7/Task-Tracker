import React from 'react'
import './style/Footer.css'
import { Link } from 'react-router-dom'
import { COMPANY_NAME } from '../components/utils/Constants'

const Footer = () => {
  return (<div>
    <div className='footer-main'>
      <div>
        <div className='footer-logo'>
            <img src='https://media.licdn.com/dms/image/C560BAQFYCcCZ6hWFGA/company-logo_200_200/0/1519910499757?e=1695859200&v=beta&t=8rcR_Thc-O5dA4U6lOoNMhF5SiYTv6pL_PspEtY-0cE' alt='cmpnyLogo' />
        </div>
        <h3>ResourceOne IT Solutions.</h3>
      </div>
      <div>
        <h3>External Links</h3>
        <ul>
            <li>LinkedIn</li>
            <li>Twitter</li>
            <li>Instagram</li>
        </ul>
      </div>
      <div>
        <h3>Links</h3>
        <ul>
            <li>Home </li>
            <li>Profile Page</li>
            <li>Add Issue</li>
            <li>Issue's List</li>
        </ul>
      </div>
      <div>
        <h3>Contacts</h3>
        <ul>
            <li ><Link to='/contact'> Contact us</Link></li>
            <li>Privacy Policy</li>
        </ul>
      </div>
    </div>
    <div className='text-center' style={{background: "#2d4174", color:'#728edd'}}>Copyrights © 2023 All Rights Reserved by {COMPANY_NAME}</div>
    </div>
  )
}

export default Footer
