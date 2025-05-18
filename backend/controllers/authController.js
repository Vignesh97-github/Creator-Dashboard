import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    const generateAccessToken = async (email, password, name) => {
      try {
          const token = jwt.sign(
              {
                  email: email,
                  password: password,
                  name: name
              },
              process.env.JWT_ACCESS_SECRET_KEY,
              {
                  expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
              }
          )
          return token
      } catch (error) {
          return null
      }
  }
  const generateRefreshToken = async (email, password, name) => {
      try {
          const token = jwt.sign(
              {
                  email: email,
                  password: password,
                  name: name
              },
              process.env.JWT_REFRESH_SECRET_KEY,
              {
                  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
              }
          )
          return token
      } catch (error) {
          return null
      }
  }
  const verifyToken = async (req,res,next) => {
      const token = req.headers.authorization.split(' ')[1]
      if(!token)
          res.status(401)
              .json({
                  success:false,
                  message:'Unauthorized'
              })
      const decoded = jwt.verify('token',process.env.JWT_ACCESS_SECRET_KEY)
      req.user = decoded
      next()
  }
    // Generate token
    // const token = jwt.sign(
    //   { id: user._id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '7d' }
    // );

    res.status(201).json({
      token:token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};