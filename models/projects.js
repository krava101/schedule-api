import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  owner: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }, 
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "creator"
    }
  },
  employees:[
    {
      id: {
          type: Schema.Types.ObjectId,
          ref: 'user',
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
      },
      avatar: {
        type: String,
      },
      role: {
        type: String,
        enum: ["creator", "admin", "employee", "view"],
        default: "employee",
      }
    }
  ]
},
{
versionKey: false,
timestamps: true,
})

export default mongoose.model("Project", projectSchema);