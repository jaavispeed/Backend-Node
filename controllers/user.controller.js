import { UserModel } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { token } from "../utils/jwt.utils.js";

// api/v1/users/register
const register = async(req, res) => {
    try {
        const {email, password, username} = req.body;

        // Check if all fields are filled
        if(!email || !password || !username) {
            return res.status(400).json({
                ok: false,
                message: 'All fields are required'
            });
        }

        // Check if user exists
        const user = await UserModel.findeOneByEmail(email);
        if(user) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario ya existe'
            });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = await UserModel.create({email, password: hashedPassword, username});

        // Generate token
        const userToken = token(newUser.email, newUser.username);

        return res.status(201).json({
            ok: true,
            msg: userToken  
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Server error'
        });
    }
}

// api/v1/users/login
const login = async(req, res) => {
    try {
        // Check if all fields are filled
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                ok: false,
                message: 'All fields are required'
            });
        }
        // Check if user exists
        const user = await UserModel.findeOneByEmail(email);
        if(!user) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario no existe'
            });
        }
        // Check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if(!validPassword) {
            return res.status(401).json({
                ok: false,
                message: 'Contraseña incorrecta'
            });
        }

        // Generate token
        const userToken = token(user.email, user.username);

        return res.status(200).json({
            ok: true,
            msg: userToken
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Server error'
        });
    }
}

export const UserController = {
    register,
    login
};