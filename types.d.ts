import { IUser } from "./src/models/User.models";

declare namespace Express {
    export interface Request {
        user?: IUser;
    }
}