import React, { Dispatch, SetStateAction, useState, useContext,useRef,useEffect  } from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavbar.css'
import logoName from './../../../../../assets/logoName.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from './../../../../../context/AppContext'
import { Loader } from '../../../../SubComponents/Loader';

type NavHeadObject = {
  title: string
  img: string
}
interface Props {
  navHeading: NavHeadObject
  addr: any
  setShow: Dispatch<SetStateAction<Boolean>>
}

export const MainNavbar = (props:any) => {
  const [showDropdown, setShowDropdown] = useState<any>(false)
  const {user, authenticate, isAuthenticated, logout} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [clickedOutside, setClickedOutside] = useState(false);
  const ref = useRef<any>();
  const profileImg = user.profileImage;

  const onConnectWallet = async () => {
     setLoading(true);
     await authenticate()
      setLoading(false);    
  }
  const onDisconnectWallet = async () => {
    setLoading(true);
    await logout()
    console.log("logged out")
    setLoading(false); 
  }

  const handleClickOutside = (e:any) => {
    if (!ref.current.contains(e.target)) {    
       setTimeout(function(){
       props.setShow(false)
       props.showSpacesSidebar(false)
       }, 200)
       setClickedOutside(true);
     }else{
      props.setShow(true)
      props.showSpacesSidebar(true)
     }
  };
   
  const handleClickInside = () => setClickedOutside(false);
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  return (
    <div
      className={`dashboardNavbar border-b border-gray-700 relative shadow-sm px-4 py-4 sm:py-0 sm:h-14 gap-3 flex items-center justify-between`}
    >
      <button ref={ref}
        onClick={() => handleClickInside}
        className="block lg:hidden"
      >
        <FontAwesomeIcon icon={faBars} className="text-white text-xl" />
      </button>
      <div className="flex items-center">
      {!props.navHeading.img && (
           <NavLink to={`/`} className="md:text-2xl font-bold font-sans">
              <img src={logoName} alt="logoName" className="w-24" />
          </NavLink>
           )}
          <div className="flex items-center gap-x-2">
            {props.navHeading.img && (
              <img src={props.navHeading.img} alt="eye_circle" className="w-9 h-9 rounded-full" />
            )}
            <h1 className="text-white sm:text-lg font-semibold uppercase ">
              {props.navHeading.title}
            </h1>
          </div>
      </div>
      <div className="relative">
        {isAuthenticated && (
          <button
            className="px-4 sm:px-5 py-1 text-white text-xs rounded-md flex items-center gap-x-3 sm:gap-x-5"
            onClick={() => { setShowDropdown(!showDropdown) }}
          >
            <div className="address-btn rounded-full px-5 py-1 flex">
            <p className='wallet-letter'>
               {props.addr}
              </p> &nbsp;
              {profileImg && (
                <img src={profileImg} alt="profile_image" className="w-6 rounded-full" />
              )}
               {!profileImg && (
                <svg x="0" y="0" width="24" height="24" className="rounded-full">
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  transform="translate(2.299389835316899 4.570102117365969) rotate(80.3 12 12)"
                  fill="#03495E"
                ></rect>
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  transform="translate(-10.749367642753556 -8.939422045588962) rotate(360.2 12 12)"
                  fill="#C8143E"
                ></rect>
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  transform="translate(-6.673016781129218 15.6273702719975) rotate(205.0 12 12)"
                  fill="#F5D800"
                ></rect>
              </svg>
                )}

            </div>
            
          </button>
        )}
        {showDropdown && (
          <div className="px-6 py-4 flex flex-col items-start gap-y-3 absolute z-10 dropdown right-0 mt-2 logout-layer">

            <button
              onClick={() => {
                onDisconnectWallet()
                setShowDropdown(false)
              }}
              className="bg-red-500 text-white text-xs font-semibold rounded-lg px-5 py-2 logout-design"
            >
              Disconnect 
              {loading && (
              <Loader />
            )}
            </button>
          </div>
        )}
        {!isAuthenticated && (
          <button
            onClick={onConnectWallet}
            className="px-4 sm:px-10 py-1 text-white text-xs border-2 border-gray-500 connectBtn rounded-full"
          >
            Connect 
            {loading && (
              <Loader />
            )}
            
          </button>
        )}
      </div>
    </div>
  )
}
