import axios from 'axios';

axios.defaults.withCredentials = true;

export async function getAllPosts(query, pageNumber=1) {
    try {
        let url = `${process.env.REACT_APP_API_URL}/api/posts/?page=${pageNumber}`;
        if(query) url += `$q=${query}`; 
        return await axios.get(url);
    } catch(err) {
        return null;
    }
}

export async function createPost(content) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    const body = JSON.stringify({ content });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/`, body, config);
    } catch(err) {
    }
}