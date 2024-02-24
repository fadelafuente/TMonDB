import axios from 'axios';

axios.defaults.withCredentials = true;

export async function getAllPosts(query, details={"page": 1}) {
    const body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

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
        let url = `${process.env.REACT_APP_API_URL}/api/posts/?${body}`;
        if(query) url += `$q=${query}`; 
        return await axios.get(url, config);
    } catch(err) {
        return null;
    }
}

export async function getPostById(pid) {    
    try {
        let url = `${process.env.REACT_APP_API_URL}/api/posts/${pid}/`;
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

export async function deletePostById(pid) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${pid}/`, config);
    } catch(err) {
    }
}

export async function updatePostById(pid, interaction_type="likes_count", is_interact) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    const body = JSON.stringify({});

    try {
        if(interaction_type === "likes_count") {
            if(is_interact) {
                return await axios.patch(`${process.env.REACT_APP_API_URL}/api/posts/${pid}/set_like/`, body, config);
            }
            return await axios.patch(`${process.env.REACT_APP_API_URL}/api/posts/${pid}/unset_like/`, body, config);
        }
    } catch(err) {
    }
}