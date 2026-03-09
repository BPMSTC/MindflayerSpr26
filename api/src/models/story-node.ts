import mongoose, { Document, Schema } from 'mongoose';

export interface IChoice {
  text: string;
  nextNodeId: mongoose.Types.ObjectId | null;
}

export interface IStoryNode extends Document {
  storyId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  imageUrl: string;
  choices: IChoice[];
  isEnding: boolean;
  create_date: Date;
}

const ChoiceSchema: Schema = new Schema({
  text: { type: String, required: true },
  nextNodeId: { type: Schema.Types.ObjectId, ref: 'StoryNode', default: null }
}, { _id: true });

const StoryNodeSchema: Schema = new Schema({
  storyId: { type: Schema.Types.ObjectId, ref: 'Story', required: true },
  title: { type: String, required: true },
  content: { type: String },
  imageUrl: { type: String },
  choices: [ChoiceSchema],
  isEnding: { type: Boolean, default: false },
  create_date: { type: Date, default: Date.now }
});

export const StoryNode = mongoose.model<IStoryNode>('StoryNode', StoryNodeSchema);
