const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      });
    }
    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Password:", password);

    const user = await UserModel.findOne({ email });

    console.log("User found:", user);

    if (!user) {
      return res.status(403).json({
        message: "Email or password is wrong",
        success: false,
      });
    }

    console.log("Stored password:", user.password);

    const isPassEqual = await bcrypt.compare(password, user.password);

    console.log("Password match:", isPassEqual);

    if (!isPassEqual) {
      return res.status(403).json({
        message: "Email or password is wrong",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

module.exports = {
  signup,
  login,
};
