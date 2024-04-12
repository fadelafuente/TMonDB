import { useEffect, useCallback, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { deletePostById, getAllPosts } from "../actions/posts";
import { handleValidation, handleDuplicatesInArray } from "../functions/handlers";
import { updatePostById } from "../actions/posts";
import { createPost } from "../actions/posts";

export default function useGetPosts(query, pageNumber, kwargs={}) {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setPosts([]);
    }, [query]);
    
    useEffect(() => {
        setLoading(true);
        let query_details = {"page": pageNumber, ...kwargs}

        getAllPosts(query_details).then((response) => {
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
        }).catch(() => {
            setPosts([]);
            setHasMore(false);
            setLoading(false);
        });

        // eslint-disable-next-line
    }, [query, pageNumber])

    return { loading, posts, hasMore };
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
            return navigate("/home");
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);
}

export function useNavigateNotAuth(isAuthenticated) {
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated === false) {
            return navigate("/login");
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);
}

export function useRequestSent(requestSent) {
    const navigate = useNavigate();

    useEffect(() => {
        if(requestSent) {
            return navigate("/home");
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

export function useEmailFromLocation() {
    const [email, setEmail] = useState('');
    const location = useLocation();

    useEffect (() => {
        if(location.state) {
            setEmail(location.state.email);
        }
        // eslint-disable-next-line
    }, [location.state]);

    return email;
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

export function useRegisterAttempt(errMessage, isAuthenticated, registerAttempt) {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    const errorMessageCallback = useCallback(() => {
        if(typeof errMessage == "string") {
            const element = new DOMParser().parseFromString(errMessage, "text/html").getElementsByClassName("exception_value");
            const err_message = element[0].innerHTML.replace(/['"]+/g, "");
            setMessage(err_message);
        } else if(typeof errMessage == "object" && 'email' in errMessage) {
            const err_message = errMessage['email'][0];
            setMessage(err_message);
        } else if(typeof errMessage == "object" && 'username' in errMessage) {
            let err_message = errMessage['username'][0];
            err_message = err_message.charAt(0).toUpperCase() + err_message.slice(1);
            setMessage(err_message);
        } else {
            setMessage('');   
        }
    }, [errMessage]);

    useEffect(() => {
        if(errMessage && !isAuthenticated) {
            setShow(true);
            errorMessageCallback();
        }
    }, [errMessage, isAuthenticated, errorMessageCallback]);

    function resetRegisterAttempt() {
        registerAttempt();
        setShow(false);
    }

    return [show, resetRegisterAttempt, message];
}

export function useLoginAttempt(loginFailed, isAuthenticated, loginAttempt) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(loginFailed && !isAuthenticated) {
            setShow(true);
        }
    }, [loginFailed, isAuthenticated]);

    function resetLoginAttempt() {
        loginAttempt();
        setShow(false);
    }

    return [show, resetLoginAttempt];
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

export function useFormData(initialForm) {
    const [formData, setFormData] = useState(initialForm);

    function handleChange(e, resetForm=false) {
        if(resetForm) {
            setFormData(initialForm);
        } else {
            if(e.target.id === "username-input") {
                e.target.value = e.target.validity.valid || e.target.value === "" ? e.target.value : formData["username"];
            }

            setFormData({ ...formData, [e.target.name]: e.target.value });

            if(e.target.id === "password-input") {
                handleValidation(e.target.value);
            }
        }
    }

    return [formData, handleChange];
}

export function usePassword() {
    const [showPass, setShowPass] = useState(false);

    function handleShowPass(id) {
        const password_input = document.getElementById(id);
        setShowPass((prev) => !prev);
        const type = showPass ? "password" : "text";
        password_input.setAttribute("type", type);
    }

    return [showPass, handleShowPass];
}

export function useCreatePost(initialForm) {
    const [formData, setFormData] = useFormData(initialForm);
    const navigate = useNavigate();

    function handleFormData(e, resetPost=false) {
        if(e.target.id === "auto-resizing") {
            const textarea = document.getElementById("auto-resizing");
            textarea.addEventListener('input', autoResize, false);
            function autoResize() {
                this.style.height = "auto";
                this.style.height = this.scrollHeight + "px";
            }
        }
        setFormData(e, resetPost);
    }

    function handleCreatePost(e, content, is_reply, parent) {
        e.preventDefault();

        if(content) {
            createPost({content, is_reply, parent}).then(response => {
                if(response && response.status === 201) {
                    navigate(`/${response.data["creator_username"]}/${response.data["id"]}`);
                }
            });
        }
    }

    return [formData, handleFormData, handleCreatePost];
}

export function useDiscardModal(formData, setShow) {
    const [showDiscard, setShowDiscard] = useState(false);

    function handleDiscard(e, setFormData=null) {
        if(setFormData === null) {
            const { content } = formData;
            if(!content) {
                setShow(false);
            } else {
                setShowDiscard(true);
            }
        } else if(typeof setFormData === "boolean") {
            setShowDiscard(setFormData);
        } else if(typeof setFormData === "function") {
            setFormData(e, true);
            setShowDiscard(false);
            setShow(false);
        }
    }

    return [showDiscard, handleDiscard];
}

export function usePaginatedPosts(query, kwargs) {
    const [pageNumber, setPageNumber] = useState(1);
    const { loading, posts, hasMore } = useGetPosts(query, pageNumber, kwargs);
    const observer = useRef();

    useEffect(() => {
        setPageNumber(1);
    }, [query])

    const lastPost = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node);
    }, [loading, hasMore]);

    return [posts, lastPost];
}

export function useInteractions(initial_interaction, user_interacted) {
    const [interaction, setInteraction] = useState(initial_interaction);
    const [interacted, setInteracted] = useState(user_interacted);

    function handleUpdateInteractions(e, pid) {
        updatePostById(pid, e.currentTarget.name).then((response) => {
            if(response && response.status === 200) {
                let change = interacted ? -1 : 1;
                setInteraction(interaction + change);
                setInteracted((prev) => !prev);
            }
        });
    }

    function handleInteractionsHelper(value) {
        let change = value ? 1 : 0;
        setInteraction(interaction + change);
        setInteracted(value);
    }

    function handleInteractions(e, value) {
        if(typeof value === "boolean") {
            handleInteractionsHelper(value);
        } else if(typeof value === "number") {
            handleUpdateInteractions(e, value);
        }
    }

    return [interacted, interaction, handleInteractions];
}

export function useMiddleViewPort() {
    const [aboveMid, setAboveMid] = useState(true);

    function handleMiddleHeight(e) {
        const middlehalf = window.innerHeight / 2;
        setAboveMid(e.clientY > middlehalf);
    }

    return [aboveMid, handleMiddleHeight];
}

export function useDeletePost(initial) {
    const [isDeleted, setIsDeleted] = useState(initial);

    function handleDelete(pid) {
        deletePostById(pid).then((response) => {
            if(response && response.status === 204) {
                setIsDeleted(true);
            }
        });
    }

    return [isDeleted, handleDelete];
}