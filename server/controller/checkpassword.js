const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs")
const Jwt = require("jsonwebtoken");

const checkPassword = async (req, res) => {
    try {
        const { password ,userid} = req.body;
        const user = await UserModel.findById( userid );
        const varifypass= await bcrypt.compare(password,user.password)
        if (!varifypass) {
            return res.status(400).json({
                message: "Wrong password ",
                error: true
            });
        }
        const tokenData={
            id:user._id,
            email:user.email
        }
        const token = Jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const cookieOption={
            http:true,
            secure:true
        }
        return res.cookie('token',token,cookieOption).status(200).json({
            message: "password verified",
            success: true,
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
};

module.exports = checkPassword;
