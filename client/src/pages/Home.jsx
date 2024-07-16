import axios from 'axios';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import conf from '../conf/conf';

function Home() {
    const URL = `${conf.backendUrl}/api/user-details`;

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(URL, { withCredentials: true });
            console.log('Response user data:', response.data);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Server Error:', error.response.data);
                console.error('Status Code:', error.response.status);
                console.error('Response Data:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Request Error:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error:', error.message);
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <div>
            Home
            <section>
                <Outlet />
            </section>
        </div>
    );
}

export default Home;
