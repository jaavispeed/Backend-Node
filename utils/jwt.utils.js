import jwt from 'jsonwebtoken';


const token = (email, username) => {
    return jwt.sign(
        { email, username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export {token};