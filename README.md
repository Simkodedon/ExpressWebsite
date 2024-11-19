HOW TO RUN THE SERVER:

1. Install nodeJS to your powershell on your PC. This will able you to run nodeJS commands on your powershell terminal.
2. Navigate to project file(SGIndustriesFinal)
3. Run command : npm run server

HOW TO ACCESS THE SERVER:

1. Open a browser ( preferably Mozilla or Chrome=
2. Type in URL: http://127.0.0.1:3500/

   P.S Remember that you can always change the last 4 digits( the port). This can be done under server.js file in the project folder.
type

WHAT IS IT?

A website meant to demonstrate the ability to run CRUD operations using a simple interface(for example bootstraps modals)
from frontend layer to eventually affect or retrieve data from the backend layer.
The application makes use of node.js express framework and their middleware called multer, both enbable integration between frontend and backend in the code.

For example, try adding products to the products database by accessing the admin.html page from the dropdown menu.
The products you are seeing is actually information coming directly from the SQL database. The method used for this is found under routes.js file and is a asynchronous get method.
This operation is called a Read operation.
The information you provide when adding a product here will be stored directly in the servers local sql database. 
The post function with route(/product) in the routes.js file enables this using an asynchronous method.
This is a typical "Create" operation.
Clicking on products ID on this page, enables you to edit a product. This is a typical Update operation. 
You can also delete the product from here. Which is a Delete operation.

You can explore other functions in the website such as the Shopping cart, Q&A and Login.
This server also stores users, and users have different roles. The priveliges for the roles dictate what the user is allowed to do on the website.
You can find all of this in the code.
These are the credentials for logging in as all the roles:

Superadmin: 
username: superadmin@test.se
password: superadminpassword

Contributor:
username: contributor@test.se
password: contributorpassword

Consumer:
username: consumer@test.se
password: consumerpassword


