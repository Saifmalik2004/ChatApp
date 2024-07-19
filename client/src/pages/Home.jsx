import axios from 'axios';
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import conf from '../conf/conf';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser,setOnlineUser, setsocketConnection } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import logo from "../assets/Screenshot 2024-07-14 104856.png"
import io from "socket.io-client"
function Home() {
  const user = useSelector(state=> state.user)
  const dispatch = useDispatch()
  const navigate= useNavigate()
  const location= useLocation()


  
    const URL = `${conf.backendUrl}/api/user-details`;

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(URL, { withCredentials: true });
            
            dispatch(setUser(response.data.data))
            
            if (response.data.data.logout){
              dispatch(logout())
              navigate("/email")
            }


            
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

    // sockect connection
    useEffect(() => {
       const socketConnection = io(conf.backendUrl,{
        auth:{
            token:localStorage.getItem('token')
        }
       })

       socketConnection.on('onlineUser',(data)=>{
        
        dispatch(setOnlineUser(data))
       })

       dispatch(setsocketConnection(socketConnection))
       return()=>{
        socketConnection.disconnect()
       }
    }, []);


    
    const basePath=location.pathname==='/'

    return (
        <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
           <section className={`bg-white ${!basePath && "hidden"} lg:block`} >
            <SideBar/>
           </section >
           {/* {messgae component} */}
            <section className={`${basePath && 'hidden'}`}>
                <Outlet />
            </section>
            <div className={` justify-center items-center flex-col gap-2  hidden ${!basePath ? "hidden" : "lg:flex" }`}>
            <div >
              <img
                src={logo}
                width={250}
                alt='logo'
               
              />
            </div>
            <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
        </div>
            
        </div>
    );
}

export default Home;
