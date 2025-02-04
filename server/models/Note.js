import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String  // Add this if you want to store image data
  },
  description: {
    type: String,
    required: true
  },
//   isAudioNote: {
//     type: Boolean,
//     default: false
//   },
//   audioTranscription: {
//     type: String,
//     default: ''
//   },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model('Note', NoteSchema);
export default Note