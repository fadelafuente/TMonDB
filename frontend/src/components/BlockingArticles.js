import { usePagination } from "../hooks/hooks";
import BlockingCard from "./BlockingCard";
import Spinner from 'react-bootstrap/Spinner';
import { FailedCard } from "./FailedCard";
import { useEffect, useState } from "react";
import { getCurrentUsersBlockedList } from "../actions/auth";

import "../assets/styling/content.css";

export default function BlockingArticles({query, kwargs={}}) {
    const [loading, setLoading] = useState(true);
    const [blocks, lastBlock] = usePagination(query, getCurrentUsersBlockedList, kwargs);

    console.log(blocks);
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
                    <div className="loading-container center-content">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    ""
            }
        </>
    )
}