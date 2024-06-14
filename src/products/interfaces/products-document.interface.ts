import { Document } from 'mongoose';

export interface ProductDoc extends Document {
  _id?: string;
  name: string;
  description: string;
  price: number;
}
