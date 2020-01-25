import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const params = {
    access_key: `${process.env.REACT_APP_API_KEY}`,
    query: country.capital
  };
  const [temperature, setTemperature] = useState(0);
  const [wind, setWind] = useState(0);
  const [direction, setDirection] = useState('');
  const [icon, setIcon] = useState('');
  useEffect(() => {
    axios
      .get('http://api.weatherstack.com/current', { params })
      .then(response => {
        if (response.data.current !== undefined) {
          setTemperature(response.data.current.temperature);
          setWind(response.data.current.wind_speed);
          setDirection(response.data.current.wind_dir);
          setIcon(response.data.current.weather_icons[0]);
        }

      });
  }, [])

  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language =>
          <li key={language.name}>{language.name}</li>
        )}
      </ul>
      <img src={country.flag} alt={country.name + '\'s flag'} style={{ width: 30 + '%', height: 30 + '%' }} />
      <h3>Weather in {country.capital}</h3>
      <div><b>temperature: </b> {temperature} Celcius</div>
      <img src={icon} alt={country.capital + '\'s weather'} style={{ width: 10 + '%', height: 10 + '%' }} />
      <div><b>wind: </b> {wind} mph direction {direction}</div>
    </div>
  )
}

const CountryList = ({ countries, setFilter }) => {
  return (
    <div>
      {countries.map(country =>
        <div key={country.name}>{country.name} <button onClick={() => setFilter(country.name)}>show</button></div>
      )}
    </div>
  )
}

const CountryView = ({ countries, filter, setFilter }) => {
  if (filter === '') {
    return (
      <></>
    )
  }
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if (countries.length > 1) {
    return (
      <CountryList countries={countries} setFilter={setFilter}></CountryList>
    )
  } else if (countries.length === 1) {
    return (
      <Country country={countries[0]}></Country>
    )
  } else {
    return (
      <></>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const shownCountries = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <div>find countries <input value={filter} onChange={handleFilterChange} /></div>
      <CountryView countries={shownCountries} filter={filter} setFilter={setFilter}></CountryView>
    </div>
  )
}

export default App;
