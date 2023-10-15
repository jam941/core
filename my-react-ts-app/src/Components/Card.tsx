import { useState } from 'react';
import {Job} from '../Interfaces/CardType';

function Card(props: any){

    const [isOpen,setOpen] = useState(false);

    var data = props.data;
    if(!data.Color){
        return(<div></div>);
    }
    
    const toggleDetail = (openStatus: boolean)=>{
        setOpen(openStatus)
    }
    var color = data.Color.toLowerCase();
    return(
        <div className={`border-l-4 border-${color}-500  max-w-md  mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl min-w-full`} >
            <div className="bg-gray-700 p-4 flex items-center justify-between space-x-4">
            <p className="text-sm text-white font-bold">{data.Type}</p>
                <p className="text-sm text-white font-bold">{data.Company}</p>
                <h3 className="text-sm text-white leading-tight font-medium">{data.Title}</h3>
                <p className="text-sm text-white">{data.StartDate} - {data.EndDate}</p>
            </div>
            <div className="p-4">
                {isOpen ? 
                <p className="text-sm leading-tight text-white">{data.Description}</p> :
                <p className="text-sm leading-tight text-white">{data.Brief}</p> }
                {isOpen ? 
                <p className="inline-block bg-blue-700 text-white px-2 py-1 rounded-full text-sm font-semibold tracking-wide" onClick={()=>toggleDetail(false)}>Details</p> :
                <p className="inline-block bg-blue-700 text-white px-2 py-1 rounded-full text-sm font-semibold tracking-wide" onClick={()=>toggleDetail(true)}>Hide</p> }
            </div>
            <div className="bg-gray-900 p-4">
                <p className="text-sm text-white">Skills: {data.Skills}</p>
            </div>
        </div>
        
        
            
   
    )
}
export default Card;