import { FailedCard } from "./Cards/FailedCard";
import FollowCard from "./Cards/FollowCard";
import { usePaginatedUserFollow } from "../hooks/profile/use-paginated-user-follow";

import "../assets/styling/content.css";

export default function FollowList({username, follow_type, query}) {
    const [users, lastUser] = usePaginatedUserFollow(username, follow_type, query);

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