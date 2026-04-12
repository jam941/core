import React, { useState, type CSSProperties } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Job } from '../Interfaces/CardType';
import { JobType } from '../Interfaces/JobTypeEnum';

const DESC_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';

const descText: CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.5,
  color: 'var(--color-text-muted)',
  fontFamily: DESC_FONT,
  textAlign: 'left',
};

const jobDescriptionMarkdownComponents: Components = {
  p: ({ children }) => (
    <p style={{ ...descText, margin: '0 0 8px 0' }}>{children}</p>
  ),
  h1: ({ children }) => (
    <h1 style={{ ...descText, fontSize: '1.15rem', margin: '10px 0 6px 0', color: 'var(--color-text)' }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ ...descText, fontSize: '1.05rem', margin: '10px 0 6px 0', color: 'var(--color-text)' }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ ...descText, fontSize: '0.98rem', margin: '8px 0 4px 0', color: 'var(--color-text-muted)' }}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 style={{ ...descText, fontSize: '0.95rem', margin: '8px 0 4px 0', color: 'var(--color-text-muted)' }}>{children}</h4>
  ),
  ul: ({ children }) => (
    <ul
      style={{
        ...descText,
        listStyleType: 'disc',
        paddingLeft: '18px',
        margin: '0 0 8px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        ...descText,
        paddingLeft: '20px',
        margin: '0 0 8px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }) => (
    <li className={className} style={{ ...descText, fontSize: '14px', color: 'var(--color-text-muted)' }} {...props}>
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    if (className?.includes('language-')) {
      return (
        <code
          className={className}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '12px',
          }}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        style={{
          background: 'var(--color-code-bg, rgba(135,131,120,0.15))',
          padding: '2px 4px',
          borderRadius: '3px',
          fontSize: '0.9em',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre
      style={{
        margin: '6px 0',
        overflowX: 'auto',
        background: 'var(--color-code-bg, rgba(135,131,120,0.12))',
        padding: '10px 12px',
        borderRadius: '6px',
      }}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        margin: '6px 0 8px 0',
        paddingLeft: '12px',
        borderLeft: '3px solid var(--color-border)',
        color: 'var(--color-text-subtle)',
      }}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '10px 0' }} />,
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '8px 0' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          fontSize: '13px',
          fontFamily: DESC_FONT,
          color: 'var(--color-text-muted)',
        }}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th
      style={{
        border: '1px solid var(--color-border)',
        padding: '6px 8px',
        textAlign: 'left',
        background: 'var(--card-inner-bg)',
        fontWeight: 600,
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ border: '1px solid var(--color-border)', padding: '6px 8px', verticalAlign: 'top' }}>
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element -- Notion uses arbitrary external image URLs
    <img
      src={src ?? ''}
      alt={alt ?? ''}
      style={{ maxWidth: '100%', height: 'auto', borderRadius: '6px', margin: '6px 0' }}
    />
  ),
  input: ({ type, checked, ...props }) => {
    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={Boolean(checked)}
          onChange={() => {}}
          style={{ marginRight: '6px', cursor: 'default' }}
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },
};

function JobDescriptionMarkdown({ markdown }: { markdown: string }) {
  if (!markdown.trim()) return null;
  return (
    <div style={descText}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={jobDescriptionMarkdownComponents}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

interface CardProps {
  data: Job;
  onSkillClick: (skill: string) => void;
  activeFilters: string[];
  isAnimatingOut: boolean;
}

function accentColorForJobType(type: JobType): string {
  switch (type) {
    case JobType.Internship:
      return '#10B981';
    case JobType.FullTime:
      return '#3B82F6';
    case JobType.Project:
      return '#EF4444';
    default:
      return '#6B7280';
  }
}

const Card = ({ data, onSkillClick, activeFilters, isAnimatingOut }: CardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDetail = (open: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(open);
  };

  const handleSkillClick = (skill: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSkillClick(skill);
  };

  const borderAccent = accentColorForJobType(data.Type as JobType);

  const renderSkills = () => {
    if (!data.Skills) return null;

    const skills = data.Skills.split(',').map((skill) => skill.trim());

    return skills.map((skill, index) => {
      const isActive = activeFilters.some((filter) => {
        if (filter.toLowerCase() === skill.toLowerCase()) {
          return true;
        }

        const mappings: { [key: string]: string[] } = {
          javascript: ['javascript', 'js', 'typescript', 'ts'],
          react: ['react', 'reactjs', 'react.js'],
          vue: ['vue', 'vuejs', 'vue.js'],
          python: ['python', 'py'],
          javac: ['java'],
          frontend: ['html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular'],
          backend: ['node', 'express', 'django', 'flask', 'spring', 'java', 'php'],
          cloud: ['aws', 'azure', 'gcp', 'cloud'],
          ml: ['machine learning', 'tensorflow', 'pytorch', 'keras'],
          testing: ['jest', 'mocha', 'cypress', 'selenium'],
        };

        return Object.entries(mappings).some(([key, values]) => {
          return filter === key && values.includes(skill.toLowerCase());
        });
      });

      const skillButtonStyle: React.CSSProperties = {
        display: 'inline-block',
        border: isActive ? `1px solid var(--skill-border-active)` : `1px solid var(--skill-border)`,
        padding: '4px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        color: isActive ? 'var(--skill-fg-active)' : 'var(--skill-fg)',
        background: isActive ? 'var(--skill-bg-active)' : 'var(--skill-bg)',
        transition: 'all 0.2s',
        cursor: 'pointer',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      };

      return (
        <button key={index} type="button" onClick={(e) => handleSkillClick(skill, e)} style={skillButtonStyle}>
          {skill}
        </button>
      );
    });
  };

  return (
    <React.Fragment>
      <div
        style={{
          marginTop: '16px',
          width: '100%',
          backgroundColor: 'var(--card-inner-bg)',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          transform: 'translateY(0)',
          transition: 'all 0.3s',
          overflow: 'hidden',
          borderLeft: `4px solid ${borderAccent}`,
          animation: isAnimatingOut ? 'card-fade-out 0.4s forwards' : 'card-fade-in 0.5s',
        }}
      >
        <div
          style={{
            background: 'var(--card-inner-bg)',
            padding: '12px 16px',
            borderBottom: '1px solid var(--card-header-border)',
          }}
        >
          <div className="card-header-row">
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text)',
                fontWeight: 'bold',
                margin: '0',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              }}
            >
              {data.Title}
            </p>
            <p
              className="card-header-center"
              style={{
                fontSize: '13px',
                color: 'var(--color-text)',
                margin: '0',
                textAlign: 'center',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              }}
            >
              {data.Type} · {data.Company}
            </p>
            <p
              className="card-header-right"
              style={{
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                margin: '0',
                textAlign: 'right',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              }}
            >
              {data.StartDate} - {data.EndDate}
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '12px 16px',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div style={{ flex: 1 }}>
            {!isOpen ? (
              <JobDescriptionMarkdown markdown={data.Description} />
            ) : (
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: 'var(--color-text-muted)',
                  margin: '0',
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                }}
              >
                {data.Brief}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '12px',
              marginBottom: '4px',
            }}
          >
            <button
              type="button"
              style={{
                display: 'inline-block',
                border: '1px solid var(--color-accent)',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--color-accent)',
                background: 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              }}
              onClick={(e) => toggleDetail(!isOpen, e)}
            >
              {isOpen ? 'Show More' : 'Show Less'}
            </button>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--card-header-border)',
            padding: '12px 16px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            }}
          >
            <div
              style={{
                marginBottom: '6px',
                fontWeight: 600,
                color: 'var(--color-text-subtle)',
              }}
            >
              Skills:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{renderSkills()}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Card;
