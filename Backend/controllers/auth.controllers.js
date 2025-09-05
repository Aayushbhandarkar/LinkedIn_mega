import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    // ✅ Check if email exists
    let existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // ✅ Check if username exists
    let existUsername = await User.findOne({ userName });
    if (existUsername) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    // ✅ Password length check
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // ✅ Hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });

    // ✅ Generate token
    let token = await genToken(user._id);

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ Remove password from response
    const userData = { ...user._doc };
    delete userData.password;

    return res.status(201).json(userData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Signup error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Find user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // ✅ Generate token
    let token = await genToken(user._id);

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ Remove password from response
    const userData = { ...user._doc };
    delete userData.password;

    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login error" });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Log out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Logout error" });
  }
};
