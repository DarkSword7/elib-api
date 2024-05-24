import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { access } from "fs";

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

  // Process the request

  // Create new user
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // Token generation JWT
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
    algorithm: "HS256",
  });

  // Send the response
  res.json({
    accessToken: token,
  });
};

export { createUser };
