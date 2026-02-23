import {
  getProductByIdService,
  getAllProductsService,
  createProductService,
  deleteProductByIdService,
  updateProductByIdService,
  resetProductsService,
} from "../services/Product.js";
import { serverResponse } from "../utils/serverResponse.js";
import { Product } from "../models/Product.js";
import mongoose from "mongoose";
import fs from "fs";

export const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProductsService();
    return serverResponse(res, 200, products);
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Error fetching products",
      error: err.message,
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return serverResponse(res, 400, "Invalid product id");
    }

    const product = await getProductByIdService(id);

    if (!product) {
      return serverResponse(res, 404, "Product not found");
    }

    return serverResponse(res, 200, product);
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Error fetching product",
      error: err.message,
    });
  }
};

export const createProductController = async (req, res) => {
  try {
    const body = req.body;

    if (!body?.title || !body?.price) {
      return serverResponse(res, 400, "Missing required fields");
    }

    const newProduct = await createProductService({ ...body });
    return serverResponse(res, 201, newProduct);
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Error creating product",
      error: err.message,
    });
  }
};

export const updateProductByIdController = async (req, res) => {
  try {
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

    const updated = await updateProductByIdService(id, req.body);

    if (!updated) return serverResponse(res, 404, "Product not found");

    return serverResponse(res, 200, updated);
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Error updating product",
      error: err.message,
    });
  }
};

export const deleteProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return serverResponse(res, 400, "Invalid product id");
    }

    const deleted = await deleteProductByIdService(id);

    if (!deleted) return serverResponse(res, 404, "Product not found");
    return serverResponse(res, 200, deleted);
  } catch (err) {
    return serverResponse(res, 500, {
      message: "Error deleting product",
      error: err.message,
    });
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
    return serverResponse(res, 500, {
      message: "Failed products reset",
      error: err.message,
    });
  }
};
