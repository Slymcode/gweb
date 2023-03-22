import  { useRef, useState,useContext, useEffect } from 'react';
import {updateUserProfile, verifyEmail} from '../../networking/user'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { getSessionCookie, setSessionCookie } from '../../utils/session';
import { Loader } from '../SubComponents/Loader';


export const FModal = () => {

  const navigate = useNavigate()
  const form = useRef();
  const { user, setIsAuthenticated } = useContext(AppContext);
  const [verify, setVerify] = useState('showForm');
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    email: ''
  })
  const handleChange = (e) => {
      const value = e.target.value
    setValues({ ...values, [e.target.name]: value })
  }
  
  useEffect(() => {
    const { tokenNonDecoded } = getSessionCookie();
    const searchParams = new URLSearchParams(document.location.search)
    if(searchParams.get('verify')){
      setVerify('showVerify')
      const obj = {
        email: searchParams.get('verify'),
        address: user.address,
        token: tokenNonDecoded.refreshToken
      }
      verifyEmail(obj).then(data => {
        if(data.status){
          //navigate("/")
          const resData = {
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken
          }
          setSessionCookie(resData);
          setIsAuthenticated(true)
          setTimeout(function(){
           window.location.href = "/"
          }, 8000)
          
        }
      })
    }   
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    const userInfo = {
       firstname: values.firstname,
       lastname: values.lastname,
       email: values.email,
       address: user.address
    }
    updateUserProfile(userInfo).then(data => {
      if(data.data.status){
        setVerify('showMessage')
        setLoading(false)
      }
    });
    
  };

  const emailAddrhost = values.email.split('@')[1];

  return (
    <div className="bg-black z-50 absolute w-full h-full top-0 left-0">
      <div className="relative">
        <div className="absolute inset-0 h-screen flex">
           <div className="m-auto bg-white p-10 w-6/12 h-auto">
             {verify === 'showForm' && (
              <>
              <div className='text-center mb-3'>
            <h1 className='text-lg font-bold'>Almost done!</h1>
            <p>To continue, kindly fill out the form with your details.</p>
            <small>Your personal information will be kept private.</small>
            </div>
              <form ref={form} onSubmit={handleSubmit}>
              <div className="flex flex-col gap-y-1 mb-3">
                <label className="text-md">First Name</label>
                <input
                  required
                  type="text"
                  placeholder="First Name..."
                  onChange={handleChange}
                  name='firstname'
                  className="text-sm px-4"
                />
              </div>
              <div className="flex flex-col gap-y-1 mb-3">
                <label className="text-md">Last Name</label>
                <input
                  required
                  type="text"
                  placeholder="Last Name..."
                  onChange={handleChange}
                  name='lastname'
                  className="text-sm px-4"
                />
              </div>
              <div className="flex flex-col gap-y-1 mb-3">
                <label className="text-md">Email</label>
                <input
                  required
                  type="email"
                  placeholder="Email..."
                  onChange={handleChange}
                  name='email'
                  className="text-sm px-4"
                />
              </div>
              <div className="flex flex-col gap-y-1 mt-10">
                <button
                  type="submit"
                  className="text-white text-sm font-semibold px-8 py-2 cursor-pointer createSpaceModalBtn"
                >
                  SUBMIT 

                  { loading && (
                      <Loader />
                    )} 
                </button>
              </div>
            </form>
            </>
             )}
              

            {verify === 'showMessage' && (
              <div>
                <h2 className='font-bold'>Hey {values.firstname},</h2>
                 <p className='text-md'>We have sent an email to you. Kindly check your inbox to verify your email address. <a className='text-blue-600' href={`https://www.${emailAddrhost}`} target={'_blank'}>Go to inbox</a></p>
              </div>
            )}

            {verify === 'showVerify' && (
              <div className='text-center'>
                <h2 className='font-bold text-md mb-2'>Congratulations!</h2>
                <p className='text-md'>Your email has been verified. You will be redirected shortly</p>
                <p className='text-md'>
                  <Loader className="border-b-2 border-blue-600" />
                </p>
                 <p className='text-sm'>please wait...</p>
 
              </div>
            )}

          </div>
        </div>
     </div>
    </div>
  );
};
