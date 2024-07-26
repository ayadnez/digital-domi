// const express = require('express');
// const router = express.Router();

// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const User = require('./models/user.model')

// // user Registration route 

// router.post('/register', async(req,res) => {
//     const {userName,password} = req.body;

//     try {
//         // check if user already exits
//         const existingUser = await User.findOne({userName});
//         if (existingUser) {
//             return res.status(400).json({'message':"user already exits"});
//         }
    
//     // hash the password 
//     const hashedPassword = await bcrypt.hash(password,10)
    
 
//     // create a new user 

//     const newUser = new User({userName,password:hashedPassword});
//     await newUser.save();

//     res.status(201).json({message : "User registration successfull"})
//     } catch(error) {
//         res.status(500).json({message :"Error while registering user "})
//     }

// })

// // user login route 

// router.post('/login',async(req, res) => {
//     const {userName,password} = req.body 

//     try {
//         // finding user by username 
//         const user = await User.findOne({userName});
//         if(!user) {
//           res.status(404).json({message : "user not found"});
//         }

//         // check if password is correct 

//         const passwordMatch = await bcrypt.compare(password,user.password);

//         if(!passwordMatch) {
//             res.status(401).json({message : "invalid credentials"})
//         }

//         // Generate a JWT Token 
//         const token = jwt.sign({userName:userName},'secretkey',{expiresIn:'1h'});

//         res.status(200).json({token})

//     } catch(error) {
//         res.status(500).json({message : "error logging in "})
//     }
// })

// module.exports = router;