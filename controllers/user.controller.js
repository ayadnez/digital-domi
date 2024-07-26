const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const fs = require('fs');

const register = async (req, res) => {
  const { userName, password } = req.body;
  console.log("Incoming request:", req.body); // Log incoming request body for debugging
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      userName,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registration successful" });
  } catch (error) {
    console.error("Error while registering user:", error);
    res.status(500).json({ message: "Error while registering user" });
  }
};



const login = async (req, res) => {

  const {userName,password} = req.body;

  try {
   // find the user by username
    const user = await User.findOne({userName}) 
    if (!user){
      res.status(404).json({message:"user not found"});
    }
 // check if the password is correct 
    const passwordMatch = await bcrypt.compare(password,user.password);

    if(!passwordMatch) {
      res.status(401).json({message : "invalid credentials"})
    }
    // generate a jwt token 

    const payload = {
      id : user._id
    }
    const token = jwt.sign(payload,process.env.SECRETKEY,{
      expiresIn : "6h",
    });

    res.status(200).json({token})
  }catch(error){
    res.status(500).json({message:"error while logging in"})
  }
}



// Initialize gfs
let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

const upload = async (req, res) => {
  console.log('Received upload request');

  console.log('Received upload request');

  if (!req.file) {
    console.error('No file provided');
    return res.status(400).json({ message: 'No file provided' });
  }

  console.log('File received:', req.file);

  try {
    // Create a write stream to GridFS
    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

    console.log('Upload stream created for file:', req.file.originalname);

    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(uploadStream);

    // Ensure the callback for 'finish' is async
    uploadStream.on('finish', async () => {
      console.log('Upload stream finished for file:', req.file.originalname);

      try {
        // Query GridFS for file metadata
        const fileMetadata = await gfs.find({ filename: req.file.originalname }).toArray();
        const fileInfo = fileMetadata[0];

        // Delete the temporary file
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Error deleting temporary file:', err);
            return res.status(500).json({ message: 'Error deleting temporary file', error: err });
          }

          console.log('Temporary file deleted:', req.file.path);
          return res.json({ file: fileInfo });
        });
      } catch (err) {
        console.error('Error retrieving file metadata:', err);
        return res.status(500).json({ message: 'Error retrieving file metadata', error: err });
      }
    });

    uploadStream.on('error', (err) => {
      console.error('Error while uploading to GridFS:', err);
      return res.status(500).json({ message: 'Error uploading file', error: err });
    });

  } catch (err) {
    console.error('Error in upload controller:', err);
    return res.status(500).json({ message: 'Error uploading file', error: err });
  }
};



module.exports = {
  register,
  login,
  upload,
};
