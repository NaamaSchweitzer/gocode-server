import mongoose from "mongoose";
import fs from "fs";
import {
  getUserByIdService,
  getAllUsersService,
  registerUserService,
  deleteUserByIdService,
  updateUserByIdService,
  insertManyUsersService,
  deleteAllUsersService,
  loginService,
  changePasswordService,
} from "../services/User.js";
import { serverResponse } from "../utils/serverResponse.js";

export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    if (!users || users.length === 0) {
      return serverResponse(res, 404, "Users not found");
    }

    return serverResponse(res, 200, users);
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Error fetching users",
      error: err.message,
    });
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return serverResponse(res, 400, "Invalid user id");
    }

    const user = await getUserByIdService(userId);

    if (!user) {
      return serverResponse(res, 404, "User not found");
    }

    return serverResponse(res, 200, user);
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Error fetching user",
      error: err.message,
    });
  }
};

export const registerUserController = async (req, res) => {
  try {
    const body = req.body;

    if (!body?.email || !body?.password || !body?.fullName) {
      return serverResponse(res, 400, "Missing required fields");
    }

    const result = await registerUserService(body);
    if (!result) {
      return serverResponse(res, 400, "error creating user");
    }

    return serverResponse(res, 201, {
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    // duplicate email
    if (err.code === 11000) {
      return serverResponse(res, 400, "Email already exists");
    }
    return serverResponse(res, 500, {
      message: "Error registering user",
      error: err.message,
    });
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
    return serverResponse(res, 500, {
      message: "Failed inserting users",
      error: err.message,
    });
  }
};

export const updateUserByIdController = async (req, res) => {
  try {
    const userId = req.params.userId;

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

    const updated = await updateUserByIdService(userId, req.body);

    if (!updated) {
      return serverResponse(res, 404, "User not found");
    }

    return serverResponse(res, 200, updated);
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Failed updating user",
      error: err.message,
    });
  }
};

export const deleteUserByIdController = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return serverResponse(res, 400, "Invalid user id");
    }

    const deleted = await deleteUserByIdService(userId);

    if (!deleted) {
      return serverResponse(res, 404, "User not found");
    }

    return serverResponse(res, 200, deleted);
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Failed deleting user",
      error: err.message,
    });
  }
};

export const deleteAllUsersController = async (req, res) => {
  try {
    const result = await deleteAllUsersService();

    return serverResponse(res, 200, {
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Failed deleting users",
      error: err.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body.email, req.body.password);

    if (!result) {
      return serverResponse(res, 200, "password is incorrect");
    }

    return serverResponse(res, 200, {
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    return serverResponse(res, 500, {
      message: "Error loging in to user",
      error: error.message,
    });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword, oldPassword } = req.body;
    if (!newPassword || !oldPassword) {
      return serverResponse(
        res,
        400,
        "oldPassword or newPassword fields are missing",
      );
    }

    const user = await changePasswordService(userId, newPassword, oldPassword);

    if (!user) {
      return serverResponse(
        res,
        400,
        "an error occured - password was not changed",
      );
    }

    return serverResponse(res, 200, { userPassValid: true, user });
  } catch (error) {
    return serverResponse(res, 500, {
      message: "Error changing password for user",
      error: error.message,
    });
  }
};
