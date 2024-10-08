import React, { useState, useEffect } from 'react';
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';

const Avatar = ({ userId, name, imageUrl, width, height }) => {
    const onlineUser = useSelector(state => state?.user?.onlineuser);
  
    let avatarName = "";

    if (name) {
        const splitName = name.split(" ");
        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            avatarName = splitName[0][0]; 
        }
    }

    const bgColor = [
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-yellow-200',
        'bg-gray-200',
        "bg-cyan-200",
        "bg-sky-200",
        "bg-blue-200"
    ];

    const getRandomBgColor = () => bgColor[Math.floor(Math.random() * bgColor.length)];
    const [randomBgColor, setRandomBgColor] = useState(getRandomBgColor);

    const isOnline = onlineUser.includes(userId);

    useEffect(() => {
        setRandomBgColor(getRandomBgColor());
    }, []); // Only run once

    return (
        <div 
            className={`text-slate-800 rounded-full shadow font-bold relative`} 
            style={{ width: width + "px", height: height + "px" }}
        >
            {
                imageUrl ? (
                    <img
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={name}
                        className='overflow-hidden rounded-full object-cover'
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    name ? (
                        <div 
                            style={{ width: width + "px", height: height + "px" }} 
                            className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${randomBgColor}`}
                        >
                            {avatarName} 
                        </div>
                    ) : (
                        <PiUserCircle size={width} />
                    )
                )
            }
            {
                isOnline && (
                    <div className="bg-green-500 p-1 absolute bottom-[1px] right-0 z-10 rounded-full border-white border-[2px]"></div>
                )
            }
        </div>
    );
}

export default Avatar;
