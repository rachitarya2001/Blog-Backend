import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    keywords: [String],
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Blog', blogSchema);
