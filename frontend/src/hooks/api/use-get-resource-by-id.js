import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getResourceById } from '../../actions/api';

export function useGetResourceById(resource) {
    const { id } = useParams();
    const [obj, setObj] = useState('');
    const [parent, setParent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getResourceById(resource, id).then((response) => {
            if(response && response.status === 200) {
                setObj(response.data);
                if(Object.keys(response.data).includes('parent') && response.data['parent']) {
                    getResourceById(resource, response.data['parent']).then((parent_response) => {
                        if(parent_response && parent_response.status === 200) {
                            setParent(parent_response.data);
                        }
                    }) 
                }   
            } else if(response) {
                setObj(response.data);
            }
        }).catch(e => {
        });
        setLoading(false);
    }, [id, resource]);

    return [obj, parent, loading];
}