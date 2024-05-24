import { Mongoose } from 'mongoose';
import { ProductSchema } from './schemas/products.schemas';

export const productsProviders = [
  {
    provide: 'PRODUCT_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Products', ProductSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
