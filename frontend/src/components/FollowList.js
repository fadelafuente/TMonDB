import { usePaginatedUserFollow } from "../hooks/hooks";
import { FailedCard } from "./Cards/FailedCard";
import FollowCard from "./Cards/FollowCard";

import "../assets/styling/content.css";

export default function FollowList({uid, follow_type, query}) {
    const [users, lastUser] = usePaginatedUserFollow(uid, follow_type, query);

    return (
        <>
            {   
                users ? 
                    users.map((user, index) => {
                        if(users.length === index + 1) {
                            return <div key={user.id} ref={lastUser}><FollowCard user={user} /></div>
                        } else {
                            return <div key={user.id}><FollowCard user={user} /></div>
                        }
                    })
                :
                    <FailedCard />
            }
        </>
    )
}