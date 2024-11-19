const validateMail = (email) => {
    if (email == 0){

        console.log('Validation Fail Email')
        return false;}
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    test = re.test(String(email).toLowerCase());
    console.log(test)
    return test;
};


const validateFname = (firstname) => {
    if (isNaN(firstname)){

        var re = /^[A-Za-z]+$/;
        let name = re.test(String(firstname));
        console.log(name)
        return name;

    } else {
        console.log('Validation fail Firstname')
        return false
    }
}


const validateNumber = (data) => {
     if(isNaN(data)){

        console.log('Validation Fail Number');
        return false;

    } else {
        console.log('Validation Fail Number');
        return true;
    }
}

const validatePassword = (password) => {
     if (password){

        var re = /^[A-Za-z]\w{7,14}$/; // Användaren måste skriva in ett lösenord mellan 7 till 14 letters.
        let pwd = re.test(String(password));
        console.log(pwd + ' pwd')
        return(pwd);

    } else {

        console.log('Mata in rätt lösenord')
        return false;
    }
}


module.exports = {
    validateMail : validateMail, validateFname : validateFname, validateNumber : validateNumber, validatePassword : validatePassword
};