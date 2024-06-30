import { apiPrivate, apiPublic } from "../Ultils/AxiosCustomize"

export const registerEmail = (email) => {
  return apiPublic.post('/email/register', email, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}

export const sendMail = ({ subject, content }) => {
  return apiPrivate.post('/email/send', {
      subject: subject,
      content: content,
  });
};

