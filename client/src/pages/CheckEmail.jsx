import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import conf from '../conf/conf';
import toast from 'react-hot-toast';
import axios from 'axios';
import {PiUserCircle} from "react-icons/pi"

const CheckEmail = () => {
  const [data, setData] = useState({
    
    email: '',
    
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${conf.backendUrl}/api/email`

    try {
        const response = await axios.post(URL,data)
        console.log("response",response)

       toast.success(response.data.message)

        if(response.data.success){
            setData({
              
              email : "",
             
            })

             navigate('/password',{
              state:response?.data?.data
             });

        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }

    
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
      <div className='w-fit mx-auto mb-2'>
                <PiUserCircle
                  size={80}
                />
            </div>
        <h3>Welcome to Giggle Chat</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-[#5b81a2]"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>


          <button className="bg-[#5b81a2] text-lg px-4 py-1 hover:bg-[#3a576f] rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Let's GO
          </button>
        </form>

        <p className="my-3 text-center">
          don't have an account ?<Link to="/register" className="hover:text-[#5b81a2] font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
