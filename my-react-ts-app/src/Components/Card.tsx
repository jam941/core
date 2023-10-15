import { useState } from 'react';
import {Job} from '../Interfaces/CardType';

function Card(props: any){

    const [isOpen,setOpen] = useState(true);

    var data = props.data;
    
    
    const toggleDetail = (openStatus: boolean, event:any)=>{
        setOpen(openStatus)
        event.preventDefault()
    }

    const getDescList = ()=>{
        var desc = data.Description.split("##").slice(1)
        console.log(desc)
        //<p className="text-sm leading-tight text-white">{data.Description}</p>
        return (<ul className="list-disc pl-4">

                    {desc.map((item: any, index: any) => (<li className="text-sm leading-tight text-white mb-1 text-left" key={index}>{item}</li>))} 

                </ul>)
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
        <div className={`border-l-4 ${getColor()}  max-w-md  mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl min-w-full`} >
            <div className="bg-gray-700 p-4 flex items-center justify-between space-x-4">
            <p className="text-sm text-white font-bold">{data.Type}</p>
                <p className="text-sm text-white font-bold">{data.Company}</p>
                <h3 className="text-sm text-white leading-tight font-medium">{data.Title}</h3>
                <p className="text-sm text-white">{data.StartDate} - {data.EndDate}</p>
            </div>
            <div className="p-4">
                {!isOpen ? 
                 getDescList():
                <p className="text-sm leading-tight text-white">{data.Brief}</p> }
                {isOpen ? 
                <button className="underline italic inline-block text-white px-2 py-1 rounded-full text-xs font-semibold tracking-wide" onClick={(e)=>toggleDetail(false,e)}>Show More</button>:
                <button className="underline italic inline-block text-white px-2 py-1 rounded-full text-xs font-semibold tracking-wide" onClick={(e)=>toggleDetail(true,e)}>Show Less</button>}
            </div>
            <div className="bg-gray-900 p-4">
                <p className="text-sm text-white">Skills: {data.Skills}</p>
            </div>
        </div>
        
        
            
   
    )
}
export default Card;