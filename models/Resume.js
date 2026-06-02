import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  template: { type: String, default: 'professional' },
  generatedSummary: { type: String },
  generatedBullets: { type: Map, of: [String] },
  targetRole: { type: String },
  atsScore: { type: Number },
  atsFeedback: { type: String }
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);