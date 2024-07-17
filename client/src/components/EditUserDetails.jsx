import React, { useState, useEffect ,useRef} from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
import conf from '../conf/conf'

function EditUserDetails({ onclose, userdata }) {
    const [data, setData] = useState({
        
        name: userdata?.user,
        profile_pic: userdata?.profile_pic


    })
    const uploadPhotoRef = useRef()
    const dispatch=useDispatch();

    useEffect(() => {
        setData((prev) => {
            return {
                ...prev,
                ...userdata
            }
        })
    }, [userdata])


    const handelChange = (e) => {
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const handleOpenUploadPhoto = (e)=>{
        e.preventDefault()
        e.stopPropagation()

        uploadPhotoRef.current.click()
    }
    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];

        const uploadedPhoto = await uploadFile(file);




        setData((prev) => ({
            ...prev,
            profile_pic: uploadedPhoto?.url,
        }));
    };
    const handelSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const URL = `${conf.backendUrl}/api/update-user`

    try {
        const response = await axios.post(URL,data,{ withCredentials: true })
        

        toast.success(response?.data?.message)

        if(response.data.success){
            dispatch(setUser(response.data.data))
            onclose()

        }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }


    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-50 flex justify-center items-center '>
            <div className='bg-white p-4 py-6 rounded w-full max-w-sm'>
                <h2 className='font-semibold'>Profile Details</h2>
                <p className='text-sm'>Edit user details</p>

                <form action="" className='grid gap-3 mt-3' onSubmit={handelSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handelChange}
                            className='w-full py-1 px-2 focus:outline-[#5b81a2] border'

                        />
                    </div>
                    <div>
                        <div>Photo:</div>
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar
                                width={40}
                                height={40}
                                imageUrl={data?.profile_pic}
                                name={data?.name} />
                            <label htmlFor="profile_pic">
                                <button onClick={handleOpenUploadPhoto} className='font-semibold'> Change Photo</button>
                                <input
                                    type="file"
                                    className='hidden'
                                    id='profile_pic'
                                    onChange={handleUploadPhoto}
                                    ref={uploadPhotoRef} />
                            </label>
                        </div>

                    </div>
                    <Divider />
                    <div onClick={onclose} className="flex gap-2 w-fit ml-auto">
                        <button className='border-[#5b81a2] text-[#5b81a2] border px-4 py-1 rounded hover:bg-[#5b81a2] hover:text-white'>Cancel</button>
                        <button onClick={handelSubmit} className='border-[#5b81a2] text-white bg-[#5b81a2] border px-4 py-1 rounded hover:bg-[#517491]'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default React.memo(EditUserDetails)