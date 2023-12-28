import axios from 'axios';

axios.defaults.withCredentials = true;

export async function getPostById(post_id) {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ post_id });

    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/posts`, body, config);
    } catch(err) {
        return null;
    }
}