import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const DOG_API_URL = "https://api.thedogapi.com/v1/images/search?api_key=" + "live_5gjEN1clL9J8yZlyyahFO5jGpOoOWJEyIBxziCXK42LAZhPTBMWObWOZWaVnddRj"


function App() {
  const [dogObject, setDogObject] = useState(null)
  const [knownDogs, setKnownDogs] = useState([])
  const [banList, setBanList] = useState([])

  useEffect(() => {
    callAPI();
  }, [])

 

  const callAPI = async () => {
    let response;
    let bool = true;
    console.clear()

    do{
      response = await axios.get(DOG_API_URL + "&has_breeds=1")
      bool = ('temperament' in response.data[0].breeds[0])? 
        isInBanList(response.data[0].breeds[0].life_span, response.data[0].breeds[0].name, response.data[0].breeds[0].temperament.substring(0, response.data[0].breeds[0].temperament.indexOf(","))) 
        :
        false;
      console.log(bool + " " + !('temperament' in response.data[0].breeds[0]))
    }while(!('temperament' in response.data[0].breeds[0]) || bool)



    setDogObject(response.data[0])
    setKnownDogs([...knownDogs, {name: `${response.data[0].breeds[0].name}`, url: `${response.data[0].url}`}])
    console.log(response.data[0].breeds[0])

    // console.log(response.data[0].breeds[0].bred_for)
    // console.log(response.data[0].breeds[0].temperament.substring(0, response.data[0].breeds[0].temperament.indexOf(",")))

  }

  const isInBanList = (a1, a2, a3) => {
    if(banList.length === 0)
    {
      return false
    }

    for(const atr of banList)
    {
      if((atr === a1 || atr === a2) || atr === a3)
      {
        return true
      }
    }
    return false
  }

  const addToBanList = (e) => {
    console.log([...banList, e.target.textContent])
    setBanList([...banList, e.target.textContent]) 
  }

  const removeFromBanList = (e) => {
    const attribute = e.target.textContent
    const i = banList.indexOf(attribute) 

    setBanList(banList.slice(0, i).concat(banList.slice(i+1)))
    
  }

  return (
    <div className="app">
      <div className='known-dogs'>
        <h2>Dogs we've already seen</h2>
        {/**loop through knownDogs list showing image and name */}
        {knownDogs != null?
          knownDogs.map(dog => {
            return(
            <>
              <img src={dog.url}/>
              <p>{dog.name}</p>
            </>)
          })
          :
          <></>
        }
      </div>
      <div className='current-dog'>
        <h1>Veni Vici</h1>
        <h3>Discover dogs by clicking the 'Discover' button!</h3>
        {(dogObject != null) && <h2>{dogObject.breeds[0].name}</h2>}
        {(dogObject != null) && 
          <div className='dog-attributes'>
          <button onClick={addToBanList}>{dogObject.breeds[0].name}</button>
          <button onClick={addToBanList}>{dogObject.breeds[0].life_span}</button>
          <button onClick={addToBanList}>{dogObject.breeds[0].temperament.substring(0, dogObject.breeds[0].temperament.indexOf(","))}</button>
        </div>}
          <img src={(dogObject != null)? dogObject.url : ""}/>
        <button onClick={callAPI}>Discover!</button>
      </div>
      <div className='banlist'>
        <h2>Ban List</h2>
        <h3>Select an attribute in the displayed list to ban it</h3>
        {(banList.length > 0) &&
          banList.map((attribute) => {
            return <button onClick={removeFromBanList}>{attribute}</button>
          })
        }
      </div>
    </div>
  )
}

export default App
