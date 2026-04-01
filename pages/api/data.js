export default async function handler(req, res) {// fonction exécutée quand on fais : fetch("/api/data", {...})


  try {
    const { city, latitude, longitude } = req.body;//Données reçues, vient de : JSON.stringify



    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day&daily=sunrise,sunset&timezone=auto`
    );//data.js appelle une API externe

    const data = await response.json();//Lecture du JSON, récupère :•	current •	daily •	timezone 

    const current = data.current;
    const daily = data.daily;

    res.status(200).json({//Transformation des données
      name: city,
      sys: {
        country: "",
        sunrise: Math.floor(new Date(daily.sunrise[0]).getTime() / 1000),
        sunset: Math.floor(new Date(daily.sunset[0]).getTime() / 1000),
      },
      weather: [
        {
          description: "info meteo",
          icon: "01d",
        },
      ],
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
      },
      wind: {
        speed: (current.wind_speed_10m / 3.6).toFixed(1),
        deg: current.wind_direction_10m,
      },
      dt: Math.floor(new Date(current.time).getTime() / 1000),
      timezone: data.utc_offset_seconds,
      visibility: 10000,
    });
    /*Pourquoi transformer ?
Parce que : ton frontend attend :
weatherData.main.temp
weatherData.wind.speed
 mais Open-Meteo donne :
current.temperature_2m
current.wind_speed_10m*/
//donc data.js fait : Open-Meteo → format compatible frontend
//res.status(200).json(...) envoie les données à index.js

  } catch (error) {
    res.status(500).json({ message: "Erreur des données météo" });
  }
}