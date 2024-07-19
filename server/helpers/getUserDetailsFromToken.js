const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "session out",
            logout: true,
        };
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decode || !decode.id) {
            return {
                message: "Invalid token",
                logout: true,
            };
        }

        const user = await UserModel.findById(decode.id).select('-password');
        if (!user) {
            return {
                message: "User not found",
                logout: true,
            };
        }

        return user;
    } catch (error) {
        console.error("Error in getUserDetailsFromToken:", error);
        return {
            message: "Invalid token",
            logout: true,
        };
    }
};

module.exports = getUserDetailsFromToken;
