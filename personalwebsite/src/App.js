import logo from './logo.svg';
import './App.css';
import Card from './Components/card';
import axios from 'axios';
import getJobs from './Services/work';
import React, { useEffect, useState } from 'react';

//import PublicGoogleSheetsParser from 'public-google-sheets-parser'

function App() {
  const [cards, setCards] = useState(['Fuck'])
  useEffect(()=>{
    getJobs().then(e=>setCards(e.data.data))
   
  },[])
  
  
  const cardBox = cards.map((item,index)=>{
    return <Card {...item}></Card>
  })

  return (
    <div>
    {cards.length>0 ? 
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. Personal website
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        
      
      </header>
      
      {cardBox}
          
      
      
    </div>
    : <p>Problem</p>}
    </div>
  );
}

export default App;
