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