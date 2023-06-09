import React, {useState} from 'react';

const HomePage = () => {
    const [lineNumber,setLineNumber] = useState("");

    return (
        <div>
            <h1>Enter your bus number:</h1>
            <input name="lineNumber" placeholder={"LINE NUMBER"} onChange={(e) => setLineNumber(e.target.value)}/>
            <h1>{lineNumber}</h1>
        </div>
    );
};

export default HomePage;
