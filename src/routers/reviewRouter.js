import express from "express";

const router = express.Router();

const Review = [
  {
    _id: "12345",
    productId: "ak1233",
    productName: "laptop",
    rating: "5",
    reviewedBy: "sam",
    reviewedBy_id: "123befjb",
  },
  {
    _id: "12345",
    productId: "ak1233",
    productName: "laptop",
    rating: "5",
    reviewedBy: "sam",
    reviewedBy_id: "123befjb",
  },
  {
    _id: "12345",
    productId: "ak1233",
    productName: "laptop",
    rating: "5",
    reviewedBy: "sam",
    reviewedBy_id: "123befjb",
  },
  {
    _id: "12345",
    productId: "ak1233",
    productName: "laptop",
    rating: "5",
    reviewedBy: "sam",
    reviewedBy_id: "123befjb",
  },
];
router.get("/:_id?", (req, res) => {
  const { _id } = req.params;
  const data = _id ? Review.filter((item) => item._id === _id) : Review;
  res.json({
    status: "success",
    message: "Reviews",
    reviews: data,
  });
});

export default router;
