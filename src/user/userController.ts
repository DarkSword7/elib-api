import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required!");
    return next(error);
  }

  // Check if user already exists
  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, "User already exists with this email!");
    return next(error);
  }

  // Create new user
  const hashedPassword = await bcrypt.hash(password, 12);

  // Process the request
  // Send the response
  res.json({
    message: "User registered successfully!",
  });
};

export { createUser };
