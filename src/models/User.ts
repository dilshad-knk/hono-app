import { Schema, model, Document, Types } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  userName :{type:String}
});

const User = model("User", userSchema);

export default User;
