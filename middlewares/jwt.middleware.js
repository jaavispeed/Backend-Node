import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    let token = req.headers.authorization; 

    if(!token) {
        return res.status(401).json({
            ok: false,
            message: 'Token is required'
        });
    }
    token = token.split(' ')[1];

    try{
        const {email}= jwt.verify(token, process.env.JWT_SECRET);
        req.email = email;

        next()
    }catch(error) {
        console.error(error);
        return res.status(400).json({
            ok: false,
            message: 'Invalid token'
        });
    }


};