import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {User} from '../types/apiTypes';

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<User[]>('http://localhost:5000/users');
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
