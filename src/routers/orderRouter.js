import express from "express";

const router = express.Router();

const orders = [
  {
    _id: "12345",
    status: "", //pending, processing, complete and cancelled
    buyer: {
      buyerId: "456",
      fname: "james",
      lname: "smith",
      email: "james123@gmail.com",
      phone: "fdgshj",
    },
    cart: [
      {
        productId: "2334",
        productName: "large screen",
        salesPrice: "",
        qty: "2",
        thumbnail: "http://",
        subTotal: 333,
      },
      {
        productId: "2334",
        productName: "large screen",
        salesPrice: "",
        qty: "2",
        thumbnail: "http://",
        subTotal: 333,
      },
    ],
    cartTotal: "sfgh",
    discount: "5",
    totalAmount: "34",
    paymentInfo: {
      status: "paid", //pending or paid
      method: "cash", //credid card
      paidAmount: "1234",
      transactionId: "ghj122",
      paidDate: "10/12/2021",
    },
  },

  {
    _id: "56789",
    status: "", //pending, processing, complete and cancelled
    buyer: {
      buyerId: "456",
      fname: "james",
      lname: "smith",
      email: "james123@gmail.com",
      phone: "fdgshj",
    },
    cart: [
      {
        productId: "2334",
        productName: "large screen",
        salesPrice: "",
        qty: "2",
        thumbnail: "http://",
        subTotal: 333,
      },
      {
        productId: "2334",
        productName: "large screen",
        salesPrice: "",
        qty: "2",
        thumbnail: "http://",
        subTotal: 333,
      },
    ],
    cartTotal: "sfgh",
    discount: "5",
    totalAmount: "34",
    paymentInfo: {
      status: "paid", //pending or paid
      method: "cash", //credid card
      paidAmount: "1234",
      transactionId: "ghj122",
      paidDate: "10/12/2021",
    },
  },
];

router.get("/:_id?", (req, res) => {
  const { _id } = req.params;
  const result = _id ? orders.filter((item) => item._id === _id) : orders;
  res.json({
    status: "success",
    message: "Orders",
    orders: result,
  });
});

export default router;
