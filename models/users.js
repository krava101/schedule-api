import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  token: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  verify: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String,
    default: null
  },
  invites: [
    {
      projectId: {
        type: Schema.Types.ObjectId,
        ref: 'project',
      },
      projectName: {
        type: String,
        required: [true, 'Project name is required'],
      },
      accepted: {
        type: Boolean,
        default: false,
      }
    }
  ],
  ownProjects: [
    {
      projectId: {
        type: Schema.Types.ObjectId,
        ref: 'project',
      },
      projectName: {
        type: String,
        required: [true, 'Project name is required'],
      },
    }
  ],
  projects: [
    {
      projectId: {
        type: Schema.Types.ObjectId,
        ref: 'project',
      },
      projectName: {
        type: String,
        required: [true, 'Project name is required'],
      },
    }
  ],
},
{
versionKey: false,
timestamps: true,
});

export default mongoose.model("User", userSchema);


