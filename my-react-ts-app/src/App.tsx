import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Card from './Components/Card';
import data from './Data/data.json'
import { Job } from './Interfaces/CardType';
import { AxiosResponse } from 'axios';
import Bio from './Components/Bio';




function App() {
  
  
  

  const [jobs,setJobs] = useState(data);
  const [stringData,setStringData] = useState(JSON.stringify({data}))

  

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
    
  })
  
  const filterButton = (testFilter:any, title:string,metaShort:string)=>{
    var isDisplayed = testFilter===metaShort;
    var style = "inline-block border border-white p-2 rounded-lg shadow-md text-xs font-semibold tracking-wide "
    isDisplayed ? style+="bg-buttonOn":style+="bg-transparent text-white"
    return(
    <button
      className={style}
      onClick={() => changeFilter(metaShort)}
    >
      {title}
    </button>)
  } 

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

    <div className="dark flex flex-col md:flex-row canvas max-h-screen max-v-screen w-screen h-screen min-h-screen bg-fixed bg-cover bg-background p-6">
      <div className="w-full md:w-2/5 px-6">
          <Bio/>
      </div>
      
      <div className="hidden md:block md:w-1/5 flex items-center justify-center">
        <div className="h-4/5 w-px bg-gray-700 opacity-30 mx-auto"></div>
      </div> {/* Subtle divider instead of empty space */}
      
      <div className="flex flex-col mt-10 space-y-4 w-full md:w-2/5 canvas px-6">

        <div className="text-white space-x-1 space-y-1 hidden md:block">
          {filterButton(filter,"Machine Learning  / AI", "ml")}
          {filterButton(filter,"Frontend Development", "frontend")}
          {filterButton(filter,"Backend Development", "backend")}
          {filterButton(filter,"Cloud / AWS", "cloud")}
          {filterButton(filter,"Testing", "testing")}
          {filterButton(filter,"Java", "javac")}
          {filterButton(filter,"Javascript / Typescript", "javascript")}
          {filterButton(filter,"Vue", "vue")}
          {filterButton(filter,"React", "react")}
          {filterButton(filter,"Python", "python")}
          {filterButton(filter,"C#", "c#")}
        </div>

        <div className="flex-1 pt-1 dark md:overflow-y-auto canvas">
          <div className="py-5">
            {jobs && jobs.map((item, index) => <Card key={index} data={item} />)}
          </div>
        </div>
      </div>
      
      
    </div>
  );
  //<div className="w-1/2 space-y-1 ">
}

export default App;
