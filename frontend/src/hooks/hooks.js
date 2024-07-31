import { useEffect, useCallback, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { deletePostById, createPost, updatePostById } from "../actions/posts";
import { handleValidation, handleDuplicatesInArray } from "../functions/handlers";
import { followUser, getCurrentUserDetails, getFollowById, getUserProfile, updateDetails } from "../actions/auth";

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
            return navigate("/login");
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

export function useGetProfile(username) {
    const [profile, setProfile] = useState(null);
    const [followed, follows, setFollow] = useFollow(0, false);

    useEffect(() => {
        getUserProfile(username).then((response) => {
            if(response && response.status === 200) {
                setProfile(response.data);
                setFollow(response.data["followers_count"], response.data["user_follows"]);
            }
        }).catch(() => {
            setProfile(null);
        });
        
        // eslint-disable-next-line
    }, [username]);

    return [profile, followed, follows, setFollow];
}

export function useCurrentUserDetails(isAuthenticated) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getCurrentUserDetails().then((response) => {
            if(response && response.status === 200) {
                setUser(response.data);
            }
        });
    }, [isAuthenticated]);

    return [user];
}

export function useFollow(initial_interaction, user_interacted) {
    const [interaction, setInteraction] = useState(initial_interaction);
    const [interacted, setInteracted] = useState(user_interacted);

    function handleFollowUser(pid) {
        followUser(pid).then((response) => {
            if(response && response.status === 200) {
                let change = interacted ? -1 : 1;
                setInteraction(interaction + change);
                setInteracted((prev) => !prev);
            }
        });
    }

    function handleFollowHelper(value, interacted=null) {
        if(typeof interacted === "boolean") {
            setInteraction(value);
            setInteracted(interacted);   
        } else {
            handleFollowUser(value);
        }
    }

    return [interacted, interaction, handleFollowHelper];
}

export function useUpdateProfile(initialForm) {
    const [formData, setFormData] = useFormData(initialForm);

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

    function handleUpdateProfile(e, bio) {
        e.preventDefault();

        if(bio) {
            updateDetails({bio});
        }
    }

    return [formData, handleFormData, handleUpdateProfile];
}

export function useTimedAlert(initial_state) {
    if(typeof initial_state !== "boolean") initial_state = false;
    const [showAlert, setShowAlert] = useState(initial_state);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setShowAlert(false);
        }, 5000)

        return () => {
            clearTimeout(timeId);
        }
        // eslint-disable-next-line
    }, [showAlert])

    return [showAlert, setShowAlert];
}

export function useUserFollow(uid, pageNumber, follow_type, query) {
    const [loading, setLoading] = useState(true);
    const [follow, setFollow] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setFollow([]);
    }, [query]);
    
    useEffect(() => {
        if(hasMore) {
            setLoading(true);
            let query_details = { "page": pageNumber }
            if(query) query_details["search"] = query

            if (uid) {
                getFollowById(uid, follow_type, query_details).then((response) => {
                    if(response) {
                        setFollow(prevUsers => {
                            let result = [];
                            result = handleDuplicatesInArray(prevUsers, result);
                            result = handleDuplicatesInArray(response.data.results, result);
                            return result;
                        });
                        setHasMore(response.data.results.length > 0);
                        setLoading(false);
                    }
                }).catch(() => {
                    setFollow([]);
                    setHasMore(false);
                    setLoading(false);
                });
            }
        }

        // eslint-disable-next-line
    }, [query, pageNumber, follow_type, uid])

    return [ loading, follow, hasMore ];
}

export function usePaginatedUserFollow(uid, follow_type, query) {
    const [pageNumber, setPageNumber] = useState(1);
    const [ loading, users, hasMore ] = useUserFollow(uid, pageNumber, follow_type, query);
    const observer = useRef();

    useEffect(() => {
        setPageNumber(1);
    }, [query, follow_type])

    const lastUser = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node);
    }, [loading, hasMore]);

    return [users, lastUser];
}

export function useGetInformation(pageNumber, query, getFunc, kwargs={}) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setItems([]);
    }, [query]);
    
    useEffect(() => {
        setLoading(true);
        let query_details = {"page": pageNumber, ...kwargs};
        if(query) query_details["search"] = query;

        getFunc(query_details).then((response) => {
            if(response) {
                setItems(prevPosts => {
                    let result = [];
                    result = handleDuplicatesInArray(prevPosts, result);
                    result = handleDuplicatesInArray(response.data.results, result);
                    return result;
                });
                setHasMore(response.data.results.length > 0);
                setLoading(false);
            }
        }).catch(() => {
            setItems([]);
            setHasMore(false);
            setLoading(false);
        });

        // eslint-disable-next-line
    }, [query, pageNumber])

    return { loading, items, hasMore };
}

export function usePagination(query, getFunc, kwargs) {
    const [pageNumber, setPageNumber] = useState(1);
    const { loading, items, hasMore } = useGetInformation(pageNumber, query, getFunc, kwargs);
    const observer = useRef();

    useEffect(() => {
        setPageNumber(1);
    }, [query])

    const lastItem = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node);
    }, [loading, hasMore]);

    return [items, lastItem];
}