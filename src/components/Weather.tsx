import { useState, useEffect } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import axios from "axios";

interface WeatherPeriod {
    name: string;
    detailedForecast: string;
    temperature: number;
    temperatureUnit: string;
    icon: string;
}

interface WeatherProperties {
    periods: WeatherPeriod[];
}

interface WeatherData {
    properties: WeatherProperties;
}

function Weather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.log("Error fetching your location");
                    console.error(error);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        if (latitude && longitude) {
            const fetchWeather = async () => {
                setLoading(true);
                setError(null);

                try {
                    const pointResponse = await axios.get(
                        `https://api.weather.gov/points/${latitude},${longitude}`
                    );

                    const forecastUrl = pointResponse.data.properties.forecast;
                    const forecastResponse = await axios.get(forecastUrl);

                    setWeather(forecastResponse.data);
                } catch (err) {
                    console.log("Error fetching weather data.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchWeather();
        }
    }, [latitude, longitude]);

    useEffect(() => {
        getUserLocation();
    }, []);

    const currWeather = weather ? weather.properties.periods[0] : null;

    return (
        <Grid
        className="weather">
            {loading}
            {error}
            {currWeather && (
                <Grid>
                    <Typography color={"white"}>
                        {currWeather.temperature}
                        {currWeather.temperatureUnit}
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
}

export default Weather;
