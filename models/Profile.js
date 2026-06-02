import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  summary: { type: String },
  experience: [{
    title: String,
    company: String,
    startDate: String,
    endDate: String,
    description: String,
    bullets: [String]
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
    gpa: String
  }],
  skills: [String],
  links: {
    linkedin: String,
    github: String,
    portfolio: String
  }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);