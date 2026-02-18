import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

export const getAllUsersService = async () => {
  return await User.find({});
};

export const getUserByIdService = async (id) => {
  //  if (!isValidObjectId(id)) return null;
  const user = await User.findOne({ _id: id });
  return user;
};

export const registerUserService = async (data) => {
  const newUser = await User.create(data);
  return newUser;
};

// export const registerUserService = async (newUser) => {
//   const salt = bcrypt.genSaltSync(10);
//   const hash = bcrypt.hashSync(newUser.password, salt);
//   return await User.create({ ...newUser, password: hash });
// };

export const insertManyUsersService = async (users) => {
  const inserted = await User.insertMany(users);
  return inserted;
  // const withHash = users.map((u) => {
  //   const salt = bcrypt.genSaltSync(10);
  //   const hash = bcrypt.hashSync(u.password, salt);
  //   return { ...u, password: hash };
  // });

  // return await User.insertMany(withHash);
};

export const findUserByIdAndUpdateService = async (id, body) => {
  //  if (!isValidObjectId(id)) return { error: "INVALID_ID" };

  // const valid = validateUpdateFields(body);
  // if (!valid.ok) return { error: "INVALID_FIELD", badField: valid.badField };

  const updated = await User.findOneAndUpdate({ _id: id }, body, {
    new: true,
    runValidators: true,
  });

  return updated; // || null;
};

export const findUserByIdAndDeleteService = async (id) => {
  //  if (!isValidObjectId(id)) return null;
  const deleted = await User.findOneAndDelete({ _id: id });
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
    throw new Error("no user found");
  }
  const isMatching = bcrypt.compareSync(password, user.password);
  return isMatching;
};

export const changePasswordService = async (id, newPassword, oldPassword) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error("no user found");
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
