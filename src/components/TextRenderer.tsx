import React from "react";

// Function to handle bold, italic, and links
const renderMarkdown = (text: string) => {
  // Render bold text (using **bold** or __bold__)
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.*?)__/g, "<strong>$1</strong>"); // Support for __bold__

  // Render italic text (using *italic* or _italic_)
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.*?)_/g, "<em>$1</em>"); // Support for _italic_

  // Render links [text](url) and style them
  text = text.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="link">$1</a>'
  );

  return text;
};

// Component to display the formatted content
const PostRenderer = ({ content }: { content: string }) => {
  // Split the content into paragraphs
  const paragraphs = content
    .split("\n")
    .map((line, index) => (
      <p
        className="mt-5"
        key={index}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(line) }}
      />
    ));

  return <div>{paragraphs}</div>;
};

export default PostRenderer;
