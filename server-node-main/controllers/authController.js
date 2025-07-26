const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    const { fname, lname, email, password, userType } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ fname, lname, email, password: hash, userType });
    res.status(201).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
    res.json({ status: "ok", token });
  } catch (err) {
    next(err);
  }
};
