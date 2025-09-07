import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../model/model.js';

export async function protectedAPI(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export async function getAllUsers(req, res) {
  try {
    const allUsers = await users.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

export async function addUser(req, res) {
  try {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    
    const checkIfUserExist = users.find({ email });
    if (checkIfUserExist) return res.status(400).json({ message: 'User already exists' });

    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
    
    const newUser = new users({ email, password: hashPassword });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email })
    if (!user) return res.status(401).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

     // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(406).json({message: 'password mismatch', error: error.message})
  }
};

export async function userDashboard(req, res) {
  try {
    res.status(200).json({
      message: `Welcome to your dashboard, ${req.user.email || 'user'}!`,
      user: req.user
    })
  } catch (error) {
    res.status(400).json({message: 'Please login before accessing your dashboard', error: error.message})
  }
};
