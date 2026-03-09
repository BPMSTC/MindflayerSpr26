import mongoose, { Document, Schema } from 'mongoose';

export interface IStory extends Document {
  title: string;
  description: string;
  author: mongoose.Types.ObjectId;
  coverImage: string;
  isPublished: boolean;
  startNodeId: mongoose.Types.ObjectId | null;
  create_date: Date;
}

const StorySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String },
  isPublished: { type: Boolean, default: false },
  startNodeId: { type: Schema.Types.ObjectId, ref: 'StoryNode', default: null },
  create_date: { type: Date, default: Date.now }
});

export const Story = mongoose.model<IStory>('Story', StorySchema);
