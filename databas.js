// Databasen ligger i datalagret.
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const krypt = require('./kryptering');

// dbPromise tillåter oss att använda oss utav SQLLITE3 i vårat javascript.
// Vi användeross utav dbPromise när vi skall kontakta
// SQL-Databasen i koden.
// 

// -------------------------- USERS ------------------------------------------

const dbPromise = (async () => {
    return open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    })
})();

const getUsers = async () => {
    try {
        const dbCon = await dbPromise;
        const users = await dbCon.all('SELECT email, firstname, lastname, id FROM users ORDER BY lastname ASC');
        return users;
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }

}




const getConsumers = async () => {
    try {
        const dbCon = await dbPromise;
        const users = await dbCon.all('SELECT * FROM consumer ORDER BY email ASC');
        return users;
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }

}



const addUser = async (data) => {
    try {
        const dbCon = await dbPromise;
        let create = await krypt.createPassword(data.password);
        const users = await dbCon.run('INSERT INTO users (email, firstname, lastname, password) VALUES (?, ?, ?, ?)', [data.email, data.firstname, data.lastname, create]);
        return users;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}



const loginUser = async (data) => {
    try {
        const dbCon = await dbPromise;
        const login = await dbCon.get('SELECT * FROM users WHERE firstname = ?', [data.firstname]);
        compare = await krypt.compPass(data.password, login.password);
        console.log(compare);
        if (compare) {
            return login.firstname;
        } else {
            return 'Felaktiga inloggningsuppgifter';
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

//--------------- Consumers/SuperAdmin/Contributor------------------//


const getContributors = async () => {
    try {
        const dbCon = await dbPromise;
        const users = await dbCon.all('SELECT * FROM contributor ORDER BY email ASC');
        return users;
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }

}

const addConsumer = async (data) => {
    try {
        const dbCon = await dbPromise;
        let create = await krypt.createPassword(data.password);
        const users = await dbCon.run('INSERT INTO consumer (email, firstname, lastname, password) VALUES (?, ?, ?, ?)', [data.email, data.firstname, data.lastname, create]);
        return users;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const addContributor = async (data) => {
    try {
        const dbCon = await dbPromise;
        let create = await krypt.createPassword(data.password);
        const users = await dbCon.run('INSERT INTO contributor (email, firstname, lastname, password) VALUES (?, ?, ?, ?)', [data.email, data.firstname, data.lastname, create]);
        return users;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const deleteContributor = async (id) => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.run('DELETE FROM contributor WHERE id = ?', [id]);
        return resultat;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const updateContributor = async (data) => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.run('UPDATE contributor SET email = ? , firstname = ?, lastname = ? WHERE id = ?', [data.email, data.firstname, data.lastname, data.id]);
        console.log('Uppdatering lyckades')
        return resultat;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const loginConsumer = async (data) => {
    try {

        
        const dbCon = await dbPromise;
        const login = await dbCon.get('SELECT * FROM consumer WHERE email = ?', [data.email]);
        compare = await krypt.compPass(data.password, login.password);
        console.log('Compare: ' + compare);
       
        
        if (compare & login.blockStatus === 'Has Access') {

            console.log("Från DATABASEN: Du skrev rätt lösenord och är inte blockerad");
        }
        else if (login.blockStatus === 'Blocked'){
            console.log("FRÅN DATABASEN: Du är blockerad");
            throw new Error({ 'message': 'Blocked' });
        }
        else {
            console.log("FRÅN DATABASEN: Felaktiga inloggningsuppgifter!");
            throw new Error({ 'message': 'Wrong password or email!' });
        }



    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const loginContributor = async (data) => {
    try {

        
        const dbCon = await dbPromise;
        const login = await dbCon.get('SELECT * FROM contributor WHERE email = ?', [data.email]);
        compare = await krypt.compPass(data.password, login.password);
        console.log('Compare: ' + compare);
       
        
        if (compare & login.blockStatus === 'Has Access') {

            console.log("Från DATABASEN: Du skrev rätt lösenord och är inte blockerad");
        }
        else if (login.blockStatus === 'Blocked'){
            res.render('someView', {msg: 'Express'});
            console.log("FRÅN DATABASEN: Du är blockerad");
            throw new Error({ 'message': 'Blocked' });
        }
        else {
            console.log("FRÅN DATABASEN: Felaktiga inloggningsuppgifter!");
            throw new Error({ 'message': 'Wrong password or email!' });
        }



    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const loginSuperAdmin = async (data) => {
    try {
        const dbCon = await dbPromise;
        const login = await dbCon.get('SELECT email, password FROM superadmin WHERE email = ? AND password = ?', [data.email, data.password]);


        if (login.password == data.password) {

            console.log("Du skrev rätt lösenord")
        }
        else {
            return 'Du skrev fel lösenord'
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

// -------------------------------- PRODUCTS -----------------------------------------------------------

const addProduct = async (data) => {
    try {
        const dbCon = await dbPromise;
        await dbCon.run("INSERT INTO products (name,description,image,price,id) VALUES(?, ?, ?, ?, ?)", [data.name, data.description, data.image, data.price, data.id]);
        return { status: 'ok' };
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const getProducts = async () => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.all('SELECT * FROM products ORDER BY id ASC');
        return resultat;
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}


const deleteProduct = async (id) => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.run('DELETE FROM products WHERE id = ?', [id]);
        return resultat;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const updateProduct = async (data) => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.run('UPDATE products SET name = ? , description = ?, image = ?, price = ? WHERE id = ?', [data.name, data.description, data.image, data.price, data.id]);
        return resultat;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const updateImage = async (image, id) => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.run('UPDATE products SET image = ? WHERE id = ?', [image, id]);
        return resultat;
    } catch (error) {
        console.log(error);
    }
}



//-------------- Q&A Engine --------------------------//

const getQuestion = async () => {
    try {
        const dbCon = await dbPromise;
        const question = await dbCon.all('SELECT * FROM question ORDER BY qid ASC');
        return question;
    }
    catch (error) {
        console.log(error);
    }
}

const updateQuestion = async (data) => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.run('UPDATE question SET title = ?, description = ?, category = ?  WHERE qid = ?', [data.title, data.description, data.category, data.qid]);
        return resultat;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const deleteQuestion = async (qid) => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.run('DELETE FROM question WHERE qid = ?', [qid]);
        return resultat;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

const addQuestion = async (data) => {
    try {
        const dbCon = await dbPromise;
        await dbCon.run("INSERT INTO question (title,description,category) VALUES(?,?,?)", [data.title, data.description, data.category, data.qid]);
        return { status: 'ok' };
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
}

// ------------------------------------------ Contributor permisssions V -------------------------------------------//


const addAnswer = async (data) => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.run('UPDATE question SET answer = ?, username = ? WHERE qid = ?', [data.answer, data.username, data.qid]);
        return resultat;
    } catch (error) {
        console.log(error);
    }
}

const deleteAnswer = async (data) => {
    try {
        const dbCon = await dbPromise;
        const resultat = await dbCon.run('UPDATE question SET answer = "Deleted Answer", username = "No username yet" WHERE qid = ?', [data.qid]);
        return resultat;
    } catch (error) {
        console.log(error);
    }
}

const blockUser = async (data) => {
    try {
        const dbCon = await dbPromise;

        if (data.verify == "Consumer") {
            const resultat = await dbCon.run('UPDATE consumer SET blockStatus = "Blocked" WHERE email = ? AND verify = ? ', [data.email, data.verify])

            return resultat;
        } else if (data.verify == "Contributor") {
            const resultat2 = await dbCon.run('UPDATE contributor SET blockStatus = "Blocked" WHERE email = ? AND verify = ? ', [data.email, data.verify])

            return resultat2;

        }

    } catch (error) {
        console.log(error);
    }
}


const unblockUser = async (data) => {
    try {
        const dbCon = await dbPromise;

        if (data.verify == "Consumer") {
            const resultat = await dbCon.run('UPDATE consumer SET blockStatus = "Has Access" WHERE email = ? AND verify = ? ', [data.email, data.verify])

            return resultat;
        } else if (data.verify == "Contributor") {
            const resultat2 = await dbCon.run('UPDATE contributor SET blockStatus = "Has Access" WHERE email = ? AND verify = ? ', [data.email, data.verify])

            return resultat2;

        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUsers: getUsers,
    addProduct: addProduct,
    getProducts: getProducts,
    deleteProduct: deleteProduct,
    updateProduct: updateProduct,
    loginUser: loginUser,
    loginConsumer: loginConsumer,
    loginContributor: loginContributor,
    loginSuperAdmin: loginSuperAdmin,
    addUser: addUser,
    updateImage: updateImage,
    getQuestion: getQuestion,
    addQuestion: addQuestion,
    updateQuestion: updateQuestion,
    deleteQuestion: deleteQuestion,
    addAnswer: addAnswer,
    deleteAnswer: deleteAnswer,
    getConsumers: getConsumers,
    getContributors: getContributors,
    blockUser: blockUser,
    addContributor: addContributor,
    deleteContributor: deleteContributor,
    updateContributor: updateContributor,
    addConsumer : addConsumer,
    unblockUser : unblockUser

}