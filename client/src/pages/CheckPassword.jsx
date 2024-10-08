import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import conf from '../conf/conf';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

const CheckPassword = () => {
  const [data, setData] = useState({
    password: "",
    userId: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch= useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
    } else {
      // Set userId in data state
      setData(prevData => ({
        ...prevData,
        userId: location?.state?._id
      }));
    }
  }, [location, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${conf.backendUrl}/api/password`;
    console.log('Submitting data:', data);

    try {
      const response = await axios.post(URL, data, { withCredentials: true });
      console.log('Response:', response.data);

      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token',response?.data?.token)

        setData({
          password: "",
          userId: location?.state?._id // Keep userId intact
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error response:', error.response);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
};


  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className='font-semibold text-lg mt-1'>{location?.state?.name}</h2>
        </div>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            className='bg-[#5b81a2] text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
          >
            Login
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default CheckPassword;
