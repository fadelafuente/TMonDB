import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { getCurrentUsersBlockedList } from '../../actions/auth';
import BlockingCard from '../../components/Cards/BlockingCard';
import { FailedCard } from '../../components/Cards/FailedCard';
import LoadingCard from '../../components/Cards/LoadingCard';
import { usePagination } from '../../hooks/articles/use-pagination';

import '../../assets/styling/content.css';

export default function BlockingArticles({kwargs={}}) {
    const { query } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [blocks, lastBlock] = usePagination(query, getCurrentUsersBlockedList, 'users', kwargs);

    useEffect(() => {
       setLoading(true);
       if(blocks) setLoading(false); 
    }, [blocks]);

    return (
        <>
            {   
                blocks && !loading ? 
                    blocks.map((user, index) => {
                        if(blocks.length === index + 1) {
                            return <div key={user.id} ref={lastBlock}><BlockingCard user={user} /></div>
                        } else {
                            return <div key={user.id}><BlockingCard user={user} /></div>
                        }
                    })
                :
                    <FailedCard />
            }
            {
                loading ? 
                    <LoadingCard />
                :
                    ''
            }
        </>
    )
}