require("dotenv").config();

const mockData = require("./mockData/products.json");
const Product = require("./models/Product");
const connectDB = require("./db/connect");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // Add the user property to each object in mockData
    const mockDataWithUser = mockData.map((data) => ({
      ...data,
      user: "64e3b5392a56629895b0bbb7", // Replace with the appropriate user ID
    }));

    await Product.create(mockDataWithUser);
    console.log("Success!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
