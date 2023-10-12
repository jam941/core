import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Card from './Components/Card';
import getJobs from './Services/GetJobs';
import { Job } from './Interfaces/CardType';
import { AxiosResponse } from 'axios';




function App() {
  
  
  
  const [jobs,setJobs] = useState();
  
  async function  popJobs(){
     getJobs().then(e=>{
      setJobs(e.data.data)
     });
  }

  const [start,setStart] = useState(()=>{
    popJobs();
  })
  

  return (
    <div className="App">
      <header className="App-header">
        <Card data = {jobs}/>
      </header>
      
    </div>
  );
}

export default App;
