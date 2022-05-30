import AdminSchema from "./Admin.schema";

export const insertAdmin = (obj) => {
  return AdminSchema(obj).save();
};

export const getAdminById = (_id) => {
  return AdminSchema.findById(_id);
};

// filter can be anything, but must be an object
export const getAdmin = (filter) => {
  return AdminSchema.findOne(filter);
};

// filetre and obj must be an object
export const updateAdmin = (filter, obj) => {
  return AdminSchema.findByIdAndUpdate(filter, obj, { new: true });
};
