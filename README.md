# TalkSpace

A dynamic and responsive forum application built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform enables users to create posts, comment, and engage in discussions seamlessly.

## Features

- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
- **CRUD Operations**: Users can Create, Read, Update, and Delete their own posts.
- **Interactive Discussions**: Comment on posts to foster community engagement.
- **Voting System**: Upvote and downvote posts and comments.
- **User Profiles**: View user profiles and their activity.
- **Responsive Design**: A clean and accessible UI that works on all devices.

## Tech Stack

- **Frontend**: React, Redux Toolkit, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & bcrypt.js

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1.  **Clone the repository**

```sh
git clone https://github.com/your-username/React_forum.git
cd React_forum
```

2.  **Install Backend Dependencies**

```sh
cd server
npm install
```

3.  **Install Frontend Dependencies**

```sh
cd ../client
npm install
```

4.  **Set up Environment Variables**

- In the `server` directory, create a `.env` file.
- Add the following environment variables:

  ```env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```

### Running the Application

1.  **Start the Backend Server**

- From the `server` directory:

```sh
npm start
```

2.  **Start the Frontend Development Server**

- From the `client` directory:

```sh
npm start
```

The application will be available at `http://localhost:3000`.
