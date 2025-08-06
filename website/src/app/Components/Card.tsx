import React, { useState } from 'react';
import { Job } from '../Interfaces/CardType';

interface CardProps {
    data: Job;
    onSkillClick: (skill: string) => void;
    activeFilters: string[];
    isAnimatingOut: boolean;
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

    const getColor = () => {
        const color = data.Color?.toLowerCase();
        
        if (color === "red") {
            return "card-red";
        } else if (color === "blue") {
            return "card-blue";
        } else {
            const typeColors = {
                "Internship": "border-blue-500",
                "Part Time": "border-green-500",
                "Full Time": "border-purple-500",
                "Contract": "border-yellow-500",
                "Freelance": "border-red-500",
                "Open Source": "border-indigo-500"
            };
            
            return typeColors[data.Type as keyof typeof typeColors] || "border-gray-500";
        }
    };

    const getDescList = () => {
        const lines = data.Description.split('\n');
        const bulletPoints: Array<{main: string, sub: string[]}> = [];
        
        let currentMain = '';
        let currentSubs: string[] = [];
        
        for (const line of lines) {
            if (line.startsWith('## ')) {
                if (currentMain) {
                    bulletPoints.push({ main: currentMain, sub: currentSubs });
                }
                currentMain = line.substring(3).trim();
                currentSubs = [];
            } else if (line.startsWith('### ')) {
                currentSubs.push(line.substring(4).trim());
            }
        }
        
        if (currentMain) {
            bulletPoints.push({ main: currentMain, sub: currentSubs });
        }
        
        return (
            <ul style={{ 
                listStyleType: 'disc', 
                paddingLeft: '16px',
                margin: '0',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
            }}>
                {bulletPoints.map((point, index) => (
                    <li key={index} style={{
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: '#e2e8f0',
                        marginBottom: '2px',
                        textAlign: 'left',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
                    }}>
                        {point.main}
                        {point.sub.length > 0 && (
                            <ul style={{
                                listStyleType: 'circle',
                                paddingLeft: '20px',
                                margin: '4px 0 0 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                            }}>
                                {point.sub.map((subPoint, subIndex) => (
                                    <li key={subIndex} style={{
                                        fontSize: '13px',
                                        lineHeight: '1.4',
                                        color: '#cbd5e1',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
                                    }}>
                                        {subPoint}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        );
    }

    const renderSkills = () => {
        if (!data.Skills) return null;
        
        const skills = data.Skills.split(',').map(skill => skill.trim());
        
        return skills.map((skill, index) => {
            const isActive = activeFilters.some(filter => {
                if (filter.toLowerCase() === skill.toLowerCase()) {
                    return true;
                }
                
                const mappings: {[key: string]: string[]} = {
                    'javascript': ['javascript', 'js', 'typescript', 'ts'],
                    'react': ['react', 'reactjs', 'react.js'],
                    'vue': ['vue', 'vuejs', 'vue.js'],
                    'python': ['python', 'py'],
                    'javac': ['java'],
                    'frontend': ['html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular'],
                    'backend': ['node', 'express', 'django', 'flask', 'spring', 'java', 'php'],
                    'cloud': ['aws', 'azure', 'gcp', 'cloud'],
                    'ml': ['machine learning', 'tensorflow', 'pytorch', 'keras'],
                    'testing': ['jest', 'mocha', 'cypress', 'selenium']
                };
                
                return Object.entries(mappings).some(([key, values]) => {
                    return filter === key && values.includes(skill.toLowerCase());
                });
            });
            
            const skillButtonStyle = {
                display: 'inline-block',
                border: isActive ? '1px solid #3B82F6' : '1px solid #3e4758',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                color: isActive ? '#3B82F6' : '#d1d5db',
                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
            };
            
            return (
                <button
                    key={index}
                    onClick={(e) => handleSkillClick(skill, e)}
                    style={skillButtonStyle}
                >
                    {skill}
                </button>
            );
        });
    };

    return(
        <React.Fragment>
        <div style={{
            marginTop: '16px',
            width: '100%',
            backgroundColor: '#1e2127',
            borderRadius: '8px',
            border: '1px solid #2a2e38',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(0)',
            transition: 'all 0.3s',
            overflow: 'hidden',
            borderLeft: `4px solid ${getColor().startsWith('border-') ? getColor().replace('border-', '') : '#3B82F6'}`,
            animation: isAnimatingOut ? 'card-fade-out 0.4s forwards' : 'card-fade-in 0.5s'
        }}>
            {/* Card header */}
            <div style={{
                background: '#1e2127',
                padding: '12px 16px',
                borderBottom: '1px solid #2a2e38'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <p style={{ 
                        fontSize: '13px', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        margin: '0',
                        width: '33%',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
                    }}>{data.Title}</p>
                    <p style={{ 
                        fontSize: '13px', 
                        color: 'white', 
                        margin: '0',
                        width: '33%',
                        textAlign: 'center',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
                    }}>{data.Type} · {data.Company}</p>
                    <p style={{ 
                        fontSize: '13px', 
                        color: '#d1d5db', 
                        margin: '0',
                        width: '33%',
                        textAlign: 'right',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
                    }}>{data.StartDate} - {data.EndDate}</p>
                </div>
            </div>
            
            {/* Card body */}
            <div style={{ 
                padding: '12px 16px', 
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}>
                <div style={{ flex: 1 }}>
                    {!isOpen ? 
                    getDescList() : 
                    <p style={{ 
                        fontSize: '14px', 
                        lineHeight: '1.5', 
                        color: '#e2e8f0',
                        margin: '0',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
                    }}>{data.Brief}</p> }
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    marginTop: '12px',
                    marginBottom: '4px'
                }}>
                    <button 
                        style={{
                          display: 'inline-block',
                          border: '1px solid #3B82F6',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#3B82F6',
                          background: 'transparent',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
                        }}
                        onClick={(e) => toggleDetail(!isOpen, e)}
                    >
                        {isOpen ? 'Show More' : 'Show Less'}
                    </button>
                </div>
            </div>
            
            {/* Card footer with skills */}
            <div style={{
                borderTop: '1px solid #2a2e38',
                padding: '12px 16px'
            }}>
                <div style={{ 
                    fontSize: '13px', 
                    color: '#e2e8f0',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
                }}>
                    <div style={{ 
                        marginBottom: '6px',
                        fontWeight: '600',
                        color: '#d1d5db'
                    }}>Skills:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {renderSkills()}
                    </div>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
};

export default Card;