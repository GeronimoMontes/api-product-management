import { Document } from 'mongoose';

export interface Product extends Document {
    readonly _id: number;
    readonly name: string;
    readonly description: string;
    readonly price: number;
}
