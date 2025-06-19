import {Types,Schema,model} from 'mongoose';

 const taskSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  description: { type: String },
  priority: { type: String, enum: ['low', 'high', 'urgent'], default: 'low' },
  deadline: { type: String },
  status: { type: String, enum: ['todo', 'under_review', 'in_progress', 'finished'], default: 'todo' },
  createdAt: { type: Date, default: Date.now,
  },
});

 const Task = model('Task', taskSchema);

 export default Task


 