import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backgroundImage from '../assets/wallapaper.jpeg';
import { IoMdSend } from "react-icons/io";
import moment from 'moment/moment';

function MessagesPage() {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  });

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage(prev => ({
      ...prev,
      imageUrl: uploadPhoto.url
    }));
  };

  const handleClearUploadImage = () => {
    setMessage(prev => ({
      ...prev,
      imageUrl: ""
    }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage(prev => ({
      ...prev,
      videoUrl: uploadPhoto.url
    }));
  };

  const handleClearUploadVideo = () => {
    setMessage(prev => ({
      ...prev,
      videoUrl: ""
    }));
  };

  useEffect(() => {
    if (socketConnection && params.userid) {
      socketConnection.emit('message-page', params.userid);
      socketConnection.emit('seen', params.userid);
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params.userid, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage(prev => ({
      ...prev,
      text: value
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userid,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        });
      }
    }
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover h-screen flex flex-col'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='-my-2 text-sm'>
              {dataUser.online ? <span className='text-[#47cf1e]'>online</span> : <span className='text-slate-400'>offline</span>}
            </p>
          </div>
        </div>
        <div>
          <button className='cursor-pointer hover:text-[#5b81a2]'>
            <HiDotsVertical />
          </button>
        </div>
      </header>
      <section className='flex-grow overflow-y-auto overflow-x-hidden scrollbar relative bg-slate-200 bg-opacity-50 flex flex-col-reverse px-2 py-2'>
        <div ref={currentMessage} className='flex flex-col gap-2'>
          {allMessage.map((msg) => (
            <React.Fragment key={msg._id}>
            {msg.showDateLabel && (
              <div className='text-center text-xs text-gray-500'>
                {moment(msg.createdAt).format('MMMM D, YYYY')}
              </div>
            )}
            <div className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
              <div className='w-full relative'>
                {msg?.imageUrl && (
                  <img
                    src={msg?.imageUrl}
                    className='w-full h-full object-scale-down'
                  />
                )}
                {msg?.videoUrl && (
                  <video
                    src={msg?.videoUrl}
                    className='w-full h-full object-scale-down'
                    controls
                    onError={(e) => console.error('Video playback error:', e)}
                  />
                )}
              </div>
              {msg?.text && <p className='px-2'>{msg.text}</p>}
              {msg?.text && <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>}
            </div>
          </React.Fragment>
          ))}
        </div>
        {loading && (
          <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
            <Loading />
          </div>
        )}
        {message.imageUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <img
                src={message.imageUrl}
                alt='uploadImage'
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
              />
            </div>
          </div>
        )}
        {message.videoUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <video
                src={message.videoUrl}
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                controls
                muted
                autoPlay
                onError={(e) => console.error('Video playback error:', e)}
              />
            </div>
          </div>
        )}
      </section>
      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative'>
          <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-[#5b81a2] hover:text-white'>
            <FaPlus size={20} />
          </button>
          {openImageVideoUpload && (
            <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
              <form>
                <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                  <div className='text-[#5b81a2]'>
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                  <div className='text-purple-500'>
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type='file'
                  id='uploadImage'
                  onChange={handleUploadImage}
                  className='hidden'
                />
                <input
                  type='file'
                  id='uploadVideo'
                  onChange={handleUploadVideo}
                  className='hidden'
                />
              </form>
            </div>
          )}
        </div>
        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type here message...'
            className='py-1 px-4 outline-none w-full h-full'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='text-[#5b81a2] hover:text-[#517491]'>
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
}

export default MessagesPage;
