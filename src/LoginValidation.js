function validation(values) {
    let error = {}
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (values.email === "") {
        error.email = "Name should not be empty"

    } 
    
    else if (!email_pattern.test(values.email)) {
        error.email = "Email address is invalid"
    }else{
        error.email = ""
    }

    if (values.password === "") {
        error.password = "Password should not be empty"
    }
    else if (!password_pattern.test(values.password)) {
        error.password = "Password is invalid"
    }else{
        error.password = ""
    }
    return error;
}

export default validation;