const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'ankitisagoodboy';

//ROUTE 1: create a User using: POST "/api/auth/createuser"
router.post('/createuser', [
    body('email','Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('password','password must be atleast of 5 characters').isLength({ min: 5 }),
  

], async (req, res) => {
    //if there are error return bad requests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        //check whether the user with this email exists already
    
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });
 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error ");
    }
    
})

 // ROUTE 2: authenticate a User using: POST "/api/auth/login"
router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
     //if there are error return bad requests
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });

        }

        const passwordCompare =await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
     
})

 // ROUTE 3: get loggedin User details using: POST "/api/auth/getuser"
 router.post('/getuser', fetchuser, async (req, res) => {
     try {
          userId = req.user.id;
         const user = await User.findById(userId).select("-password");
         res.send(user);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
 })

module.exports = router;