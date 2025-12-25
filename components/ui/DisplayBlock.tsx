import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function DisplayBlock({ title, description, code }: { title: string; description: string; code?: string }) {
  return (
    <div className="rounded-lg border border-white/10 p-3" style={{ backgroundColor: 'rgb(54 55 69 / 48%)' }}>
      <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-2 text-sm leading-relaxed text-gray-300">{description}</p>
      {code && (
        <div className="overflow-hidden rounded-md border border-white/10">
          <SyntaxHighlighter
            language="ts"
            style={tomorrow}
            customStyle={{
              margin: 0,
              padding: '10px',
              fontSize: '0.7rem',
              background: 'rgba(0,0,0,0.6)',
            }}>
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
