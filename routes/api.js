const express = require('express');
const { Register, Myprofile, Login } = require('../controllers/api/user');
const middleware = require('../middleware/middleware');

const router = express.Router();


router.post('/register', Register )
router.post('/login', Login )
router.get('/myprofile',middleware, Myprofile )


module.exports = router;