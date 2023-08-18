import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
const API = "https://dnd-socket-server-851241f4eb52.herokuapp.com"

const IndexPage: React.FC<PageProps> = () => {
  const [characterList, setCharacterList]: any = React.useState([])
  const [characterInfoCards, setCharacterInfoCards] = React.useState([])

  return (
    <div style={{overflow: "scroll", width: "100vw", height: "100vh", backgroundImage: 'url("https://cdn.wallpapersafari.com/70/63/GIAqgF.jpg")', backgroundSize: "cover", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
      <div  style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%"}}>
      <div style={{padding: "2rem", display: "flex", flexDirection: "column", width: "20rem", color: "white", justifyContent: "center", backgroundColor: "rgb(22,22,22,.5)"}}>
      <h3 style={{width: "100%", textAlign: "center"}}>
          Add Characters
        </h3>
        <div style={{display: "flex", flexDirection: "row"}}>
        <input id="map-input">
        </input>
        <button onClick={loadMap}>
          Load Map
        </button>
        </div>
      <input placeholder="Player" id="add-player-input">
        </input>
        <input placeholder="Character Name" id="add-character-input">
        </input>
        <input placeholder="Character Image" id="add-character-image-input">
        </input>
        <button onClick={() => {
          setCharacterList(addCharacter(characterList, setCharacterInfoCards, setCharacterList))
        }} id="add-character-button">
          Load Character
        </button>
        <div>
          <a style={{color: "white"}} href="/game">Start</a>
        </div>
      </div>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "50%"}}>
        <div style={{overflow: "scroll", display: "flex", flexDirection: "column"}} id="character-list">
          {characterInfoCards}
        </div>
      </div>
      </div>
    </div>
  )
}


function addCharacter(characterList: any, setCharactersInfo: Function, setCharacterData: Function): { player: string, image: string, character: string, id: string}[] {
  const characterInput = document.getElementById("add-character-input")! as HTMLInputElement;
  const characterImageInput = document.getElementById("add-character-image-input")! as HTMLInputElement;
  const characterPlayerInput = document.getElementById("add-player-input")! as HTMLInputElement;
  const character = {
    player: characterPlayerInput.value,
    character: characterInput.value,
    image: characterImageInput.value,
    id: characterPlayerInput.value
  }

  characterList.push(character)

  const characterCardList = characterList.map((ch: any, index: number) => {
    return characterInfoCard(ch, characterList, setCharactersInfo, setCharacterData, index)
  })

  setCharactersInfo(characterCardList)

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(characterList)
  };

  console.log(options)
  fetch(API + "/characters", options)
    .then(data => {
      console.log('Response from server:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  window.localStorage.setItem("characters", JSON.stringify(characterList))

  return characterList;
}

const loadMap = () => {
  const mapInput = document.getElementById("map-input")! as HTMLInputElement;
  const map = mapInput.value;
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
}

const characterInfoCard = (characterData: { player: string, image: string, character: string, id: string}, characterList: any,setCharInfo: Function, setCharacterList: Function, key: number) => {
  return(
    <div key={key} style={{width: "fit-content", margin: "1rem", borderRadius: "5px", padding: "1rem", display: "flex", flexDirection: "row", backgroundColor: "#222"}}>
      <img style={{borderStyle: "solid", borderRadius: "3px", borderColor: "white", width: "6rem"}} src={characterData.image}></img>
      <div style={{justifyContent: "space-between", marginLeft: "1rem", display: "flex", flexDirection: "column", color: "white"}}>
      <p>{characterData.character}</p><p style={{fontSize: ".75rem"}}>{characterData.player}</p><button style={{borderRadius: "5px", backgroundColor: "burlywood"}} onClick={(event) => {
        deleteCharacter(characterList, setCharacterList, setCharInfo, event.target)
      }} id={characterData.id}>Delete</button>
      </div>
    </div>
  )
}

const deleteCharacter = (characterData: any, setCharacters: Function, setCharInfo: Function, buttonId: any) => {
  const returnChars = characterData.filter((character: any) => {
    console.log(character.id.toString(), buttonId.id.toString())
    return character.id.toString() !== buttonId.id.toString()
  })

  const characterCardList = returnChars.map((ch: any, index: number) => {
    return characterInfoCard(ch, characterData, setCharInfo, setCharacters, index)
  })
  setCharInfo(characterCardList)
  setCharacters(returnChars)
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
