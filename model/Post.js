import { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  imagePublicId: { 
    type: String, 
    required: true 
  },
  features: { 
    type: String, 
    required: true 
  },
  privacy: { 
    type: String, 
    required: true 
  },
  playStore_url: { 
    type: String, 
    required: true 
  },
  appStore_url: { 
    type: String, 
    required: true 
  },
  shortDescription: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default models.Post || model("Post", PostSchema);
