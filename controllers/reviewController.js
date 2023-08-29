const Review = require("../models/Review");
const Product = require("../models/Product");

const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");
const CustomError = require("../errors");

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `Cannot find the product id : ${productId}`
    );
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.CREATED).json({ reviews });
};

const getSingleReview = async (req, res) => {
  const { id: productId } = req.params;

  const review = await Review.findOne({ _id: productId });
  if (!review) {
    throw new CustomError.NotFoundError(`Cannot find that product ID`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: productId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: productId });
  if (!review) {
    throw new CustomError.NotFoundError(`Cannot find that product ID`);
  }
  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: productId } = req.params;

  const review = await Review.findOne({ _id: productId });
  if (!review) {
    throw new CustomError.NotFoundError(`Cannot find that product ID`);
  }

  checkPermissions(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).json({ msg: `product deleted` });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
