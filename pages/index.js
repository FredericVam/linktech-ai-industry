
//on a enlevé import search
import { useState, useEffect } from "react";
import { MainCard } from "../components/MainCard";
import { ContentBox } from "../components/ContentBox";
import { Header } from "../components/Header";
import { DateAndTime } from "../components/DateAndTime";
import { MetricsBox } from "../components/MetricsBox";
import { UnitSwitch } from "../components/UnitSwitch";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorScreen } from "../components/ErrorScreen";

import styles from "../styles/Home.module.css";

export const App = () => {
  //on a enlevé cityInput, et triggerFetch
  const [weatherData, setWeatherData] = useState();
  const [unitSystem, setUnitSystem] = useState("metric");

  useEffect(() => {
    const getData = async () => {
      //on a ajouté la configuration
      try {
        const configResponse = await fetch("/config.json");//
        const config = await configResponse.json();//
       //intermediaire
        const res = await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({//plus de cityInput
            city: config.city,//
            latitude: config.latitude,//
            longitude: config.longitude,//
          }),
        });

        const data = await res.json();//res.status(200).json(...) avait envoyé les données à index.js
        setWeatherData(data);//et l’interface s’affiche
      } catch (error) {
        setWeatherData({ message: "Erreur" });
      }
    };
    getData();
//on ajoute le raffraichissement
    const interval = setInterval(getData, 3600000);//
    return () => clearInterval(interval);//
  }, []);//

  const changeSystem = () => {
    unitSystem === "metric"
      ? setUnitSystem("imperial")
      : setUnitSystem("metric");
  };

  return weatherData && !weatherData.message ? (
    <div className={styles.wrapper}>
      <MainCard
        city={weatherData.name}
        country={weatherData.sys.country}
        description={weatherData.weather[0].description}
        iconName={weatherData.weather[0].icon}
        unitSystem={unitSystem}
        weatherData={weatherData}
      />
      <ContentBox>
        <Header>
          <DateAndTime weatherData={weatherData} unitSystem={unitSystem} />
        </Header>
        <MetricsBox weatherData={weatherData} unitSystem={unitSystem} />
        <UnitSwitch onClick={changeSystem} unitSystem={unitSystem} />
      </ContentBox>
    </div>
  ) : weatherData && weatherData.message ? (//on enleve l'erreur liée à la ville non trouvée
    <ErrorScreen errorMessage="Impossible de charger les données meteo." />//on change le message
  ) : (
    <LoadingScreen loadingMessage="Loading data..." />
  );
};

export default App;