import { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllPosts } from "../actions/posts";

export default function useGetPosts(query, pageNumber) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setPosts([]);
    }, [query])

    function handleDuplicatesInArray(source, result) {
        if(!source) return [];
        let id_set = new Set(result.map(item => {return item.id}));
        source.forEach(item => {
            if(!id_set.has(item.id)) {
                id_set.add(item.id);
                result.push(item);
            }
        });

        return result;
    }
    
    useEffect(() => {
        setLoading(true);
        setError(false);
        getAllPosts(query, pageNumber).then((response) => {
            if(response) {
                setPosts(prevPosts => {
                    let result = [];
                    result = handleDuplicatesInArray(prevPosts, result);
                    result = handleDuplicatesInArray(response.data.results, result);
                    return result;
                })
                setHasMore(response.data.results.length > 0);
                setLoading(false);
            }
        }).catch(e => {
            setError(true);
        });
    }, [query, pageNumber])

    return { loading, error, posts, hasMore };
}

export function useSocialAuth(provider, socialAuthenticate) {
    const location = useLocation();

    useEffect(() => {
        const values = new URLSearchParams(location.search);
        const state = values.has("state") ? values.get("state") : null;
        const code = values.has("code") ? values.get("code") : null;

        if (state && code) {
            socialAuthenticate(state, code, provider);
        }
    }, [provider, location, socialAuthenticate]);
}

export function useNavigateOnAuth(isAuthenticated) {
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated) {
            return navigate("/trending");
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);
}

export function useLoginRedirect(e) {
    const navigate = useNavigate();
    e.preventDefault();

    navigate("/login");
}

export function useRequestSent(requestSent) {
    const navigate = useNavigate();

    useEffect(() => {
        if(requestSent) {
            return navigate("/trending");
        }
        // eslint-disable-next-line
    }, [requestSent]);
}

export function useFailedSocialAuth(email) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(!location.state && !email) {
            return navigate("/login");
        }
        // eslint-disable-next-line
    }, [location.state, email]);
}

export function useSetEmail(setEmail) {
    const location = useLocation();

    useEffect (() => {
        if(location.state) {
            setEmail(location.state.email);
        }
        // eslint-disable-next-line
    }, [location.state]);
}

export function useNavigateOnVerify(verified) {
    const navigate = useNavigate();

    useEffect(() => {
        if(verified) {
            return navigate("/login");
        }
        // eslint-disable-next-line
    }, [verified]);
}

export function useSetErrorMessage(errMessage, setMessage, isAuthenticated, setShow) {
    const errorMessageCallback = useCallback(() => {
        if(errMessage && 'email' in errMessage) {
            const err_message = errMessage['email'][0];
            setMessage(err_message);
        } else {
            setMessage('');   
        }
    }, [errMessage, setMessage]);

    useEffect(() => {
        if(errMessage && !isAuthenticated) {
            setShow(true);
            errorMessageCallback();
        }
    }, [errMessage, isAuthenticated, errorMessageCallback, setShow]);
}

export function useLoginFailed(loginFailed, isAuthenticated, setShow) {
    useEffect(() => {
        if(loginFailed && !isAuthenticated) {
            setShow(true);
        }
    }, [loginFailed, isAuthenticated, setShow]);
}

export function useRequestAttempt(accountCreated, errMessage, email, registerAttempt) {
    const navigate = useNavigate();

    useEffect(() => {
        // if register is successful, reset accountCreated in redux store before redirecting
        if(accountCreated && !errMessage) {
            registerAttempt();
            navigate("/verify", { state: { email: email } });
        }
        // eslint-disable-next-line
    }, [accountCreated, errMessage, email, registerAttempt]);
}