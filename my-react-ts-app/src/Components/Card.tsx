import {Job} from '../Interfaces/CardType';

function Card(props: any){
    var data = props.data
    if(!data){
        return(<div></div>);
    }
    
    var type = data.Type == "Internship";
    return(
        <div className={`border-l-4 ${type ? 'border-blue-500' : 'border-red-500'} max-w-md mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl`}>
            <div className="bg-gray-700 p-4 flex items-center justify-between space-x-4">
                <p className="text-sm text-white font-bold">{data.Company}</p>
                <h3 className="text-sm leading-tight font-medium">{data.Title}</h3>
                <p className="text-sm">{data.StartDate} - {data.EndDate}</p>
            </div>
            <div className="p-4">
                <p className="text-sm leading-tight text-white">{data.Description}</p>
            </div>
            <div className="bg-gray-900 p-4">
                <p className="text-sm text-gray-400">Skills: {data.Skills}</p>
            </div>
        </div>
        
        
            
   
    )
}
export default Card;