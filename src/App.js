// weather app
// api key - done
// apiwrapper - done
// responsiveness - done
// api Integration - done
// validation and error handling - done
// icon mapping - done

import React, { useEffect, useState } from 'react';
import api from "./api/Api"
import formUrl from './api/formUrl'
import WeatherCard from "./Components/WeatherCard"
import MapContainer from "./Components/MapContainer.jsx"
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState('')
  const [error, setError] = useState('')
  const getWeather = (lat, lng) => {
    // api call get weather data for a city
    let completeURL = formUrl(`weather?lat=${lat}&lon=${lng}`)
    api.get(completeURL).then(data => {
      // if success
      if(data.status === 200) {
        setError('')
        setWeatherData(data.data)
        console.log('weather data', data.data)
      } 
    }).catch(err => {
      // if error
      setError(err.response.data.message)
      console.log('err', err.response.data.message)
    })
  }

  useEffect(() => {
    getWeather('28.704060', '77.102493')
  }, [])

  return (
    <div claaName="App"> 
    
      <p className="mt-10 text-4xl font-mono font-semibold text-center text-blue-900" >Weather app</p>
        
        <div className="flex mt-8">
          <div className="px-10 w-1/2">
          <MapContainer getLatLong={(lat, lng) => {
            getWeather(lat,lng)
          }} />
          </div>

          <div className="w-1/2 mt-12">
          {weatherData && <WeatherCard weatherData={weatherData} error={error}  />}
          </div>
          
        </div>
        
    </div>
  );
}

export default App;
