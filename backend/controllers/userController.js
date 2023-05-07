const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

// @desc    Register User
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    // Check all fields
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all fields")
    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // Hashed Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})


// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    console.log(user)
    console.log(user.id)

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid Credentials")
    }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email
    })


})

// Generate Token
const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })

    return token
}

module.exports = { registerUser, loginUser, getMe }