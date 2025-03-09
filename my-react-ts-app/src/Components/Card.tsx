import React, { useState, useEffect } from 'react';
import {Job} from '../Interfaces/CardType';

interface CardProps {
    data: Job;
    onSkillClick: (skill: string) => void;
    activeFilters: string[];
    isAnimatingOut?: boolean;
}

function Card(props: CardProps){

    const [isOpen,setOpen] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [animationClass, setAnimationClass] = useState('card-animation');

    useEffect(() => {
        if (props.isAnimatingOut) {
            setAnimationClass('card-animation card-exit');
        } else {
            setAnimationClass('card-animation card-enter');
        }
    }, [props.isAnimatingOut]);

    var data = props.data;
    
    
    const toggleDetail = (openStatus: boolean, event: React.MouseEvent<HTMLButtonElement>)=>{
        setOpen(openStatus)
        event.preventDefault()
    }

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
    
    const getColor = ()=>{
        var color = data.Color.toLowerCase();
        if(color == "red"){
            return "card-red"
        }
        else if(color == 'blue'){
            return "card-blue" 
        }
    }
    
    const handleSkillClick = (skill: string) => {
        props.onSkillClick(skill);
    }

    const renderSkills = () => {
        if (!data.Skills) return null;
        
        const skills = data.Skills.split(',').map(skill => skill.trim());
        
        return skills.map((skill, index) => {
            const skillLower = skill.toLowerCase();
            const isActive = props.activeFilters.some(filter => 
                filter === skillLower || 
                (skillLower.includes(' ') && skillLower.split(' ').includes(filter))
            );
            
            return (
                <button 
                    key={index}
                    onClick={() => handleSkillClick(skill)}
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
    }

    return(
        <React.Fragment>
        <div 
            className={`${animationClass} dark card-gradient ${getColor()} mt-4 w-full mx-auto bg-card-bg rounded-2xl shadow-card hover:shadow-hover transform hover:-translate-y-1 transition-all duration-300 overflow-hidden md:max-w-2xl`}
        >
            <div className="bg-gradient-to-r from-card-header to-card-header/80 p-4 flex items-center justify-between space-x-4">
                <p className="text-sm text-white font-bold">{data.Type}</p>
                <p className="text-sm text-white font-bold">{data.Company}</p>
                <h3 className="text-sm text-white leading-tight font-medium hidden md:block">{data.Title}</h3>
                <p className="text-sm text-white">{data.StartDate} - {data.EndDate}</p>
            </div>
            <div className="p-6 transition-all duration-300">
                {!isOpen ? 
                 getDescList():
                <p className="text-sm leading-tight text-white">{data.Brief}</p> }
                
                {isOpen ? 
                <button className="filter-button mt-3 inline-block text-primary-light hover:text-white transition-colors duration-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-primary-light hover:border-primary shadow-button hover:shadow-button-hover" onClick={(e)=>toggleDetail(false,e)}>Show More</button>:
                <button className="filter-button mt-3 inline-block text-primary-light hover:text-white transition-colors duration-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-primary-light hover:border-primary shadow-button hover:shadow-button-hover" onClick={(e)=>toggleDetail(true,e)}>Show Less</button>}
            </div>
            <div className="bg-gradient-to-r from-card-footer to-card-footer/90 p-4">
                <div className="text-sm text-white">
                    <span className="font-semibold">Skills:</span> 
                    <div className="flex flex-wrap mt-2">
                        {renderSkills()}
                    </div>
                </div>
            </div>
        </div>
        </React.Fragment>
    )
}
export default Card;