import { User } from "../user/userTypes";

export interface Book {
  _id: string;
  title: string;
  author: User;
  genre: string;
  coverImage: string;
  desc: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
