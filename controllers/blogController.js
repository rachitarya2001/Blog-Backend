import axios from 'axios';
import Blog from '../models/Blog.js';
import generateBlogPrompt from '../helpers/blogPrompt.js';
import generateSummaryPrompt from '../helpers/summaryPrompt.js';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';


export const generateBlog = async (req, res) => {

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


    const { keywords } = req.body;

    if (!keywords || keywords.length === 0) {
        return res.status(400).json({ error: 'Please provide at least 1 keyword' });
    }

    const prompt = generateBlogPrompt({ keywords });

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-4o',
                messages: [
                    { role: 'user', content: prompt }
                ],
                max_tokens: 2500,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        let jsonText = response.data.choices[0].message.content.trim();

        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
        }

        try {
            const parsed = JSON.parse(jsonText);
            const blog = new Blog({ keywords, content: parsed.content });
            await blog.save();
            res.json(blog);
        } catch (parseErr) {
            console.error('Failed to parse AI JSON:', jsonText);
            return res.status(500).json({ error: 'AI returned invalid JSON' });
        }
    } catch (error) {
        console.error('OpenAI error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate blog' });
    }
};



// export const generateSummaryBlog = async (req, res) => {
//     const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
//     const { blogId } = req.body;
  
//     if (!blogId) {
//       return res.status(400).json({ error: 'Missing blog ID to summarize' });
//     }
  
//     try {
//       const blog = await Blog.findById(blogId);
//       if (!blog) {
//         return res.status(404).json({ error: 'Blog not found' });
//       }
  
//       const summaryPrompt = `
//   You are an expert education blog editor. Summarize the following blog into a **short, 200–300 word blog summary** with the following structure:
  
//   1. Title
//   2. 2–3 Key Highlights
//   3. 1-paragraph Introduction
//   4. 1–2 paragraph Summary Body
//   5. One FAQ (format: Q: ..., A: ...)
  
//   ✍️ Tone: Friendly, professional, Indian student-focused
//   📝 Format: Use bold section headings and bullet points
//   🔍 Keep it SEO-optimized, engaging, and clean for mobile reading
  
//   Blog to summarize:
//   """${blog.content}"""
  
//   ✅ Return only JSON in this format:
//   {
//     "content": "Summary content here with formatted headings, bullet points, etc.",
//     "faq": [
//       {
//         "question": "Your question?",
//         "answer": "Your answer."
//       }
//     ]
//   }
//       `.trim();
  
//       const response = await axios.post(
//         OPENAI_API_URL,
//         {
//           model: 'gpt-4o',
//           messages: [{ role: 'user', content: summaryPrompt }],
//           max_tokens: 1000,
//           temperature: 0.7,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${OPENAI_API_KEY}`,
//           },
//         }
//       );
  
//       let jsonText = response.data.choices[0].message.content.trim();
  
//       if (jsonText.startsWith('```json')) {
//         jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
//       }
  
//       try {
//         const parsed = JSON.parse(jsonText);
//         const summaryBlog = new Blog({
//           keywords: blog.keywords,
//           content: parsed.content,
//           isSummary: true,
//           faq: parsed.faq || [],
//         });
//         await summaryBlog.save();
//         res.json(summaryBlog);
//       } catch (parseErr) {
//         console.error('Failed to parse summary JSON:', jsonText);
//         return res.status(500).json({ error: 'AI returned invalid summary JSON' });
//       }
  
//     } catch (error) {
//       console.error('Error generating summary blog:', error.response?.data || error.message);
//       res.status(500).json({ error: 'Failed to generate summary blog' });
//     }
//   };


export const generateSummaryBlog = async (req, res) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const { blogId } = req.body;
  
    if (!blogId) {
      return res.status(400).json({ error: 'Missing blog ID to summarize' });
    }
  
    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
  
      const summaryPrompt = generateSummaryPrompt(blog.content);
  
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o',
          messages: [{ role: 'user', content: summaryPrompt }],
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
  
      let jsonText = response.data.choices[0].message.content.trim();
  
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
      }
  
      try {
        const parsed = JSON.parse(jsonText);
        const summaryBlog = new Blog({
          keywords: blog.keywords,
          content: parsed.content,
          isSummary: true,
          faq: parsed.faq || [],
        });
        await summaryBlog.save();
        res.json(summaryBlog);
      } catch (parseErr) {
        console.error('Failed to parse summary JSON:', jsonText);
        return res.status(500).json({ error: 'AI returned invalid summary JSON' });
      }
  
    } catch (error) {
      console.error('Error generating summary blog:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to generate summary blog' });
    }
  };


export const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Failed to delete blog:', error.message);
        res.status(500).json({ error: 'Failed to delete blog' });
    }
};


export const getAllBlogs = async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
};
