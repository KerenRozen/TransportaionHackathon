import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import pathData from './mocks/ExamplePath.json';
import roadBlocksData from './mocks/ExampleBlocks.json';
const App = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/user/:lineNumber" element={<UserPage paths={pathData[`116`]} roadblocks={roadBlocksData}/>}/>
            </Routes>
        </Router>
    );
};

export default App;
