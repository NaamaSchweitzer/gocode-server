import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./DB/db.js";
import {
  findAllProductsController,
  findProductByIdAndDeleteController,
  findProductByIdAndUpdateController,
  findProductByIdController,
  insertProductController,
  resetProductsController,
} from "./controllers/Product.js";
import {
  getAllUsersController,
  findUserByIdAndDeleteController,
  findUserByIdAndUpdateController,
  getUserByIdController,
  insertManyUsersController,
  registerUserController,
  deleteAllUsersController,
  changePasswordController,
  loginController,
} from "./controllers/User.js";

const port = process.env.PORT || 4000;
const mongouri = process.env.MONGOURI; // || "";

const app = express();

app.use(express.json());
app.use(cors());

// -------------------- Products --------------------

// GET ALL  -> find
app.get("/api/products", findAllProductsController);

// GET BY ID -> findOne
app.get("/api/products/product/:id", findProductByIdController);

// ADD -> insert
app.post("/api/products", insertProductController);

// UPDATE -> findByIdAndUpdate
app.put("/api/products/product/:id", findProductByIdAndUpdateController);

// DELETE -> findByIDAndDelete
app.delete("/api/products/product/:id", findProductByIdAndDeleteController);

// RESET PRODUCTS -> insertMany
app.post("/api/reset-products", resetProductsController);

// -------------------- Users --------------------

// GET ALL  -> find
app.get("/api/users", getAllUsersController);

// GET BY ID -> findOne
app.get("/api/users/user/:id", getUserByIdController);

// ADD -> insert
app.post("/api/users", registerUserController);

// ADD ALL -> insertMany
app.post("/api/users/bulk", insertManyUsersController);

// UPDATE -> findByIdAndUpdate
app.put("/api/users/user/:id", findUserByIdAndUpdateController);

// DELETE -> findByIdAndDelete
app.delete("/api/users/user/:id", findUserByIdAndDeleteController);

// DELETE ALL -> deleteMany
app.delete("/api/users", deleteAllUsersController);

// LOGIN (inactive)
app.post("/api/users/login", loginController);

// CHANGE PASSWORD (inactive)
app.post("/api/users/user/:id/change-password", changePasswordController);

// ---------------------------------------------

const startServer = async () => {
  await connectDB(mongouri);
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
};

startServer();
