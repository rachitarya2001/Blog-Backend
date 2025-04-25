import express from 'express';
import { generateBlog, getAllBlogs, deleteBlog, generateSummaryBlog } from '../controllers/blogController.js';

const router = express.Router();

router.post('/generate', generateBlog);
router.get('/', getAllBlogs);
router.delete('/:id', deleteBlog);
router.post('/generate-summary', generateSummaryBlog);


export default router;
