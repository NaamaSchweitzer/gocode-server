import { Product } from "../models/Product.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAllProductsService = async () => {
  return await Product.find({});
};

export const getProductByIdService = async (id) => {
  // if (!isValidObjectId(id)) throw new Error("invalid product id");

  const product = await Product.findOne({ _id: id });
  return product;
};

export const createProductService = async (data) => {
  const newProduct = await Product.create(data);
  return newProduct;
};

export const updateProductByIdService = async (id, body) => {
  // if (!isValidObjectId(id)) throw new Error("invalid product id");

  const updated = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  return updated; // || null;
};

export const deleteProductByIdService = async (id) => {
  // if (!isValidObjectId(id)) throw new Error("invalid product id");
  
  const deleted = await Product.findByIdAndDelete(id);
  return deleted;
};

export const resetProductsService = async (products) => {
  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  return inserted;
};
