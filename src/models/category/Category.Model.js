import CategorySchema from "./Category.schema.js";

export const insertCategory = (obj) => {
  return CategorySchema(obj).save();
};

export const getACategory = (filter) => {
  return CategorySchema.findOne(filter);
};

export const getAllCategories = () => {
  return CategorySchema.find();
};

export const getCategories = (filter) => {
  return CategorySchema.find(filter);
};

export const deleteCatById = (_id) => {
  return CategorySchema.findByIdAndDelete(_id);
};

// @_id is string, @updateObj must be an object
export const updateCategoryById = (_id, updateObj) => {
  return CategorySchema.findByIdAndUpdate(_id, updateObj, { new: true });
};
