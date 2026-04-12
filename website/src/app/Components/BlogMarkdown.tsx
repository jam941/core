import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="blog-md prose-site">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
