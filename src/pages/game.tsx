import React, { useEffect, useState } from "react"
import "../css/character.css"
import io from "socket.io-client"
import $ from 'jquery';

const API = "https://dnd-socket-server-851241f4eb52.herokuapp.com"
// const API = "http://localhost:3000"


// @ts-ignore
const socket = io.connect(API)

const GamePage = () => {
    const [map, setMap]: any = React.useState("")
    const [characters, setCharacters] = React.useState([])
    const [characterElements, setCharacterElements] = React.useState([])
    const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    const targetElement = document.getElementById("game-map")! as HTMLDivElement;

    if (targetElement) {
      if (!isFullscreen) {
        if (targetElement.requestFullscreen) {
          targetElement.requestFullscreen();
        } else if (targetElement.requestFullscreen) {
          targetElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  }

    function setMapFromAPI() {
      $.get(API + "/map", res => {
        console.log("get res: ", res)
        setMap(res.map)
      })
      $.get(API + "/characters").done(res => {
        if(res.characters) {
          setCharacters(JSON.parse(res.characters))
        }
      })
    }

    useEffect(() => {
        $.get(API + "/characters").done(res => {
          if(res.characters) {
            setCharacters(JSON.parse(res.characters))
          }
        })

        setCharacterElements(characterGenerate(characters))
        setTimeout(() => {
            addEventListenersToCharacters(characters)!
        }, 500);
        document.addEventListener("mouseup", sendMessage)
        document.addEventListener("touchend", sendMessage)
        setMapFromAPI()
    },[map])

    useEffect(() => {
      socket.on("recieve_message", (data: any) => {
        const charData = data.dimensions
        for(let i = 0; i < charData.length; i++) {
          const characterData = charData[i]
          const character = document.getElementById(characterData.characterId) as HTMLDivElement;
          console.log(character)
          console.log(characterData)
          console.log(viewportToPixels(characterData.top, "vh") + "px")
          character!.style.top = viewportToPixels(characterData.top.toString().split("v")[0], "vh") + "px";
          character!.style.left = viewportToPixels(characterData.left.toString().split("v")[0], "vw") + "px";
        }
      })
    },[socket])

  
    return (
      <div id="game-map" style={{width: "1400px", height: "800px", backgroundImage: `url("${map}")`, backgroundSize: "100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
          {characterElements}
          <button style={{position: "fixed", bottom: "0px", right: "0px"}} onClick={setMapFromAPI}>Update Map</button>
          <button style={{position: "fixed", bottom: "0px", left: "0px"}} onClick={handleFullscreenToggle}>Full Screen</button>
      </div>
    )
  }

  function viewportToPixels(percentage: number, unit: 'vh' | 'vw'): number {
    if (unit !== 'vh' && unit !== 'vw') {
      throw new Error('Invalid unit. Use "vh" or "vw".');
    }
  
    const viewportSize = unit === 'vh' ? window.innerHeight : window.innerWidth;
    const pixels = (percentage / 100) * viewportSize;
    return pixels;
  }

  function pixelsToViewport(pixels: number, unit: 'vh' | 'vw'): string {
    if (unit !== 'vh' && unit !== 'vw') {
      throw new Error('Invalid unit. Use "vh" or "vw".');
    }
  
    const viewportSize = unit === 'vh' ? window.innerHeight : window.innerWidth;
    const percentage = (pixels / viewportSize) * 100;
    return `${percentage}${unit}`;
  }

  const sendMessage = () => {
    const characters = document.getElementsByClassName("character-element")
    const charArray = [];
    for(let i = 0; i < characters.length; i++) {
      const character = characters[i];
      const dimensions = character.getClientRects();
      const charDimensions = {left: pixelsToViewport(dimensions[0].left, "vw"), top: pixelsToViewport(dimensions[0].top, "vh"), characterId: character.id}
      charArray.push(charDimensions)
    }
    if(window.innerWidth > 400) {
      socket.emit("send_message", {
        dimensions: charArray
      })
    }
  }

  const characterGenerate = (characters: any) => {
    return characters.map((element: any, index: number) => {
        return(
            <div className={"character-element character-card"} id={element.player} style={{color: "white", borderRadius: "5px", padding: ".25rem", position: "absolute", left: `${index * 10}%`, backgroundColor: "rgb(33,33,33,.5)"}} key={index}>
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
            characterCard.addEventListener("mousedown", (event) => {
              characterCard.style.opacity = ".25";
            })
            characterCard.addEventListener("mouseup", (event) => {
              characterCard.style.opacity = "1";
            })
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
