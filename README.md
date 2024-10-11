# Nodejs practice-one

This is a simple Yu-Gi-Oh! Card Management API built using Node.js, Sequelize (for ORM), and SQLite3 (for the database). This API allows you to manage a collection of Yu-Gi-Oh! cards, providing functionality to create, read, update, and delete (CRUD operations) cards in the database.

# Features

```shell
- User authentication with JSON Web Tokens (JWT).
- User registration and login functionality.
- Manage Yu-Gi-Oh! cards using a RESTful API.
- Perform CRUD operations (Create, Read, Update, Delete) on cards.
- Store card information in an SQLite3 database using Sequelize ORM.
- Simple and easy-to-use interface for managing card details.
```

# Tech Stack

```shell
- Node.js: JavaScript runtime for building the API.
- Express: Web framework for handling HTTP requests.
- Sequelize: ORM for interacting with the SQLite3 database.
- SQLite3: Lightweight SQL database used for storing card and user data.
- JWT: JSON Web Token for user authentication.
- bcrypt: For securely hashing passwords.
```

# Project Setup

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (with npm)
- SQLite3 (Optional, Sequelize handles this internally)

1. Clone the Repository

```shell
git clone git@github.com:toannguyenhuu-agilityio/nodejs-practice-one.git
cd practice-one
```

2. Install Dependencies

```shell
npm install
```

3. Start the Server

```shell
npm start
```

The API will start on http://localhost:3000 by default.

4. Running Tests
   To run the tests for the API, you can use the following command:

```shell
npm test
```

The project uses Jest for unit and integration testing.

# License

This project is open-source and available under the MIT License.

# Acknowledgments

```shell
[Yu-Gi-Oh!](https://www.yugioh.com/)
[Sequelize ORM](https://sequelize.org/)
[SQLite3](https://www.sqlite.org/docs.html)
[JWT (jsonwebtoken)](https://jwt.io/)
[bcrypt](https://www.npmjs.com/package/bcrypt)
```
