import { usePaginatedUserFollow } from "../hooks/hooks";
import { FailedCard } from "./FailedCard";

import "../assets/styling/content.css";
import FollowCard from "./FollowCard";

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