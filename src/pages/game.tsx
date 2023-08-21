import React, { useEffect, useState } from "react"
import "../css/character.css"
import io from "socket.io-client"
import $ from 'jquery';
import { FaSyncAlt } from "react-icons/fa"
// @ts-ignore
import MapMenuBackground from "../images/mapMenu.jpg"
// @ts-ignore
import MainMenuBackground from "../images/mainMenu.jpg"

const API = "https://dnd-socket-server-851241f4eb52.herokuapp.com" 
// const API = "http://localhost:3000"


// @ts-ignore
const socket = io.connect(API)
const minWindowWidth = 450;


const GamePage = () => {
    const [map, setMap]: any = React.useState("")
    const [characters, setCharacters] = React.useState([])
    const [characterElements, setCharacterElements] = React.useState([])
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mapList, setMapList] = useState([])

    const handleFullscreenToggle = () => {
    const targetElement = document.getElementById("game-map")! as HTMLDivElement;

    if (targetElement) {
      if (!isFullscreen) {
        if (targetElement.requestFullscreen) {
          targetElement.requestFullscreen();
          // @ts-ignore
        } else if (targetElement.webkitRequestFullscreen) {
          // @ts-ignore
          targetElement.webkitRequestFullscreen();
          // @ts-ignore
        } else if (targetElement.msRequestFullscreen) {
          // @ts-ignore
          targetElement.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          // @ts-ignore
        } else if (document.webkitExitFullscreen) {
          // @ts-ignore
          document.webkitExitFullscreen();
          // @ts-ignore
        } else if (document.msExitFullscreen) {
          // @ts-ignore
          document.msExitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  }

    function setMapFromAPI() {
      const mapInput = document.getElementById("map-text-area") as HTMLInputElement;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: mapInput.value
      };
    
      fetch(API + "/map", options)
        .then(data => {
          console.log('Response from server:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      
        fetch(API + "/map-list", options)
          .then(data => {
            console.log('Response from server:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }

    function touchHandler(event: any) {
      if(event.touches.length > 1) {
          event.preventDefault()
      }
    }

    function disableZoom() {
      document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
        touchHandler(e)
      });
      document.addEventListener('touchmove', function(e) {
        e.preventDefault();
        touchHandler(e)
      });
    }
    
    // Call the function when the page loads
    window.onload = function() {
      disableZoom();
    };

    useEffect(() => {
        $.get(API + "/characters").done(res => {
          if(res.characters) {
            setCharacters(JSON.parse(res.characters))
          }
        })

        $.get(API + "/map-list").done(res => {
          if(res.mapList) {
            setMapList(res.mapList)
          }
        })

        setCharacterElements(characterGenerate(characters))
        setTimeout(() => {
            addEventListenersToCharacters(characters)!
        }, 500);
        document.addEventListener("mouseup", sendMessage)
        document.addEventListener("touchend", sendMessage)
        setInterval(() => {
          $.get(API + "/map", res => {
            if(res) {
              setMap(res.map)
            }
          })
          $.get(API + "/characters").done(res => {
            if(res.characters) {
              setCharacters(JSON.parse(res.characters))
            }
          })
        },10000)
        window.addEventListener('resize', () => {
          const menuModal = document.getElementById("game-menu")! as HTMLDivElement;
          if(window.innerWidth < minWindowWidth) {
            menuModal.style.display = "flex"
          }
          else {
            menuModal.style.display = "none"
          }
        })
    },[map])

    useEffect(() => {
      socket.on("recieve_message", (data: any) => {
        const charData = data.dimensions
        for(let i = 0; i < charData.length; i++) {
          const characterData = charData[i]
          const character = document.getElementById(characterData.characterId) as HTMLDivElement;
          character!.style.top = viewportToPixels(characterData.top.toString().split("v")[0], "vh") + "px";
          character!.style.left = viewportToPixels(characterData.left.toString().split("v")[0], "vw") + "px";
            character.style.display = "none"
            setTimeout(() => {
            character.style.display = "flex"
          }, 200)
        }
      })
    },[socket])

  
    return (
      <>
        <div id="game-map" style={{width: "100vw", height: "100vh", backgroundImage: `url("${map}")`, backgroundSize: "100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
            {characterElements}
            <button style={{position: "fixed", bottom: "0px", right: "0px"}} onClick={handleFullscreenToggle}>Exit</button>
        </div>

        <div id="game-menu" style={{position: "fixed", top: 0, left: 0, width: "102vw", height: "102vh", backgroundImage: `url(${MainMenuBackground})`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 99, display: "flex", justifyContent: "center", alignItems: "center", color: "white", flexDirection: "column"}}>
          <div style={{height: "70vh", backgroundColor: "#fff", color: "black", borderStyle: "solid", opacity: ".95", textAlign: "center", width: "75vw", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "1.5rem", borderRadius: "3px" }}>
            <h1 style={{textAlign: "left", fontFamily: "fantasy", borderRadius: "3px"}} >Welcome.</h1>
            <h3 style={{textAlign: "justify", fontFamily: "fantasy", borderRadius: "3px"}} >To view the map, and to move your character, turn your phone to a landscape position.</h3>
            <img style={{width: "50vw"}} src="https://t3.ftcdn.net/jpg/03/65/32/08/360_F_365320832_3Lb65Z4SjHlWaOGr14gxitKM3dHLWf1Q.jpg"></img>
            <button style={{color: "black", width: "75vw", marginTop: "2rem", padding: "1rem"}} onClick={openMenuModal}>Edit Map</button>
            <button style={{color: "black", width: "75vw", marginTop: "2rem", padding: "1rem"}} onClick={handleFullscreenToggle}>Full Screen (PC & Android)</button>
          </div>
        </div>

        <div id="menu-modal" style={{ display: "none", position: "fixed", top: 0, left: 0, width: "102vw", height: "102vh", backgroundImage: `url(${MapMenuBackground})`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 9999, justifyContent: "center", alignItems: "center", color: "white", flexDirection: "column"}}>
          <h1 style={{position: "fixed", top: "0", width: "100vw", textAlign: "center", color: "black"}}>Map</h1>
          <div style={{backgroundColor: "#7A301C", borderColor: "black", borderStyle: "solid", opacity: ".95", color: "white", borderRadius: "3px", width: "75vw", textAlign: "center", display: "flex", marginBlock: "2vh", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
          Current Map
          <img src={map} style={{width: "75vw"}}></img>
          </div>
          <div style={{marginBottom: "2vh", overflow: "scroll", backgroundColor: "#fff" , opacity: ".9", borderStyle: "solid", borderColor: "black", paddingBlock: ".5rem", borderRadius: "3px", width: "75vw", height: "20vh", display: "grid", gridTemplateColumns: 'repeat(3, 1fr)'}}>
          {mapList.map(map => {
            if(!map) {
              return;
            }
            return(
              <img onClick={() => {
                const options = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'text/plain'
                  },
                  body: map
                };
              
                fetch(API + "/map", options)
                  .then(data => {
                    console.log('Response from server:', data);
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });
              }} className="map-image" style={{width: "17.5vw", height: "12vw", borderStyle: "solid", borderColor: "black", margin: "3vw"}} id={Math.random().toString()} src={map}></img>
            )
          })}
          </div>
          <textarea placeholder="Enter map url..." style={{padding: ".25rem", width: "74vw", height: "10vh", opacity: .9}} id="map-text-area"></textarea>
          <button style={{color: "black", width: "75vw", marginTop: "2vw", padding: "1rem"}} onClick={setMapFromAPI}>Add Map</button>
          <button style={{color: "black", width:  "75vw", marginTop: "2vw", padding: "1rem"}} onClick={closeMenuModal}>Return</button>
        </div>
      </>
    )
  }

  function openMenuModal() {
    const menuModal = document.getElementById("menu-modal")! as HTMLDivElement;
    menuModal!.style.display = "flex";
    console.log(menuModal)
  }

  function closeMenuModal() {
    const menuModal = document.getElementById("menu-modal")! as HTMLDivElement;
    menuModal!.style.display = "none";
    console.log(menuModal)
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
    if(window.innerWidth > minWindowWidth) {
      socket.emit("send_message", {
        dimensions: charArray
      })
    }
  }

  const characterGenerate = (characters: any) => {
    const colorArray = [
      "rgba(0, 150, 136, 0.5)",   // Teal
      "rgba(255, 193, 7, 0.5)",   // Mustard
      "rgba(106, 90, 205, 0.5)",  // Slate Blue
      "rgba(128, 128, 0, 0.5)",   // Olive
      "rgba(255, 111, 97, 0.5)",  // Coral
      "rgba(150, 123, 182, 0.5)", // Lavender
      "rgba(255, 112, 51, 0.5)",  // Burnt Orange
      "rgba(64, 224, 208, 0.5)",  // Mint
      "rgba(218, 165, 32, 0.5)",  // Goldenrod
      "rgba(154, 205, 50, 0.5)"   // Periwinkle
    ];
    return characters.map((element: any, index: number) => {
        return(
            <div className={"character-element character-card"} id={element.player} style={{color: "black", borderStyle: "solid", borderColor: "black", borderWidth: "2px", borderRadius: "5px", padding: ".25rem", position: "absolute", left: `${index * 10}%`, backgroundColor: colorArray[index], display: "flex", justifyContent: "center", alignItems: "center"}} key={index}>
                <img style={{padding: "0px", margin: "0px", width: "1.5rem"}} src={element.image}></img>
                <p style={{marginLeft: ".5rem", padding: "0px", margin: "0px", fontSize: ".5rem"}}> {element.character}</p>
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

    // otherwise, move the DIV from anywhere inside the DIV
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
