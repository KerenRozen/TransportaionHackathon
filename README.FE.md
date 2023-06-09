# README

## Setting Up a Development Environment for React & TypeScript with MUI

This guide is aimed at complete beginners and will walk you through the steps required to set up a development environment for creating web applications using React and TypeScript with Material-UI (MUI).

### Prerequisites:

You need a computer with an operating system (OS) like Windows or MacOS. 

### Tools you'll need:

1. Node.js: This is a JavaScript runtime that allows you to run JavaScript on your computer.
2. NPM: This is a package manager for JavaScript, and it comes bundled with Node.js.
3. Visual Studio Code: This is a text editor that you'll use to write your code. It's free and highly recommended for beginners.

Let's begin:

### Step 1: Install Node.js and NPM

#### On Windows:

1. Visit the official Node.js website at https://nodejs.org/en/.
2. Download the LTS (Long Term Support) version. This version is recommended for most users.
3. Run the installer and follow the instructions. This will also install NPM for you.

#### On MacOS:

1. You can install Node.js and NPM using Homebrew, a package manager for MacOS.
2. Open Terminal (you can find it using Spotlight search).
3. Check if you have Homebrew installed by typing `brew` in the Terminal and hitting enter. If Homebrew is not installed, you can install it by pasting the following command and hitting enter:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

4. Install Node.js by typing the following command and hitting enter:

```bash
brew install node
```

### Step 2: Install Visual Studio Code

#### On Windows and MacOS:

1. Visit the official Visual Studio Code website at https://code.visualstudio.com/.
2. Download the version appropriate for your OS.
3. Run the installer and follow the instructions.

### Step 3: Create a New React & TypeScript Project

1. Open Terminal on MacOS or Command Prompt on Windows.
2. Navigate to the directory where you want to create your new project using the `cd` command. For example, `cd Documents`.
3. Run the following command to create a new React project with TypeScript:

```bash
npx create-react-app my-app --template typescript
```

Replace `my-app` with the name you want for your project.

This command might take a few minutes as it downloads and installs the necessary packages.

### Step 4: Install MUI in Your Project

1. Navigate to your project directory using the `cd` command. For example, `cd my-app`.
2. Install MUI by running the following command:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

### Step 5: Start Your Project

1. Still in your project directory, start your project by running the following command:

```bash
npm start
```

2. Your project will start, and you can view it in your web browser at http://localhost:3000/.

That's it! You have set up a development environment for creating web applications using React, TypeScript, and MUI.

Remember to always save your work in Visual Studio Code before refreshing your browser to see the changes. Happy coding!

## Creating a Basic Two-Page Application with MUI and React Router v6

In the following steps, we'll create a simple application with a navigation bar and two pages using MUI and React Router v6. If your app is running stop it (ctrl + c on the terminal)

### Step 1: Install React Router v6

In your project directory, install React Router by running the following command:

```bash
npm install react-router-dom
```

### Step 2: Create Page Components

We'll start by creating two simple pages. In your `src` folder, create a new folder named `pages`. Inside this folder, create two files: `HomePage.tsx` and `AboutPage.tsx` (it is important the files will start in capital letter).

In `HomePage.tsx`, paste the following code:

```jsx
import React from 'react';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};

export default HomePage;
```

In `AboutPage.tsx`, paste the following code:

```jsx
import React from 'react';

const AboutPage = () => {
  return (
    <div>
      <h1>About Us</h1>
    </div>
  );
};

export default AboutPage;
```

### Step 3: Create the Navigation Bar

We'll use MUI to create a navigation bar. In your `src` folder, create a new folder named `components`. Inside this folder, create a file named `Navbar.tsx`.

In `Navbar.tsx`, paste the following code:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/about">About</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
```

### Step 4: Set Up React Router

Now, we'll set up React Router. Open `src/App.tsx` and replace its content with the following:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
};

export default App;
```

### Step 5: Start Your Project

In your project directory, start your project by running the following command:

```bash
npm start
```

Your project will start, and you can view it in your web browser at http://localhost:3000/. You should see a navigation bar at the top with two links: Home and About. Clicking these links will take you to the respective pages.

And there you have it! You've successfully created a simple two-page application using React, TypeScript, MUI, and React Router v6. Continue to build upon this foundation to create more complex applications. Happy coding!

## Adding Route Parameters with React Router v6

In this section, we'll expand our app by adding route parameters. Route parameters are dynamic parts of the URL that can change. For example, in the URL "/users/123", "123" is a route parameter that could represent the ID of a user.

Let's create a `UserPage` that will display a user ID taken from the URL.

### Step 1: Create a User Page Component

In your `src/pages` folder, create a new file named `UserPage.tsx`. In `UserPage.tsx`, paste the following code:

```jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const UserPage = () => {
  let { id } = useParams();

  return (
    <div>
      <h1>User ID: {id}</h1>
    </div>
  );
};

export default UserPage;
```

In this file, we're using the `useParams` hook from `react-router-dom` to access the route parameters.

### Step 2: Update the Navigation Bar

We need to add a link to the `UserPage` in our navigation bar. Open `src/components/Navbar.tsx` and add a new `Button` component inside the `Toolbar` component:

```jsx
<Button color="inherit" component={Link} to="/user/1">User 1</Button>
```

The updated `Navbar` component should look like this:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/about">About</Button>
        <Button color="inherit" component={Link} to="/user/1">User 1</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
```

### Step 3: Add Route to App Component

We need to add a route for `UserPage` in our `App` component. Open `src/App.tsx` and add a new `Route` component inside the `Routes` component:

```jsx
<Route path="/user/:id" element={<UserPage />} />
```

The updated `App` component should look like this:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import UserPage from './pages/UserPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/user/:id" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
```

### Step 4: Start Your Project

In your project directory, start your project by running the following command:

```bash
npm start
```

Now, when you navigate to "/user/1" in your app, you'll see a page that displays "User ID: 1". You can replace "1" with any

## Making an API Call and Rendering the Results

In this section, we will expand our application by adding an API call to fetch data and render it on the page. We'll use the JSONPlaceholder API to fetch a list of users and display them in our app.

### Step 1: Install Axios

We'll use Axios, a popular JavaScript library for making HTTP requests, to fetch our data. In your project directory, install Axios by running the following command:

```bash
npm install axios
```

### Step 2: Create a Users Page

In your `src/pages` folder, create a new file named `UsersPage.tsx`. In `UsersPage.tsx`, paste the following code:


```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {users.map((user: any) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersPage;
```

This `UsersPage` component uses the `useState` and `useEffect` hooks from React. When the component mounts, `useEffect` calls the `fetchData` function, which fetches the data from the API and updates the `users` state.

The `fetchData` function is declared as an `async` function, which allows us to use the `await` keyword to pause the function execution until the Promise returned by `axios.get` is settled. We wrap the await call in a try/catch block to handle potential errors.

Finally, the component renders a list of users, displaying the name and email of each user.

### Step 3: Update Navigation Bar and Routes

We need to add a link to the `UsersPage` in our navigation bar and routes.

In `src/components/Navbar.tsx`, add the following button to the `Toolbar` component:

```jsx
<Button color="inherit" component={Link} to="/users">Users</Button>
```

In `src/App.tsx`, add the following route to the `Routes` component:

```jsx
<Route path="/users" element={<UsersPage />} />
```

### Step 4: Start Your Project

In your project directory, start your project by running the following command:

```bash
npm start
```

Now, when you navigate to "/users" in your app, you'll see a list of users fetched from the API.


## Adding Types to Our API Calls

The JSONPlaceholder API returns users in the following format:

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
```

Let's define TypeScript interfaces for this data.

### Step 1: Create a Types File

In your `src` directory, create a new directory named `types`. Inside the `types` directory, create a file named `apiTypes.ts`. 

In `apiTypes.ts`, paste the following code:

```typescript
export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}
```

### Step 2: Update the UsersPage Component

Now, let's update the `UsersPage` component to use these types. In `src/pages/UsersPage.tsx`, replace `any` with `User` from `apiTypes.ts`:

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types/apiTypes';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersPage;
```

Now, the `users` state and the `axios.get` function use the `User` interface, which provides type checking and autocompletion for the user data.

This is a great example of how TypeScript can improve the quality of your code by catching potential errors before they occur.