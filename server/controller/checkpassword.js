const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");

const checkPassword = async (req, res) => {
    try {
        const { password, userId } = req.body; // Ensure userId is correctly named and received
        console.log('Received request:', { password, userId });

        if (!userId || !password) {
            return res.status(400).json({
                message: "User ID and password are required",
                error: true
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true
            });
        }

        const verifyPass = await bcrypt.compare(password, user.password);
        if (!verifyPass) {
            return res.status(400).json({
                message: "Wrong password",
                error: true
            });
        }

        const tokenData = {
            id: user._id,
            email: user.email
        };
        const token = Jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        const cookieOption = {
            httpOnly: true,
            secure: true
        };

        return res.cookie('token', token, cookieOption).status(200).json({
            message: "Login successfully",
            success: true,
            token: token
        });
    } catch (error) {
        console.error('Server error:', error); // Log server error for debugging
        return res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
};

module.exports = checkPassword;
