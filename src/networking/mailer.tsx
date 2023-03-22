import   { axiosJWTInterceptor }   from '../utils/utils';

const axiosJWT = axiosJWTInterceptor;

const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const BASE_URL = config.base_url;

type MailRequest = {
    to: string,
    subject: string,
    message: string,
}

async function sendMail (mail: MailRequest) {
    const formData = new FormData()
    formData.append('to', mail.to);
    formData.append('subject', mail.subject);
    formData.append('message', mail.message);

    return new Promise((resolve) => {
      axiosJWT.post(`${BASE_URL}/api/mailer/send`, formData)
    .then(res => {
        resolve(res)
    }).catch(err => {
        console.log(err)
        throw Error("Failed to send mail")
    })

   })
}
export { sendMail }
export type { MailRequest }
