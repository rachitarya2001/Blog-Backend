const generateSummaryPrompt = (blogContent) => `
You are an expert blog editor for an international education platform.

Summarize the following blog post into a concise, engaging, and SEO-optimized **200–300 word blog summary**.

✅ SUMMARY STRUCTURE (Strictly follow this):
1. TITLE — Write a catchy, keyword-relevant title in ALL CAPS
2. KEY HIGHLIGHTS — List 2–3 bullet points using • (U+2022)
3. INTRODUCTION — One short paragraph engaging the reader
4. SUMMARY BODY — 1–2 brief but insightful paragraphs summarizing the blog’s key points
5. FAQ — One helpful question and answer pair relevant to the topic

✅ FORMAT RULES (STRICT):
- NO HTML tags (e.g., <strong>, <ul>, <li>, <p>)
- NO Markdown (e.g., *, **, -, _)
- Use ONLY:
  - ALL CAPS for Headings
  - Line breaks between sections
  - Bullet points using “•”
  - Numbering like 1., 2., etc.
  - Hyperlinks formatted as: Anchor Text (https://example.com)

✅ RETURN ONLY VALID JSON IN THIS FORMAT:
{
  "content": "Summary content here using plain text formatting, clearly structured as per instructions.",
  "faq": [
    {
      "question": "FAQ Question?",
      "answer": "Helpful, accurate answer."
    }
  ]
}

🧠 Tone:
- Friendly and professional
- Clear and informative
- Tailored for Indian students and education consultants

BLOG TO SUMMARIZE:
"""${blogContent}"""
`.trim();

export default generateSummaryPrompt;
