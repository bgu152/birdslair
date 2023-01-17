# Birdnest
This is a solution to an [assignment](https://assignments.reaktor.com/birdnest/?_gl=1*pr88w8*_ga*MTExMDQ1MDgwNC4xNjczNTk1MjQ3*_ga_DX023XT0SX*MTY3Mzk0MzEyNS45LjEuMTY3Mzk0MzkwNi41Ny4wLjA) which is a part of an application for a summer trainee position at [Reaktor](https://www.reaktor.com/).

## Technology stack
- React
- Node.js
- MariaDB

## Hosting
The frontend, backend and database are all hosted on an Amazon Lightsail server running Ubuntu. NGINX is used as the webserver.

## Project Setup
### Database
- Create relational database without tables. Must be [supported by Prisma](https://www.prisma.io/docs/reference/database-reference/supported-databases)

### Backend
- Clone the project and run the command **yarn** (or npm) in the root of the server folder
- Create a **.env** file with a variable **DATABASE_URL** whose value is the [connection url](https://www.prisma.io/docs/reference/database-reference/connection-urls) to your database.
- Add a variable **TIME_LIMIT** to the **.env** file. This represents the duration pilot data is stored in seconds
- Run the following command to instantiate tables in the database:
**npx prisma migrate dev --name init**
- Start the server with **yarn dev**

### Frontend
- Run the command **yarn** in the root of the **birds-frontend** folder
- Create a **.env** file with a variable with the url of the backend called **REACT_APP_BACKEND_URL**
- Start frontend with **yarn start**
