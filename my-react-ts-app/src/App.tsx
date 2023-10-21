import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Card from './Components/Card';
import getJobs from './Services/GetJobs';
import { Job } from './Interfaces/CardType';
import { AxiosResponse } from 'axios';
import Bio from './Components/Bio';




function App() {
  
  
  

  const [jobs,setJobs] = useState([]);
  const [stringData,setStringData] = useState("")

  async function  popJobs(){
     getJobs().then(e=>{
      var data = e.data.data
      setJobs(data)
      var ble = JSON.stringify({data});
      setStringData(ble)
     });
  }

  const [filter,setFilter] = useState("");

  

  const changeFilter = (e :string)=>{

      if(filter === e){
        setJobs(JSON.parse(stringData).data)
        setFilter("")
      }
      else{
        setFilter(e)
        var tempJobs = JSON.parse(stringData).data;
         tempJobs = tempJobs.filter((item: any)=>{
          
            return item.meta.includes(e)
          
          })
          setJobs(tempJobs)
      }
      
    

  }

  const [start,setStart] = useState(()=>{
    popJobs();
  })
  
  //Spinner provided by https://codepen.io/GeoffreyCrofte/pen/nPPVpz
  const getSpinner = ()=>{return (<span className="ouro">
    <span className="left"><span className="anim"></span></span>
    <span className="right"><span className="anim"></span></span>
    </span>)
  }
  if(stringData.length == 0){
    return getSpinner();
  }
  return (

    <div className="dark flex canvas max-h-screen">
      <div className="w-1/3 ml-10p">
          <Bio/>
      </div>
      <div>
      <button
      className={`border border-white p-2 rounded-lg shadow-md  
                  ${filter==="ml" ? 'bg-transparent text-white' : 'bg-gray-200'}`}
      onClick={() => changeFilter("ml")}
    >
      Machine Learning
    </button>
      </div>
      <div className="w-1/3"></div> {/* Spacer div */}
      
      <div className="w-1/3 dark mr-10p right overflow-y-auto">
        <div className="py-5 px-10p">
          {jobs && jobs.map((item, index) => <Card key={index} data={item} />)}
        </div>
      </div>
      
    </div>
  );
  //<div className="w-1/2 space-y-1 ">
}

export default App;
