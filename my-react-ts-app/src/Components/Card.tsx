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

    const animationClass = isAnimatingOut ? 'card-exit' : 'card-enter';

    const getDescList = ()=>{
        var desc = data.Description.split("##").slice(1)
        console.log(desc)
        return (
            <ul className="list-disc pl-4 space-y-2">
                {desc.map((item: string, index: number) => (
                    <li className="text-sm leading-tight text-white mb-1 text-left hover:text-primary-light transition-colors duration-200" key={index}>
                        {item}
                    </li>
                ))} 
            </ul>
        )
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
            
            return (
                <button
                    key={index}
                    onClick={(e) => handleSkillClick(skill, e)}
                    className={`skill-button mr-2 mb-1 inline-block px-2 py-1 rounded-full text-xs font-semibold tracking-wide border ${
                        isActive 
                            ? 'skill-button-active text-white border-primary' 
                            : 'text-primary-light border-primary-light hover:text-white hover:border-primary'
                    } transition-all duration-300`}
                >
                    {skill}
                </button>
            );
        });
    };

    return(
        <React.Fragment>
        <div 
            className={`${animationClass} card-gradient ${getColor()} mt-4 w-full mx-auto bg-card-bg rounded-2xl shadow-card hover:shadow-hover transform hover:-translate-y-1 transition-all duration-300 overflow-hidden md:max-w-2xl`}
        >
            {/* Card header - Responsive layout */}
            <div className="bg-gradient-to-r from-card-header to-card-header/80 p-3 md:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs md:text-sm text-white font-bold">{data.Type}</p>
                    <p className="text-xs md:text-sm text-white font-bold">{data.Company}</p>
                    <h3 className="text-xs md:text-sm text-white leading-tight font-medium w-full md:w-auto order-first md:order-none mb-2 md:mb-0">{data.Title}</h3>
                    <p className="text-xs md:text-sm text-white">{data.StartDate} - {data.EndDate}</p>
                </div>
            </div>
            
            {/* Card body */}
            <div className="p-4 md:p-6 transition-all duration-300">
                {!isOpen ? 
                getDescList() : 
                <p className="text-sm leading-tight text-white">{data.Brief}</p> }
                
                <button 
                    className="filter-button mt-3 inline-block text-primary-light hover:text-white transition-colors duration-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-primary-light hover:border-primary shadow-button hover:shadow-button-hover" 
                    onClick={(e) => toggleDetail(!isOpen, e)}
                >
                    {isOpen ? 'Show More' : 'Show Less'}
                </button>
            </div>
            
            {/* Card footer with skills */}
            <div className="bg-gradient-to-r from-card-footer to-card-footer/90 p-3 md:p-4">
                <div className="text-sm text-white">
                    <span className="font-semibold">Skills:</span> 
                    <div className="flex flex-wrap mt-2">
                        {renderSkills()}
                    </div>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
};

export default Card;