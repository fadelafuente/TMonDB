import axios from 'axios';

axios.defaults.withCredentials = true;

export async function getAllPosts(query, details={"page": 1}) {
    const body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
    
    try {
        let url = `${process.env.REACT_APP_API_URL}/api/posts/?${body}`;
        if(query) url += `$q=${query}`; 
        return await axios.get(url);
    } catch(err) {
        return null;
    }
}

export async function getPostById(id) {    
    try {
        let url = `${process.env.REACT_APP_API_URL}/api/posts/${id}/`;
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

export async function deletePostById(id) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${id}/`, config);
    } catch(err) {
    }
}