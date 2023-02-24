import React, {useState, useEffect} from 'react'
import './Form.css'
const Form = ({submitFunc, formData, error, isSubmitted, component}) => {
    const obj = {
        fName: '',
        lName: '',
        email: '',
        mobile: '',
        password: '',
        conPassword: '',
        profileImage: '',
        binaryData:'',
        isAdmin:false,
        isActive: true,
        reqforAdmin: false,
        uploadedIssues:[],
        technologies:[],
        gender: 'Male'
    }
    const [data, setData] = useState(formData || obj)
    const errorObj = {
        fName: '',
        lName: '',
        email: '',
        mobile: '',
        password: '',
        conPassword: '',
        profileImage: ''
    }
    const [errors, setErrors] = useState(errorObj)
    const [isValid, setIsValid] = useState(false)
    const [imageName, setImageName] = useState('')

    useEffect(() => {
        // const { fName, lName, mobile, password, email, conPassword, profileImage } = errors
        // if (!fName && !lName && !mobile && !email && !password && !conPassword && !profileImage) {
        //     setIsValid(true)
        // } else {
        //     setIsValid(false)
        // }
        const res = Object.values(errors).filter(val => val.length > 2)
        if (res.length){
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }, [errors])
    useEffect(()=> {
        setErrors({...errors, ...error})
    },[error])
    useEffect(()=> {
        isSubmitted && setData(obj)
    }, [isSubmitted])
    const convertToBase64 =async (name, file)=> {
        let result =await new Promise((resolve, reject)=> {
            const filereader = new FileReader()
            filereader.readAsDataURL(file)
            filereader.onload =()=> {
                resolve(filereader.result)
            }
            filereader.onerror =(err)=>{
                reject(err)
            } 
        })
        setImageName(file.name)
        setData({...data, "binaryData": result})
    }
    const handleChange = (e) => {
        
        const imgTypes = ['image/jpeg', 'image/png']
        const emailpattern = /^[a-z][a-z0-9]+@[a-z]+(?:[.][a-z]{2,})+$/
        const mobilePattern = /^[0-9]{10}$/
        const psdPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&*<>]).{8,}$/
        const { name, value, files } = e.target
        name === 'profileImage' ? convertToBase64(name,files[0]) : setData({ ...data, [name]: value })
        switch (name) {
            case 'fName': {
                value.length > 2 ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Min 2 Chars required' })
                break;
            }
            case 'lName': {
                value.length > 2 ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Min 2 Chars required' })
                break;
            }
            case 'email': {
                value.match(emailpattern) ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Enter valid mail' })
                break;
            }
            case 'mobile': {
                value.match(mobilePattern) ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: '10 digits required' })
                break;
            }
            case 'password': {
                value.match(psdPattern) ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Must has one capital letter, lowercase letter, digit, and chatracter' })
                break;
            }
            case 'conPassword': {
                value === data.password ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Password confrim password must be same' })
                break;
            }
            case 'profileImage': {
                !imgTypes.includes(files[0].type) ? setErrors({ ...errors, [name]: 'Allwoed only jpeg/png files' }) : files[0].size > 1000000 ? setErrors({ ...errors, [name]: 'Image size must be below 1MB' }) : setErrors({ ...errors, [name]: '' })
                break;
            }
            default: {
                return
            }

        }
    }
    const handleSubmit = async (e) => {
      e.preventDefault()
        submitFunc(data)
        
    }
   
    const removeImage = ()=> {
       setData({...data, "binaryData": ''})
       setImageName('')
    }
  return (
    <div>
       <form onSubmit={handleSubmit}>
                <div>
                    {/* <div><label>Enter your Name :</label></div> */}
                    <div><input type='text' name='fName' value={data.fName} onChange={handleChange} placeholder='Enter your firstName' required /></div>
                    <div className='errorMsz'>{errors.fName}</div>
                </div>
                <div>
                    {/* <div><label>Enter your last name :</label></div> */}
                    <div><input type='text' name='lName' value={data.lName} onChange={handleChange} required placeholder='Enter your lastName' /></div>
                    <div className='errorMsz'>{errors.lName}</div>
                </div>
                <div>
                    {/* <div><label>Enter your Email :</label></div> */}
                    <div><input type='text' name='email' disabled={component} value={data.email} onChange={handleChange} required placeholder='Enter your Email' /></div>
                    <div className='errorMsz'>{errors.email}</div>
                </div>
                <div>
                    {/* <div><label>Enter your Mobile Number :</label></div> */}
                    <div><input type='text' name='mobile' disabled={component} value={data.mobile} onChange={handleChange} required placeholder='Enter your mobile' /></div>
                    <div className='errorMsz'>{errors.mobile}</div>
                </div>
                <div>
                    <label>Gender:</label>
                    <div><select onChange={handleChange} name='gender' value={data.gender} required>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Not Specify'>Not Specify</option>
                        </select>
                    </div>
                    <div className='errorMsz'></div>
                </div>
                <div>
                    {/* <div><label>Create a Password :</label></div> */}
                    <div><input type='password' name='password' value={data.password} onChange={handleChange} required placeholder='Enter your password' /></div>
                    <div className='errorMsz'>{errors.password}</div>
                </div>
                <div>
                    {/* <div><label>Confirm Password :</label></div> */}
                    <div><input type='password' name='conPassword' value={data.conPassword} onChange={handleChange} required placeholder='Enter your Confrirm Password' /></div>
                    <div className='errorMsz'>{errors.conPassword}</div>
                </div>
                <div>
                <input data-multiple-caption="{count} files selected" defaultValue={''} onChange={handleChange} type="file" name="profileImage" id="file-1" className="inputfile"  multiple />
				<label htmlFor="file-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> <span>{imageName ? `${imageName.slice(0,8)}` : 'Choose a file' } &hellip;</span></label>
                <div className='errorMsz'>{errors.profileImage}</div>
                </div>
               
                <div><button type='submit' disabled={!isValid}> Submit </button> </div>
            </form>
            <div style={{display:'flex', flexWrap:'wrap', position:'relative'}}>
            {
                data.binaryData && <div><div style={{width:'100px', height:'100px'}}>
                <img  src={data.binaryData}  style={{width:'100%', height:'100%'}}/></div>
                <button style={{position: 'absolute', top:'0', right:'0', padding:'5px'}} onClick={removeImage}>X</button></div>
            }
            </div>
      
            
    </div>
  )
}

export default Form
