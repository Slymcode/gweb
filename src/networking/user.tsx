import { AxiosRequestHeaders } from 'axios';
import { setSessionCookie } from '../utils/session';
import axios from 'axios';

// TODO: use an environment variable to swap url out

const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const BASE_URL = config.base_url;

type User = {
    address: string
    name: string,
    email: string,
    profileImage: string,
    firstname: string,
    lastname: string
}

type UserAuth = {
    userId: string | null,
    address: string | null,
    sessionToken: string | null
}


const createAndLoginUser = async (user:User) => {
    const formData = new FormData();
    formData.append('address', user.address);
    formData.append('email', user.email?user.email:'');
    formData.append('name', user.name?user.name:'');
    formData.append('profileImage', user.profileImage?user.profileImage:'');
    return new Promise((resolve) => {
        axios.post(`${BASE_URL}/api/users/create-login-user`, formData)
      .then(res => {
          resolve(res)
      }).catch(err => {
          console.log(err)
      })
   })
}

const refreshToken = async (refreshToken:any) => {
    try{
        const res = await axios.post(`${BASE_URL}/api/jwt/refresh-token`, {token: refreshToken});
        return res.data
    }catch(err){
        console.log(err)
    }
}


const deleteUserAccessToken = async (token:any) => {
    const formData = new FormData();
    formData.append('token', token);
    return new Promise((resolve) => {
        axios.post(`${BASE_URL}/api/users/delete-user-accessToken`, formData)
      .then(res => {
          resolve(res)
      }).catch(err => {
          console.log(err)
      })
   })
}

const updateUserProfile = async (user:User) => {
    const formData = new FormData();
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('email', user.email);
    formData.append('address', user.address);

    return new Promise((resolve) => {
        axios.post(`${BASE_URL}/api/users/update-user-profile`, formData)
      .then(res => {
          resolve(res)
      }).catch(err => {
          console.log(err)
      })
   })
}

const verifyEmail = async (param:any) => {
    const formData = new FormData();
    formData.append('address', param.address);
    formData.append('token', param.token);
    formData.append('email', param.email);
    return new Promise((resolve) => {
        axios.post(`${BASE_URL}/api/users/verify-email`, formData)
      .then(res => {
          resolve(res)
      }).catch(err => {
          console.log(err)
      })
   })
}

export { createAndLoginUser, deleteUserAccessToken, updateUserProfile, verifyEmail, refreshToken}
export type { User, UserAuth }
