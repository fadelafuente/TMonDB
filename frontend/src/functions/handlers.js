import axios from "axios";

axios.defaults.withCredentials = true;

export function handleChange(e, setFormData, formData) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
}

export function handleClose(resetFunc, setShow) {
    resetFunc();
    setShow(false);
}

export function handleChangeAndValidation(e, setFormData, formData) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    handleValidation(e.target.value);
}

export function handleShowPass(id, setFunc, showPass) {
    const password_input = document.querySelector(id);
    setFunc((prev) => !prev);
    const type = showPass ? "password" : "text";
    password_input.setAttribute("type", type);
}

export async function handleSocialAuth(e, provider, redirectUri) {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/${provider}/?redirect_uri=${redirectUri}`);

        window.location.replace(res.data.authorization_url)
    } catch(err) {

    }
}

export function handleValidation(pw) {
    const lowercase = document.getElementById("lowercase");
    const uppercase = document.getElementById("uppercase");
    const number = document.getElementById("number");
    const special = document.getElementById("special");
    const length = document.getElementById("length");

    const lowerCaseLetters = /[a-z]/;
    const upperCaseLetters = /[A-Z]/;
    const numbers = /[0-9]/;
    const specialCharacters = /[^\w\s]/;

    if(lowerCaseLetters.test(pw)) {
        lowercase.classList.remove("invalid");
        lowercase.classList.add("valid");
    }
    else {
        lowercase.classList.remove("valid");
        lowercase.classList.add("invalid");
    }

    if(upperCaseLetters.test(pw)) {
        uppercase.classList.remove("invalid");
        uppercase.classList.add("valid");
    }
    else {
        uppercase.classList.remove("valid");
        uppercase.classList.add("invalid");
    }

    if(numbers.test(pw)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    }
    else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    if(specialCharacters.test(pw)) {
        special.classList.remove("invalid");
        special.classList.add("valid");
    }
    else {
        special.classList.remove("valid");
        special.classList.add("invalid");
    }

    if(pw.length >= 8 && pw.length <= 20) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    }
    else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }
}

export function handleTimeDifference(posted_date) {
    const current_date = new Date();
    const time = Date.parse(posted_date);
    const seconds = (current_date - time) / 1000;
    const minutes = Math.floor(seconds/60);
    const hours = Math.floor(minutes/60);
    const days = Math.floor(hours/24);
    const months = Math.floor(days/31);
    const years = Math.floor(months/12);

    if(years > 0) {
        return years + "y";
    } else if(months > 0) {
        return months + "M";
    } else if(days > 0) {
        return days + "d";
    } else if(hours > 0) {
        return hours + "h";
    } else if(minutes > 0) {
        return minutes + "m"
    } else {
        return "<1m";
    } 
}

export function handleGallery(gallery) {
    if(gallery == null) {
        const image_gallery = document.getElementById("image-gallery");
        image_gallery.innerHTML = "";
        return;
    }

    /* TODO:
            const image_gallery = document.getElementById("image-gallery");
            if(gallery.length == 1) {
                image-gallery.innerHTML = <img src={ gallery[0] } />
            } else {
                let formatted_gallery = "<Carousel interval={null}>";
                for(let index = 0; index < gallery.length; index++) {
                    formatted_gallery += 
                        `<Carousel.Item>
                                <img src={ ${gallery[i]} } />
                            </Carousel.Item>`;
                }
                formatted_gallery += "</Carousel>";
                image_gallery.innerHTML = formatted-gallery;
            }
    */
}

export function handleLoginRedirect(e, navigate) {
    e.preventDefault();

    navigate("/login");
}

export function handleDiscard(setContent, setShowDiscard, setShow) {
    setContent("");
    setShowDiscard(false);
    setShow(false);
}

export function handleContentChange(e, setContent) {
    setContent(e.currentTarget.textContent)
}

export function HandleCreateClose( setShow, setShowDiscard, content) {
    if(!content) {
        setShow(false);
    } else {
        setShowDiscard(true);
    }
}