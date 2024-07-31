import axios from 'axios';

axios.defaults.withCredentials = true;

export async function getAllPosts(details={"page": 1}) {
    const access = localStorage.getItem("access");
    
    let config = undefined;
    if(access) {
        config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${access}`
            }
        };
    }

    const body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/?${body}`, config);
    } catch(err) {
        return null;
    }
}

export async function getPostById(pid) {  
    const access = localStorage.getItem("access");  
    let config = undefined;
    if(access) {
        config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${access}`
            }
        };
    }

    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${pid}/`, config);
    } catch(err) {
        if(err.response.status === 403) {
            return err.response
        }
        return null;
    }
}

export async function createPost(data) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    const body = JSON.stringify(data);

    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/`, body, config);
    } catch(err) {
    }
}

export async function deletePostById(pid) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${pid}/`, config);
    } catch(err) {
    }
}

export async function updatePostById(pid, interaction_type, data={}) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    const body = JSON.stringify(data);

    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/api/posts/${pid}/${interaction_type}/`, body, config);
    } catch(err) {
    }
}