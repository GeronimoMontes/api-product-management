import { Document } from "mongoose";

export class UserDoc extends Document {
    username: string;
    password: string;
}
