// Instansdatat nedan V

const { rejects } = require('assert');
const { EROFS } = require('constants');
const multer = require('multer');   // -- Multer är våran middleware som hjälper oss ladda upp filer.
const upload = multer({ dest: 'upload/' });
const routes = require('express').Router();  //--- Express är motsvarande HTTP
const dbService = require('./databas'); //-- DBService kontaktar SQL servern
const validate = require('./validerings');
const fs = require('fs').promises;
const krypt = require('./kryptering');


// --------------------- Nedanstående är funktionerna för Användaren/Consumer/Admin/Contributor ---------------------------------- 

routes.get('/users', async (req, res) => {
    try {
        const users = await dbService.getUsers()
        res.send(users);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

routes.get('/consumers', async (req, res) => {
    try {
        const users = await dbService.getConsumers()
        res.send(users);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

routes.get('/contributors', async (req, res) => {
    try {
        const users = await dbService.getContributors()
        res.send(users);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});


routes.get('/consumer/:id', async (req, res) => {

    try {
        const resultat = await dbService.getConsumers();
        finder = resultat.find((p) => {
            return p.id == req.params.id;
        });
        if (finder) {
            res.json(finder);
        }
        else {
            res.status(404).send(`User with id: ${req.params.id} not found`);
        }

    }

    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

routes.get('/contributor/:id', async (req, res) => {

    try {
        const resultat = await dbService.getContributors();
        finder = resultat.find((p) => {
            return p.id == req.params.id;
        });
        if (finder) {
            res.json(finder);
        }
        else {
            res.status(404).send(`User with id: ${req.params.id} not found`);
        }

    }

    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

/// SUPER ADMIN ADD CONTRIBUTOR

routes.post('/add/contributor', async (req, res) => {
    // Anropa databasen och lägg till data

    try {
        const resultat = await dbService.addContributor(req.body);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
    console.log(req.body);
    res.json({ status: 'Contributor added' })
});



routes.post('/add/consumer', async (req, res) => {
    // Anropa databasen och lägg till data

    try {
        const resultat = await dbService.addConsumer(req.body);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
    console.log(req.body);
    res.json({ status: 'Consumer added' })
});
// Radera en contributor

routes.delete('/delete/contributor/:id', async (req, res) => { //Radera

    try {

        let id = req.params.id;
        let resultat = await dbService.deleteContributor(id);

        if (resultat.changes == 1) {
            res.json({ Successful: `ID: ${id} är nu raderat från databasen` });
            console.log("Du Lyckades radera contributor med ID: " + id);

        } else {
            res.json({ status: `Kunde inte hitta id med: ${id}` });
            console.log("Kunde inte hitta id med " + id);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

// Uppdatera en contributor
routes.put('/update/contributor', async (req, res) => {
    try {

        let data = req.body;

            let result = await dbService.updateContributor(data);

            if (result.changes == 1) {
                res.json({ Status: 'Uppdatering lyckades', Product: data });
            } else {
                res.json({ Error: 'FelaktigID', Gäller: data.id }); // tog bort data: data.id 'Kan inte hitta ID'
            }

    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

/// LOGIN NEDAN 
/*
routes.post('/login', async (req, res) => {
    try {
        const data = req.body;
        const user = await dbService.loginUser(data);

        res.json({ status: 'Ok', user: user });
    } catch (error) {
        return error;
    }

});
*/

routes.post('/login/superadmin', async (req, res) => {
    try {
        const data = req.body;
        const superadmin = await dbService.loginSuperAdmin(data);
        res.json({ status: 'Ok', Meddelande: superadmin });
    } catch (error) {
        return error;
    }

});

routes.post('/login/contributor', async (req, res) => {
    try {
        const data = req.body;
        const contributor = await dbService.loginContributor(data);

        res.json({ status: 'Ok', contributor: contributor });
        console.log('Login succeeded as ' + data.email);
    } catch (error) {
        return error;
    }

});


routes.post('/login/consumer', async (req, res) => {
    try {
        const data = req.body;
        const consumer = await dbService.loginConsumer(data);
        res.json({ status: 'Routen fungerar', status: consumer });

    } catch (error) {
        return error;
    }

});

/*
routes.post('/register', async (req, res) => { //Registrera en ny användare till SQL-databasen och verifiera med hjälp av validering.js
    try {
        const data = req.body;
        if (validate.validateMail(data.email) && validate.validateFname(data.firstname) && validate.validatePassword(data.password)) {
            const user = await dbService.addUser(data);
            if (user.changes == 1) {
                res.json({ status: 'Användare tillagd', data });
            } else {
                res.json({ status: 'Error' });
            }
        } else {
            console.log('Validation Fail Register')
            return res.json({ ValidationError: 'Validation Fail Register' });
        }
    } catch (error) {
        res.json(error);
    }
});
*/


// --------------------             Nedanstående är CRUD- Operationerna för produkterna -----------------------------------

routes.post('/product', async (req, res) => {
    // Anropa databasen och lägg till data

    try {
        const resultat = await dbService.addProduct(req.body);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
    console.log(req.body);
    res.json({ status: 'ok' })
});

// Hämta alla produkter
routes.get('/products', async (req, res) => {
    try {
        const resultat = await dbService.getProducts();
        res.json(resultat);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

// Hämta en specifik produkt
routes.get('/product/:id', async (req, res) => {

    try {
        const resultat = await dbService.getProducts();
        finder = resultat.find((p) => {
            return p.id == req.params.id;
        });
        if (finder) {
            res.json(finder);
        }
        else {
            res.status(404).send(`Product with id: ${req.params.id} not found`);
        }

    }

    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

// Radera en produkt

routes.delete('/delete/:id', async (req, res) => { //Radera

    try {

        let id = req.params.id;
        let resultat = await dbService.deleteProduct(id);

        if (resultat.changes == 1) {
            res.json({ Successful: `ID: ${id} är nu raderat från databasen` });
            console.log("Du Lyckades radera produkt med ID: " + id);

        } else {
            res.json({ status: `Kunde inte hitta id med: ${id}` });
            console.log("Kunde inte hitta id");
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});


// Uppdatera en produkt
routes.put('/update/', async (req, res) => {
    try {

        let data = req.body;

            let result = await dbService.updateProduct(data);

            if (result.changes == 1) {
                res.json({ Status: 'Uppdatering lyckades', Product: data });
            } else {
                res.json({ Error: 'FelaktigID', Gäller: data.id }); // tog bort data: data.id 'Kan inte hitta ID'
            }

    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});
// ladda upp en fil(bild) till en produkt
routes.post('/files/:id', upload.array('files'), async (req, res) => {
    const fileUpload = req.files;
    let accepted = true;
    for (let i = 0; i < fileUpload.length; i++) {
        const file = fileUpload[i];
        const exts = file.originalname.split('.');
        const fileEnd = exts[exts.length - 1];
        const product = req.params.id + '_' + i;
        // Vi uppdaterar products tabellen nedan V
        const imagenamn = "upload/" + product;
        await dbService.updateImage(imagenamn, req.params.id);
        const fileName = './upload/' + product + '.' + fileEnd;
        try {
            const fileWrite = await fs.rename(file.path, fileName);
            if (!fileWrite) {
                accepted = false;
            }
        } catch (error) {
            console.log(error);
            await fs.unlink(file.path)
            res.status(400).json(error);
        }
    }
    if (!accepted) {
        res.json({
            "Status": " added"
        });
    } else {
        res.json({
            "Status": " no"
        });
    }
});

// TESTAR EN GREJ //
/*
routes.get('/contributor', async (req,res) => {
    const validator = await dbService.loginContributor();
    validator.get('SELECT email FROM contributor where email = ?', [req.body.email]);
    if(req.body.email == validator.email ) {
        window.location.href="/contributor";
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
    }
});
*/

// ---------------------------------- Q&A Engine -----------------------------//


 // ------------------------------------------------- Questions --------------------------------------------------------------//

routes.get('/question', async (req, res) => {
    try {
        const question = await dbService.getQuestion();
        res.send(question);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

routes.put('/question/update/', async (req, res) => {
    try {

        let data = req.body;

            let result = await dbService.updateQuestion(data);

            if (result.changes == 1) {
                res.json({ Status: 'Uppdatering lyckades', Question: data });
            } else {
                res.json({ Error: 'FelaktigID', Gäller: data.qid }); // tog bort data: data.qid 'Kan inte hitta ID'
            }


    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});


routes.get('/question/:qid', async (req, res) => {

    try {
        const resultat = await dbService.getQuestion();
        finder = resultat.find((p) => {
            return p.qid == req.params.qid;
        });
        if (finder) {
            res.json(finder);
        }
        else {
            res.status(404).send(`Question with id: ${req.params.qid} not found`);
        }

    }

    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});


routes.delete('/question/delete/:qid', async (req, res) => { //Radera

    try {

        let qid = req.params.qid;
        let resultat = await dbService.deleteQuestion(qid);

        if (resultat.changes == 1) {
            res.json({ Successful: `ID: ${qid} är nu raderat från databasen` });
            console.log("Du Lyckades med att radera frågan med ID: " + qid);

        } else {
            res.json({ status: `Kunde inte hitta id med: ${qid}` });
            console.log("Kunde inte hitta id");
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

routes.post('/question', async (req, res) => {
    // Anropa databasen och lägg till data

    try {
        const resultat = await dbService.addQuestion(req.body);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
    console.log(req.body);
    res.json({ status: 'ok' })
});



// ----------------- TEstar en grej -------------------//
routes.get('/superadmin',(req,res) => {
    if(req.session.email) {
        res.write(`<h1>Hello ${req.body.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
    }
});


// ---------------------------------------------- ANSWERS ---------------------------------//

routes.put('/answer/update/', async (req, res) => {
    try {

        let data = req.body;

            let result = await dbService.addAnswer(data);

            if (result.changes == 1) {
                res.json({ Status: 'Ny tillagd svar', Answer: data });
            } else {
                res.json({ Error: 'FelaktigID', Gäller: data.qid }); // tog bort data: data.qid 'Kan inte hitta ID'
            }


    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});


routes.put('/answer/delete/', async (req, res) => {
    try {

        let data = req.body;

            let result = await dbService.deleteAnswer(data);

            if (result.changes == 1) {
                res.json({ Status: 'Ny tillagd svar', Answer: data });
            } else {
                res.json({ Error: 'FelaktigID', Gäller: data.qid }); // tog bort data: data.qid 'Kan inte hitta ID'
            }


    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

routes.put('/block', async (req, res) => {
    try {

        let data = req.body;

            let result = await dbService.blockUser(data);

            if (result.changes == 1) {
                res.json({ Status: 'Hen är blockerad', Answer: data });
            } else {
                res.json({ Error: 'FelaktigID', Gäller: data.id }); // tog bort data: data.qid 'Kan inte hitta ID'
            }


    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});

routes.put('/unblock', async (req, res) => {
    try {

        let data = req.body;

            let result = await dbService.unblockUser(data);

            if (result.changes == 1) {
                res.json({ Status: 'Hen är inte längre blockerad', Answer: data });
            } else {
                res.json({ Error: 'FelaktigID', Gäller: data.id }); // tog bort data: data.qid 'Kan inte hitta ID'
            }


    } catch (error) {
        console.log(error);
        res.status(404).json({ status: 'Det har blivit något fel, error står i konsolen.' });
    }
});





module.exports = routes;


