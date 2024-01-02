import axios from 'axios';

axios.defaults.withCredentials = true;

export async function getAllPosts() {
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/`);
    } catch(err) {
        return null;
    }
}