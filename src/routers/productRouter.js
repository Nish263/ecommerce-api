import express from "express";
import {
  newProductValidation,
  updateProductValidation,
} from "../middlewares/joi-validation/productCategoryValidation.js";
import {
  deleteMultiProducts,
  getMultipleProducts,
  getProduct,
  insertProduct,
  updateProductById,
} from "../models/product/Product.Model.js";
import slugify from "slugify";
import multer from "multer";

// multer setup for validation and upload destintion
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    let error = null;
    // validation test

    cb(error, "public/img/products");
  },
  filename: (req, file, cb) => {
    const fullFileName = Date.now() + "-" + file.originalname;
    cb(null, fullFileName);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const products = _id
      ? await getProduct({ _id })
      : await getMultipleProducts();
    res.json({
      status: "success",
      message: "Product lists",
      products,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      const files = req.files;

      const images = files.map((img) => img.path);
      console.log(images);

      const { name } = req.body;
      const slug = slugify(name, { lower: true, trim: true });
      req.body.slug = slug;

      const result = await insertProduct({
        ...req.body,
        images,
        thumnail: images[0],
      });
      console.log(result);
      result?._id
        ? res.json({
            status: "success",
            message: "New Product has been added",
          })
        : res.json({
            status: "success",
            message: "Error unable to create new products",
          });
    } catch (error) {
      console.log(error);
      //   duplicate slug and the sku
      if (error.message.includes("E1100 duplicate key error collection")) {
        error.message = "Another product with similar name ";
      }
      next(error);
    }
  }
);

router.delete("/", async (req, res, next) => {
  try {
    const ids = req.body;
    console.log(req.body, "sssbjadsb");
    if (ids.length) {
      const result = await deleteMultiProducts(ids);
      console.log(result);
      if (result?.deletedCount) {
        return res.json({
          status: "success",
          message: "selected product have been deleted",
        });
      }
    }
    res.json({
      status: "error",
      message: "Unable to delete the product, please try agin later.",
    });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/",
  upload.array("newImages", 5),
  updateProductValidation,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const { _id, imgToDelete, ...rest } = req.body;
      const files = req.files;
      const images = files.map((img) => img.path); // new images
      console.log(images);

      const oldImgList = rest.images.split(","); //old images from database before editing product
      // imgToDelete holds the images that is in the oldImageList that need to be removed
      // 1. make a new array  for the image and replace in the database
      const filteredImages = oldImgList.filter(
        (img) => !imgToDelete.includes(img)
      );

      rest.images = [...filteredImages, ...images];
      //2.  delete image from the file system

      const result = await updateProductById(_id, rest);

      result?._id
        ? res.json({
            status: " success",
            message: "products has been updated",
            result,
          })
        : res.json({
            status: " error",
            message: " unable to update the product",
          });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
