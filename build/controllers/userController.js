"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const userName = email.split('@')[0];
        const user = new User_1.default({ email, password: hashedPassword, userName });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token);
        res.status(201).json({ message: 'user registered' });
    }
    catch (error) {
        res.status(500).json({ message: 'failed to register user', error });
    }
};
exports.createUser = createUser;
const login = async (req, res) => {
    try {
        console.log("hitting server");
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credent' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const cookieParams = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: '/', // Adjust as needed
        };
        res.cookie('token', token, cookieParams);
        const { password: _, ...userObject } = user.toObject();
        res.status(200).json({ message: 'access granted', user: userObject, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
