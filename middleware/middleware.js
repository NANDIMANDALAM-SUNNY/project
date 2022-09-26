const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try {
        const token = req.header('x-token');
        if(!token) return res.status(401).send('Access denied. No token provided.');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}