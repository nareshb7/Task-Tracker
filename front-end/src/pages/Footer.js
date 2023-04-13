import React from 'react'

const Footer = () => {
  return (
    <div style={{background:'#666', display:'flex', justifyContent:'space-evenly'}}>
      <div>
        <div style={{width:'100px', height:'100px', textAlign:'center', margin:'10px'}}>
            <img style={{borderRadius:'50%', wodth:'100%', height:'100%'}} src='https://media.licdn.com/dms/image/C560BAQFYCcCZ6hWFGA/company-logo_200_200/0/1519910499757?e=1687996800&v=beta&t=FHGu7-sMUPe_ZZJswZq7QGA19UZf2AWJVoJ8t5WiNdA' alt='cmpnyLogo' />
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
            <li>Contact us</li>
            <li>Privacy Policy</li>
        </ul>
      </div>
    </div>
  )
}

export default Footer
