import mongoose from "mongoose";
import fs from "fs";
import {
  getUserByIdService,
  getAllUsersService,
  registerUserService,
  findUserByIdAndDeleteService,
  findUserByIdAndUpdateService,
  insertManyUsersService,
  deleteAllUsersService,
} from "../services/User.js";
import { serverResponse } from "../utils/serverResponse.js";

export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return serverResponse(res, 200, users);
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const getUserByIdController = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return serverResponse(res, 400, "Invalid user id");
  }

  try {
    const user = await getUserByIdService(id);

    if (!user) {
      return serverResponse(res, 404, "User not found");
    }

    return serverResponse(res, 200, user);
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const registerUserController = async (req, res) => {
  const body = req.body;

  if (!body?.email || !body?.password || !body?.fullName) {
    return serverResponse(res, 400, "Missing required fields");
  }

  try {
    const newUser = await registerUserService(body);
    return serverResponse(res, 201, newUser);
  } catch (err) {
    // duplicate email
    if (err.code === 11000) {
      return serverResponse(res, 400, "Email already exists");
    }
    return serverResponse(res, 500, "Server error");
  }
};

export const insertManyUsersController = async (req, res) => {
  try {
    const json = fs.readFileSync("./users.json", { encoding: "utf-8" });
    const users = JSON.parse(json);

    const inserted = await insertManyUsersService(users);

    return serverResponse(res, 201, {
      message: "Users inserted",
      count: inserted.length,
    });
  } catch (err) {
    return serverResponse(res, 500, "Failed inserting users");
  }
};

export const findUserByIdAndUpdateController = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return serverResponse(res, 400, "Invalid user id");
  }

  const allowed = new Set(["fullName", "email"]);

  const incomingKeys = Object.keys(req.body);
  const invalidKeys = incomingKeys.filter((k) => !allowed.has(k));

  if (invalidKeys.length) {
    return serverResponse(
      res,
      400,
      `Invalid fields: ${invalidKeys.join(", ")}`,
    );
  }

  try {
    const updated = await findUserByIdAndUpdateService(id, req.body);

    if (!updated) {
      return serverResponse(res, 404, "User not found");
    }

    return serverResponse(res, 200, updated);
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const findUserByIdAndDeleteController = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return serverResponse(res, 400, "Invalid user id");
  }

  try {
    const deleted = await findUserByIdAndDeleteService(id);

    if (!deleted) {
      return serverResponse(res, 404, "User not found");
    }

    return serverResponse(res, 200, deleted);
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const deleteAllUsersController = async (req, res) => {
  try {
    const result = await deleteAllUsersService();

    return serverResponse(res, 200, {
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const loginController = (req, res) => {
  return serverResponse(res, 501, "Login service not active yet");
};

export const changePasswordController = (req, res) => {
  return serverResponse(res, 501, "Change password service not active yet");
};
