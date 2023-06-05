import React from 'react';
import '../Styles/card.css'
const Card = (props) => {
    
    const { Type,Company,Duration,Title } = props;
    
    return (
      <div class= "card">
        <div class="type">{Type}</div>
        <div class="company">{Company}</div>
        <div class="duration">{Duration}</div>
        <div class="title">{Title}</div>
      </div>
    );
}


export default Card;
