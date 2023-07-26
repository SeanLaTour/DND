import React, { useEffect, useState } from "react"
import io from "socket.io-client"

// @ts-ignore
const socket = io.connect("http://localhost:3000")

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
        }, 500);
        document.addEventListener("mouseup", sendMessage)
        document.addEventListener("touchend", sendMessage)
    },[map])

    useEffect(() => {
      socket.on("recieve_message", (data: any) => {
        console.log("DATA: ", data.dimensions)
        const charData = data.dimensions
        for(let i = 0; i < charData.length; i++) {
          const characterData = charData[i]
          const character = document.getElementById(characterData.characterId) as HTMLDivElement;
          console.log(character)
          character!.style.top = characterData.top + "px";
          character!.style.left = characterData.left + "px";
        }
      })
    },[socket])

  
    return (
      <div style={{width: "100vw", height: "100vh", backgroundImage: `url("${map}")`, backgroundSize: "100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
          {characterElements}
      </div>
    )
  }

  const sendMessage = () => {
    const characters = document.getElementsByClassName("character-element")
    const charArray = [];
    for(let i = 0; i < characters.length; i++) {
      const character = characters[i];
      const dimensions = character.getClientRects();
      const charDimensions = {left: dimensions[0].left, top: dimensions[0].top, characterId: character.id}
      charArray.push(charDimensions)
    }
    socket.emit("send_message", {
      dimensions: charArray
    })
  }

  const characterGenerate = (characters: any) => {
      console.log(characters)
    return characters.map((element: any, index: number) => {
        return(
            <div className={"character-element"} id={element.player} style={{color: "white", borderRadius: "5px", padding: ".25rem", position: "absolute", left: `${index * 10}%`, backgroundColor: "rgb(33,33,33,.5)"}} key={index}>
                <img style={{padding: "0px", margin: "0px", width: "1.5rem"}} src={element.image}></img>
                <p style={{padding: "0px", margin: "0px", fontSize: ".5rem"}}> {element.character}</p>
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
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        document.onmousemove = elementDragMobile;
        document.ontouchmove = elementDragMobile;
        }
    }

    function elementDrag(e: any) {  
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
      }
  
    function elementDragMobile(e: any) {
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
