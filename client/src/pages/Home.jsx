import axios from 'axios';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import conf from '../conf/conf';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../redux/userSlice';
import SideBar from '../components/SideBar';

function Home() {
  const user = useSelector(state=> state.user)
  const dispatch = useDispatch()
  const navigate= useNavigate()


  console.log("user:",user)
    const URL = `${conf.backendUrl}/api/user-details`;

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(URL, { withCredentials: true });
            
            dispatch(setUser(response.data.data))
            
            if (response.data.logout){
              dispatch(logout())
              navigate("/email")
            }


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
        <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
           <section className='bg-white' >
            <SideBar/>
           </section>
           {/* {messgae component} */}
            <section>
                <Outlet />
            </section>
        </div>
    );
}

export default Home;
