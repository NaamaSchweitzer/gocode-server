import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const getAllUsersService = async () => {
  return await User.find({});
};

export const getUserByIdService = async (id) => {
  return await User.findOne({ _id: id });
};

export const registerUserService = async (newUser) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newUser.password, salt);
  const userAfterHashing = { ...newUser, password: hash };
  const user = new User(userAfterHashing);
  const savedUser = await user.save();

  // Create the Token immediately upon registration
  const token = jwt.sign(
    { id: savedUser._id, email: savedUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  // Remove password from the object we return to the controller
  const userObject = savedUser.toObject();
  delete userObject.password;

  return { user: userObject, token };
};

export const insertManyUsersService = async (users) => {
  const inserted = await User.insertMany(users);
  return inserted;
};

export const updateUserByIdService = async (id, body) => {
  //  if (!isValidObjectId(id)) return null;

  const updated = await User.findOneAndUpdate({ _id: id }, body, {
    new: true,
    runValidators: true,
  });

  return updated; // || null;
};

export const deleteUserByIdService = async (id) => {
  //  if (!isValidObjectId(id)) return null;
  const deleted = await User.findOneAndDelete({ _id: id }).select("-password");
  //  if (!deleted) return null;
  return deleted;
};

export const deleteAllUsersService = async () => {
  const result = await User.deleteMany({});
  return result;
};

export const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("user not found");
  }
  const isMatching = bcrypt.compareSync(password, user.password);
  if (!isMatching) {
    throw new Error("password does not match");
  }

  // Create the Token
  const token = jwt.sign(
    { sub: user._id, email: user.email }, // Payload
    process.env.JWT_SECRET, // Secret Key
    { expiresIn: "1d" }, // Options
  );

  // Return the user (without password) and the token
  const userObject = user.toObject();
  delete userObject.password;

  return { user: userObject, token };
};

export const changePasswordService = async (id, newPassword, oldPassword) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error("user not found");
  }
  const isPasswordsMatching = bcrypt.compareSync(oldPassword, user.password);
  if (!isPasswordsMatching) {
    throw new Error("password does not match");
  }

  // check that the new password is standing by the corrected regexes and patterns needed
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);

  return await User.findOneAndUpdate(
    { _id: id },
    { password: hash },
    { new: true },
  );
};
