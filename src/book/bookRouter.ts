import { Router } from "express";
import { createBook } from "./bookController";

const bookRouter = Router();

// Routes
bookRouter.post("/", createBook);

export default bookRouter;
