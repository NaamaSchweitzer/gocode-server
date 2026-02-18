import { Product } from "../models/Product.js";

export const findAllProductsService = async () => {
  return await Product.find({});
};

export const findProductByIdService = async (id) => {
  //  if (!isValidObjectId(id)) return null;
  const product = await Product.findOne({ _id: id });
  return product;
};

export const insertProductService = async (data) => {
  const newProduct = await Product.create(data);
  return newProduct;
};

export const findProductByIdAndUpdateService = async (id, body) => {
  //  if (!isValidObjectId(id)) return { error: "INVALID_ID" };

  // const valid = validateUpdateFields(body);
  // if (!valid.ok) return { error: "INVALID_FIELD", badField: valid.badField };

  const updated = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  return updated; // || null;
};

export const findProductByIdAndDeleteService = async (id) => {
  //  if (!isValidObjectId(id)) return null;
  const deleted = await Product.findByIdAndDelete(id);
  return deleted;
};

export const resetProductsService = async (products) => {
  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  return inserted;
};
