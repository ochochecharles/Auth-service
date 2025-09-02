import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../model/model.js';

export async function getAllUsers(req, res) {

  try {
    const allUsers = await users.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
}

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
}

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
}