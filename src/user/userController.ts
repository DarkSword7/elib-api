import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required!");
    return next(error);
  }

  // Check if user already exists
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User already exists with this email!"
      );
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }

  // Process the request

  // Create new user
  const hashedPassword = await bcrypt.hash(password, 12);
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }

  try {
    // Token generation JWT
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    // Send the response
    res.status(201).json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating JWT token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    const error = createHttpError(400, "All fields are required!");
    return next(error);
  }

  // Check if user exists
  const user = await userModel.findOne({ email });
  try {
    if (!user) {
      const error = createHttpError(404, "User not found!");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }

  // Process the request

  try {
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = createHttpError(401, "Invalid credentials!");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while comparing passwords"));
  }

  // Token generation JWT
  try {
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    res.json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating JWT token"));
  }
};

export { createUser, loginUser };
