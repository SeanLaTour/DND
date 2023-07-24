import React, { useEffect, useState } from "react"

const GamePage = () => {
    const [map, setMap]: any = React.useState("")
    const [characters, setCharacters] = React.useState([])
    const [characterElements, setCharacterElements] = React.useState([])

    useEffect(() => {
        const storageCharacters = JSON.parse(window.localStorage.getItem("characters")!)
        const storageMap = window.localStorage.getItem("map")!
        setMap(storageMap)
        setCharacters(storageCharacters)
        setCharacterElements(characterGenerate(characters))
        setTimeout(() => {
            addEventListenersToCharacters(characters)!
        }, 1000);
        console.log("hey")
    },[map])

  
    return (
      <div style={{width: "100vw", height: "100vh", backgroundImage: `url("${map}")`, backgroundSize: "100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
          {characterElements}
      </div>
    )
  }

  const characterGenerate = (characters: any) => {
      console.log(characters)
    return characters.map((element: any, index: number) => {
        return(
            <div id={element.id} style={{borderRadius: "5px", padding: "1rem", position: "absolute", left: `${index * 10}%`, backgroundColor: "rgb(66,66,66,.5)"}} key={index}>
                <img style={{width: "3rem"}} src={element.image}></img>
                <p>{element.character}</p>
                <p>{element.player}</p> 
            </div>
        )
    });
  }

  const addEventListenersToCharacters = (characters: any) => {
    characters.forEach((character: any) => {
        const characterCard = document.getElementById(`${character.id}`)
        if(characterCard) {
            dragElement(characterCard) 
        }
    })
  } 

  function dragElement(elmnt: HTMLElement) { 

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0; 

      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
      elmnt.ontouchstart = dragMouseDown;
    
  
    function dragMouseDown(e: any) {
        elmnt.style.backgroundColor = "red"

      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.ontouchend = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
      document.ontouchmove = elementDrag;
    }
  
    function elementDrag(e: any) {
      elmnt.style.backgroundColor = "yellow"

      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.touches[0].clientX;
      pos2 = pos4 - e.touches[0].clientY;
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.ontouchend = null;
      document.ontouchmove = null;
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  


  export default GamePage
