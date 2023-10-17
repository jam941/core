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
  
  async function  popJobs(){
     getJobs().then(e=>{
      setJobs(e.data.data)
     });
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
  if(jobs.length == 0){
    return getSpinner();
  }
  return (

    <div className="flex canvas">
      <div className="w-1/4 h-screen overflow-hidden">
          <Bio/>
      </div>
      <div className="w-1/5"></div> {/* Spacer div */}
      <div className="w-1/3 overflow-y-scroll">
          {jobs && jobs.map((item, index) => <Card key={index} data={item} />)}
      </div>
    </div>
  );
  //<div className="w-1/2 space-y-1 ">
}

export default App;
