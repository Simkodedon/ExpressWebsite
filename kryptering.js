const bcrypt = require('bcrypt');
const saltRounds = 10;


const createPassword = async (password) => {
    
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};


const compPass = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};


module.exports = {
    createPassword : createPassword,
    compPass : compPass
};