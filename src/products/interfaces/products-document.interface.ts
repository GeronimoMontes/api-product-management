import { Document } from 'mongoose';

export interface ProductDoc extends Document {
  name: string;
  description: string;
  price: number;
}
