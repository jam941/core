import React, { useState } from 'react';
import {Job} from '../Interfaces/CardType';

interface CardProps {
    data: Job;
}

function Card(props: CardProps){

    const [isOpen,setOpen] = useState(true);

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
                    <li className="text-sm leading-tight text-white mb-1 text-left hover:text-blue-200 transition-colors duration-200" key={index}>
                        {item}
                    </li>
                ))} 
            </ul>
        )
    }
    
    const getColor = ()=>{
        var color = data.Color.toLowerCase();
        if(color == "red"){
            return "border-red-500"
        }
        else if(color == 'blue'){
            return "border-blue-500" 
        }
    }
    

    return(
        <React.Fragment>
        <div className={`dark border-l-4 ${getColor()} mt-4 w-full mx-auto bg-card-bg rounded-2xl shadow-card hover:shadow-hover transform hover:-translate-y-1 transition-all duration-300 overflow-hidden md:max-w-2xl`}>
            <div className="bg-card-header p-4 flex items-center justify-between space-x-4">
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
                <button className="mt-3 inline-block text-blue-300 hover:text-blue-200 transition-colors duration-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-blue-500 hover:border-blue-400" onClick={(e)=>toggleDetail(false,e)}>Show More</button>:
                <button className="mt-3 inline-block text-blue-300 hover:text-blue-200 transition-colors duration-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-blue-500 hover:border-blue-400" onClick={(e)=>toggleDetail(true,e)}>Show Less</button>}
            </div>
            <div className="bg-card-footer p-4">
                <p className="text-sm text-white">
                    <span className="font-semibold">Skills:</span> 
                    <span className="ml-2">{data.Skills}</span>
                </p>
            </div>
        </div>
        </React.Fragment>
    )
}
export default Card;