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
  
  const filterButton = (testFilter:any, title:string,metaShort:string)=>{
    var isDisplayed = testFilter===metaShort;
    var style = "border border-white p-2 rounded-lg shadow-md "
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

    <div className="dark flex canvas max-h-screen">
      <div className="w-1/3 ml-10p">
          <Bio/>
      </div>
      <div className="text-white">
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
