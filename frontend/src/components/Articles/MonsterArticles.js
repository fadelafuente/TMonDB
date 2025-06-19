import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { FailedCard } from '../Cards/FailedCard';
import LoadingCard from '../Cards/LoadingCard';
import MonsterCard from '../Cards/MonsterCard';
import { getAllResources } from '../../actions/api';
import { usePagination } from '../../hooks/articles/use-pagination';

import '../../assets/styling/content.css';

export default function MonsterArticles({kwargs={}}) {
    const { query } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [monsters, lastMonster] = usePagination(query, getAllResources, 'monsters', kwargs);

    useEffect(() => {
       setLoading(true);
       if(monsters) setLoading(false); 
    }, [monsters]);

    return (
        <div className='col-gap-container'>
            {
                loading ? 
                    <LoadingCard />
                :
                    monsters ? 
                        monsters.map((monster, index) => {
                            if(monsters.length === index + 1) {
                                return <div className='mon-article' key={monster.id} ref={lastMonster}><MonsterCard monster={monster} /></div>
                            } else {
                                return <div className='mon-article' key={monster.id}><MonsterCard monster={monster} /></div>
                            }
                        }) 
                    :
                        <FailedCard />
            }
        </div>
    )
}