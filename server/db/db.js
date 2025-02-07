import mongoose from 'mongoose'




const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/notes-taking-app", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;