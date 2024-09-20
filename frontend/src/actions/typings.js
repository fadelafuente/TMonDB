import axios from 'axios';

axios.defaults.withCredentials = true;

export async function createTypes(data) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    const body = JSON.stringify(data);

    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/api/types/`, body, config);
    } catch(err) {
    }
}

export async function deleteTypeById(tid) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/types/${tid}/`, config);
    } catch(err) {
    }
}

export async function updateTypeById(tid, data={}) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    const body = JSON.stringify(data);

    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/api/types/${tid}/`, body, config);
    } catch(err) {
    }
}

// export async getTypesByRegion(region) {}
// export async getTypesByCreator(creator) {}