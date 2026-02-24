import "dotenv/config";
import express from "express";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./DB/db.js";
import {
  getAllProductsController,
  deleteProductByIdController,
  updateProductByIdController,
  getProductByIdController,
  createProductController,
  resetProductsController,
} from "./controllers/Product.js";
import {
  getAllUsersController,
  deleteUserByIdController,
  updateUserByIdController,
  getUserByIdController,
  insertManyUsersController,
  registerUserController,
  deleteAllUsersController,
  changePasswordController,
  loginController,
} from "./controllers/User.js";
import { verifyToken } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 4000;
const mongouri = process.env.MONGOURI; // || "";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("client/dist"));

// -------------------- Products --------------------

// GET ALL  -> find
app.get("/api/products", getAllProductsController);

// GET BY ID -> findOne
app.get("/api/products/:id", getProductByIdController);

// ADD -> insert
app.post("/api/products", createProductController);

// UPDATE -> findByIdAndUpdate
app.put("/api/products/:id", updateProductByIdController);

// DELETE -> findByIDAndDelete
app.delete("/api/products/:id", deleteProductByIdController);

// RESET PRODUCTS -> insertMany
app.post("/api/reset-products", resetProductsController);

// -------------------- Users --------------------

app.get("/api/users", getAllUsersController);
app.get("/api/users/:userId", getUserByIdController);
app.post("/api/users", registerUserController);
app.post("/api/users/bulk", insertManyUsersController);
app.put("/api/users/:userId", updateUserByIdController);
app.delete("/api/users/:userId", deleteUserByIdController);
app.delete("/api/users", deleteAllUsersController);
app.post("/api/users/login", loginController);
app.post(
  "/api/users/:userId/change-password",
  verifyToken,
  changePasswordController,
);

// ---------------------------------------------

app.get(/.*/, (req, res) => {
console.log(__dirname);
res.sendFile(__dirname + "/client/dist/index.html");
});


const startServer = async () => {
  await connectDB(mongouri);
  app.listen(port, () => {
    console.log(`🚀 Server running at port ${port}`);
  });
};

startServer();
