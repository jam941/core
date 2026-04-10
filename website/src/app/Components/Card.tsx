import React, { useState, type ReactNode } from 'react';
import { Job } from '../Interfaces/CardType';
import { JobType } from '../Interfaces/JobTypeEnum';

const MD_INLINE =
  /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|~~(.+?)~~|\[([^\]]+)\]\(([^)]+)\))/g;

function renderInlineMarkdown(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const m of text.matchAll(MD_INLINE)) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));

    if (m[2] !== undefined)
      parts.push(<strong key={key}><em>{m[2]}</em></strong>);
    else if (m[3] !== undefined)
      parts.push(<strong key={key}>{m[3]}</strong>);
    else if (m[4] !== undefined)
      parts.push(<em key={key}>{m[4]}</em>);
    else if (m[5] !== undefined)
      parts.push(
        <code key={key} style={{ background: 'var(--color-code-bg, rgba(135,131,120,0.15))', padding: '2px 4px', borderRadius: '3px', fontSize: '0.9em' }}>
          {m[5]}
        </code>,
      );
    else if (m[6] !== undefined)
      parts.push(<del key={key}>{m[6]}</del>);
    else if (m[7] !== undefined && m[8] !== undefined)
      parts.push(
        <a key={key} href={m[8]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
          {m[7]}
        </a>,
      );

    key++;
    lastIndex = m.index + m[0].length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length <= 1 ? parts[0] ?? '' : <>{parts}</>;
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

  const getDescList = () => {
    const lines = data.Description.split('\n');
    const bulletPoints: Array<{ main: string; sub: string[] }> = [];

    let currentMain = '';
    let currentSubs: string[] = [];

    for (const line of lines) {
      if (line.startsWith('### ') || line.startsWith('  - ') || line.startsWith('  * ')) {
        const text = line.replace(/^(?:### |  [-*] )/, '').trim();
        if (text) currentSubs.push(text);

      } else if (line.startsWith('## ') || line.startsWith('- ') || line.startsWith('* ')) {
        if (currentMain) bulletPoints.push({ main: currentMain, sub: currentSubs });
        currentMain = line.replace(/^(?:## |[-*] )/, '').trim();
        currentSubs = [];
        
      } else if (line.trim()) {
        if (currentMain) bulletPoints.push({ main: currentMain, sub: currentSubs });
        currentMain = line.trim();
        currentSubs = [];
      }
    }

    if (currentMain) {
      bulletPoints.push({ main: currentMain, sub: currentSubs });
    }

    return (
      <ul
        style={{
          listStyleType: 'disc',
          paddingLeft: '16px',
          margin: '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        }}
      >
        {bulletPoints.map((point, index) => (
          <li
            key={index}
            style={{
              fontSize: '14px',
              lineHeight: '1.5',
              color: 'var(--color-text-muted)',
              marginBottom: '2px',
              textAlign: 'left',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            }}
          >
            {renderInlineMarkdown(point.main)}
            {point.sub.length > 0 && (
              <ul
                style={{
                  listStyleType: 'circle',
                  paddingLeft: '20px',
                  margin: '4px 0 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {point.sub.map((subPoint, subIndex) => (
                  <li
                    key={subIndex}
                    style={{
                      fontSize: '13px',
                      lineHeight: '1.4',
                      color: 'var(--color-text-subtle)',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                    }}
                  >
                    {renderInlineMarkdown(subPoint)}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

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
              getDescList()
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
