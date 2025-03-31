import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';

import { getResourceById } from '../actions/api';
import ReplyBar from './Bars/ReplyBar';
import { BlockedCard } from './Cards/BlockedCard';
import { DeletedCard } from './Cards/DeletedCard';
import { FailedCard } from './Cards/FailedCard';
import PostCard from './Cards/PostCard';
import PostArticle from './PostArticle';

import '../assets/styling/content.css';
import '../assets/styling/ViewPost.css';

export default function ViewPost() {
    const { pid } = useParams();
    const [post, setPost] = useState('');
    const [parent, setParent] = useState('');

    useEffect(() => {
        getResourceById('posts', pid).then((response) => {
            if(response && response.status === 200) {
                setPost(response.data);
                if(response.data['parent']){
                    getResourceById('posts', response.data['parent']).then((parent_response) => {
                        if(parent_response && parent_response.status === 200) {
                            setParent(parent_response.data);
                        }
                    }) 
                }   
            } else if(response) {
                setPost(response.data);
            }
        }).catch(e => {
        });
    }, [pid]);

    return (
        <>
            { post ? 
                post.current_user_is_blocked ?
                    <div className='article-container'>
                        <BlockedCard creator={post.creator} />
                    </div>
                :
                    post.detail == 'Post not found.' ? 
                        <div className='article-container'>
                            <FailedCard />
                        </div>
                    :
                        <div>
                            { post.parent_deleted ?
                                <div className='parent-container article-container'>
                                    <DeletedCard />
                                </div>
                            :  
                                parent ? 
                                    <div className='parent-container article-container'>
                                        <PostCard post={parent} />
                                    </div>
                                : 
                                    ''
                            }
                            <div className='article-container'>
                                <PostCard post={post} />
                            </div>
                            <div className='reply-container'>
                                <ReplyBar parent={post.article.id} />
                            </div>
                            <div className='comments-container article-container'>
                                <PostArticle query={ null } kwargs={ {parent: post.article.id} } />
                            </div>
                        </div>
            : 
                <div className='loading-container center-content'>
                    <Spinner animation='border' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </Spinner>
                </div>
            }
        </>
    )
}