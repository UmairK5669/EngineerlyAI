import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Required for LaTeX styling

interface RenderMarkdownAndLatexProps {
  content: string;
}

const RenderMarkdownAndLatex: React.FC<RenderMarkdownAndLatexProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      className="prose prose-invert" // Tailwind typography class
    >
      {content}
    </ReactMarkdown>
  );
};

export default RenderMarkdownAndLatex;
