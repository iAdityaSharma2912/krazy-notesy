// If we are on Vercel, use the Environment Variable. 
// If we are on Localhost, use the Ngrok URL (or localhost:5000)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default API_URL;