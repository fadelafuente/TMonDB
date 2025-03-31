import axios from 'axios';

axios.defaults.withCredentials = true;

export async function updateTypeInBulk(data={}) {
    const access = localStorage.getItem('access');
    let config = {};
    
    if(access) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`
            }
        };
    }

    const body = JSON.stringify(data);

    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/api/types/bulk_update/`, body, config);
    } catch(err) {
    }
}