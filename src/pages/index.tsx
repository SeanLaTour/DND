import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}
const headingAccentStyles = {
  color: "#663399",
}
const paragraphStyles = {
  marginBottom: 48,
}
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
}
const doclistStyles = {
  paddingLeft: 0,
}
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}

const docLinkStyle = {
  ...linkStyle,
  listStyleType: "none",
  display: `inline-block`,
  marginBottom: 24,
  marginRight: 12,
}

const descriptionStyle = {
  color: "#232129",
  fontSize: 14,
  marginTop: 10,
  marginBottom: 0,
  lineHeight: 1.25,
}

const docLinks = [
  {
    text: "TypeScript Documentation",
    url: "https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/",
    color: "#8954A8",
  },
  {
    text: "GraphQL Typegen Documentation",
    url: "https://www.gatsbyjs.com/docs/how-to/local-development/graphql-typegen/",
    color: "#8954A8",
  }
]

const badgeStyle = {
  color: "#fff",
  backgroundColor: "#088413",
  border: "1px solid #088413",
  fontSize: 11,
  fontWeight: "bold",
  letterSpacing: 1,
  borderRadius: 4,
  padding: "4px 6px",
  display: "inline-block",
  position: "relative" as "relative",
  top: -2,
  marginLeft: 10,
  lineHeight: 1,
}

const links = [
  {
    text: "Tutorial",
    url: "https://www.gatsbyjs.com/docs/tutorial/getting-started/",
    description:
      "A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
    color: "#E95800",
  },
  {
    text: "How to Guides",
    url: "https://www.gatsbyjs.com/docs/how-to/",
    description:
      "Practical step-by-step guides to help you achieve a specific goal. Most useful when you're trying to get something done.",
    color: "#1099A8",
  },
  {
    text: "Reference Guides",
    url: "https://www.gatsbyjs.com/docs/reference/",
    description:
      "Nitty-gritty technical descriptions of how Gatsby works. Most useful when you need detailed information about Gatsby's APIs.",
    color: "#BC027F",
  },
  {
    text: "Conceptual Guides",
    url: "https://www.gatsbyjs.com/docs/conceptual/",
    description:
      "Big-picture explanations of higher-level Gatsby concepts. Most useful for building understanding of a particular topic.",
    color: "#0D96F2",
  },
  {
    text: "Plugin Library",
    url: "https://www.gatsbyjs.com/plugins",
    description:
      "Add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.",
    color: "#8EB814",
  },
  {
    text: "Build and Host",
    url: "https://www.gatsbyjs.com/cloud",
    badge: true,
    description:
      "Now you’re ready to show the world! Give your Gatsby site superpowers: Build and host on Gatsby Cloud. Get started for free!",
    color: "#663399",
  },
]

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

  console.log("char", JSON.stringify(characterList))
  window.localStorage.setItem("characters", JSON.stringify(characterList))

  return characterList;
}

const loadMap = () => {
  const map = document.getElementById("map-input")! as HTMLInputElement;
  window.localStorage.setItem("map", map.value)
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
