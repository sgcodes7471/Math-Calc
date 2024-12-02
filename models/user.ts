import mongoose , {Schema , Document} from "mongoose";

export interface User extends Document{
    name:string,
    email:string,
    password:string,
    createdAt:Date,
}

const UserSchema:Schema<User> = new Schema({
    name:{type:String , required:[true,'Name is required']},
    email:{type:String , required:[true,'Email is required'] , unique:true},
    password:{type:String , required:true},
    createdAt:{type:Date , required:true, default:Date.now()},
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)
export default UserModel