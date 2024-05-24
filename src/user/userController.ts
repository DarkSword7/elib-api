import { Request, Response, NextFunction } from "express";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "User registered successfully!",
  });
};

export { createUser };
