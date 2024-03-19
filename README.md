# UserTodoManagement

This repository contains a set of RESTful APIs designed for managing users and to-do items, as well as for user authorization. These APIs are built using Node.js, Express.js, and MongoDB.

## Code Overview
The codebase starts from server.js, where an Express application (app) is created. It consists of three main routes:
#### Auth Routes
- /login: Verifies the user's credentials and generates a token if the user is authenticated.
- /register: Checks if the user is not already present, then adds the user to the database after hashing the password.

#### User Routes
- /create user: Checks if the user is present and adds the user to the database.
- /get user: Retrieves all users from the database.
- /get single user: Retrieves a single user whose ID matches.
- /update user: Finds the user with the given ID and updates it.
- /delete user: Finds the user and deletes it.

#### Todo Routes
- /create todo: Adds the todo to the database.
- /get todo: Retrieves todos based on filter criteria, pagination, and page from the client and returns data from the database accordingly.
- /get single todo: Retrieves a single todo whose ID matches.
- /update todo: Finds the todo with the given ID and updates it.
- /delete todo: Finds the todo and deletes it. 

There are three test files with a total of 13 test cases. These tests are executed every time the code is pushed through the GitHub Actions pipeline. Some of the test cases include:
#### User API tests
-    √ should create a new user
-    √ should get all users                                                    
-    √ should get a single user                                                
-    √ should update a user                                                 
-    √ should delete a user                                                  
#### Auth API tests                                                                           
-    √ should register a new user                                            
-    √ should log in an existing user                                         
-    √ should not log in with invalid credentials                             
#### Todo List API tests                                                                 
-    √ should create a new todo                                                
-    √ should get filter and pagination todos                                                 
-    √ should get a single todo                                        
-    √ should update a todo                                                
-    √ should delete a todo 

  

## Features

- CRUD operations for managing users (Create, Read, Update, Delete).
- CRUD operations for managing to-do items.
- User authorisation, password hashing and JWT tokens generation.
- Pagination and filtering options for fetching to-do items.
- Automated Testing using Jest framework 
- Swagger docs integration for easier API interaction. Swagger UI can be accessed at [http://localhost:8000/api-docs](http://localhost:8000/api-docs)
- Dockerization of the code for easy deployment. Docker image available at  [Docker](https://hub.docker.com/repository/docker/mkmukulkumar/user-todo-management-api/general)
- Implementation of CI/CD pipeline using Github Actions
  
To quickly test the APIs, you can run the Docker image available  [mkmukulkumar/user-todo-management-api](https://hub.docker.com/repository/docker/mkmukulkumar/user-todo-management-api/general) using the following command:

Use command:
```bash
docker container run --env MONGO_URL=<your_Mongo_URL> --env PORT=8000 --env JWT_SECRET=<JWTsecret> -p 8000:8000 mkmukulkumar/user-todo-management-api
```

## Running locally
1. Clone the repository:

   ```bash
   git clone https://github.com/mkmukulkumar/UserTodoManagement.git   
   ```
2. Navigate to the project directory:
   ```bash
   cd UserTodoManagement
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   
## Configuration
1. Create a .env file in the root directory of the project.
2. Add the following environment variables to the .env file:
  ```bash
  MONGO_URL=<your_mongodb_url>
  PORT=8000
  JWT_SECRET=<your_jwt_secret>
  ```
Replace <your_mongodb_url> with your MongoDB connection URL and <your_jwt_secret> with a secret key for JWT token generation.

## Run the Application
  ```bash
   npm start
  ```
The server will start running on port 8000 by default. You can access the API at http://localhost:8000/api.

## API Documentation
The API documentation is available in the Swagger UI format. Once the server is running, you can access the API documentation at http://localhost:8000/api-docs.

https://github.com/mkmukulkumar/UserTodoManagement/assets/61122533/b4790471-a0fc-4e03-afb8-e7dced447772



