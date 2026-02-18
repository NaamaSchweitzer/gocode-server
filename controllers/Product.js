import {
  findProductByIdService,
  findAllProductsService,
  insertProductService,
  findProductByIdAndDeleteService,
  findProductByIdAndUpdateService,
  resetProductsService,
} from "../services/Product.js";
import { serverResponse } from "../utils/serverResponse.js";
import { Product } from "../models/Product.js";
import mongoose from "mongoose";
import fs from "fs";

export const findAllProductsController = async (req, res) => {
  try {
    const products = await findAllProductsService();
    return serverResponse(res, 200, products);
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const findProductByIdController = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return serverResponse(res, 400, "Invalid product id");
  }

  try {
    const product = await findProductByIdService(id);

    if (!product) {
      return serverResponse(res, 404, "Product not found");
    }

    return serverResponse(res, 200, product);
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const insertProductController = async (req, res) => {
  const body = req.body;

  if (!body?.title || !body?.price) {
    return serverResponse(res, 400, "Missing required fields");
  }

  try {
    let newId = body.id;
    if (!newId) {
      const max = await Product.findOne({}).sort({ id: -1 });
      newId = max ? max.id + 1 : 1;
    }

    const newProduct = await insertProductService({ ...body, id: newId });
    return serverResponse(res, 201, newProduct);
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const findProductByIdAndUpdateController = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return serverResponse(res, 400, "Invalid product id");
  }

  const allowed = new Set([
    "title",
    "price",
    "description",
    "category",
    "image",
    "rating",
  ]);

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
    const updated = await findProductByIdAndUpdateService(id, req.body);

    if (!updated) return serverResponse(res, 404, "Product not found");

    return serverResponse(res, 200, updated);
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const findProductByIdAndDeleteController = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return serverResponse(res, 400, "Invalid product id");
  }

  try {
    const deleted = await findProductByIdAndDeleteService(id);

    if (!deleted) return serverResponse(res, 404, "Product not found");
    return serverResponse(res, 200, deleted);
  } catch (err) {
    return serverResponse(res, 500, "Server error");
  }
};

export const resetProductsController = async (req, res) => {
  try {
    const json = fs.readFileSync("./products.json", { encoding: "utf-8" });
    const products = JSON.parse(json);

    const inserted = await resetProductsService(products);

    return serverResponse(res, 201, {
      message: "Products reset done",
      insertedCount: inserted.length,
    });
  } catch (err) {
    return serverResponse(res, 500, "Failed products reset");
  }
};
