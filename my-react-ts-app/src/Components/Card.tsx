import {Job} from '../Interfaces/CardType';

function Card(props: any){
    var data = props.data
    if(!data){
        return(<div></div>);
    }
    data = data[0]
    return(
        

        
        
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="bg-gray-700 p-4 flex items-center justify-between space-x-4">
                <span className="inline-block bg-blue-700 text-blue-300 px-2 py-1 rounded-full text-sm font-semibold tracking-wide">{data.Type}</span>
                <p className="text-sm text-white font-bold">{data.Company}</p>
                <h3 className="text-sm leading-tight font-medium text-white">{data.Title}</h3>
                <p className="text-sm text-gray-400">{data.StartDate} - {data.EndDate}</p>
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