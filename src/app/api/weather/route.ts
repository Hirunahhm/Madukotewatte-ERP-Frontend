import { NextResponse } from "next/server";
import { ESTATE_LOCATION } from "@/features/weather/utils/constants";
import type { WeatherData } from "@/features/weather/types/weather.types";

const FORECAST_URL = new URL("https://api.open-meteo.com/v1/forecast");
FORECAST_URL.searchParams.set("latitude", String(ESTATE_LOCATION.lat));
FORECAST_URL.searchParams.set("longitude", String(ESTATE_LOCATION.lon));
FORECAST_URL.searchParams.set("timezone", "auto");
FORECAST_URL.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day"
);
FORECAST_URL.searchParams.set(
    "hourly",
    "temperature_2m,precipitation_probability,weather_code,uv_index"
);
FORECAST_URL.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max,wind_speed_10m_max"
);
FORECAST_URL.searchParams.set("forecast_days", "7");

const AIR_QUALITY_URL = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
AIR_QUALITY_URL.searchParams.set("latitude", String(ESTATE_LOCATION.lat));
AIR_QUALITY_URL.searchParams.set("longitude", String(ESTATE_LOCATION.lon));
AIR_QUALITY_URL.searchParams.set("timezone", "auto");
AIR_QUALITY_URL.searchParams.set(
    "current",
    "pm2_5,pm10,us_aqi,us_aqi_pm2_5,us_aqi_pm10,us_aqi_no2,us_aqi_o3,us_aqi_so2,us_aqi_co"
);

interface OpenMeteoForecastResponse {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        precipitation: number;
        weather_code: number;
        pressure_msl: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
        wind_gusts_10m: number;
        is_day: number;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation_probability: number[];
        weather_code: number[];
        uv_index: number[];
    };
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: number[];
        precipitation_sum: number[];
        sunrise: string[];
        sunset: string[];
        uv_index_max: number[];
        wind_speed_10m_max: number[];
    };
}

interface OpenMeteoAirQualityResponse {
    current: {
        pm2_5: number;
        pm10: number;
        us_aqi: number;
        us_aqi_pm2_5: number;
        us_aqi_pm10: number;
        us_aqi_no2: number;
        us_aqi_o3: number;
        us_aqi_so2: number;
        us_aqi_co: number;
    };
}

const POLLUTANT_LABELS: Record<string, string> = {
    pm2_5: "PM2.5",
    pm10: "PM10",
    no2: "NO2",
    o3: "Ozone",
    so2: "SO2",
    co: "CO",
};

export async function GET() {
    try {
        const [forecastRes, airQualityRes] = await Promise.all([
            fetch(FORECAST_URL, { next: { revalidate: 600 } }),
            fetch(AIR_QUALITY_URL, { next: { revalidate: 600 } }),
        ]);

        if (!forecastRes.ok || !airQualityRes.ok) {
            return NextResponse.json({ message: "Unable to reach the weather service." }, { status: 502 });
        }

        const forecast: OpenMeteoForecastResponse = await forecastRes.json();
        const airQuality: OpenMeteoAirQualityResponse = await airQualityRes.json();

        const subIndices = {
            pm2_5: airQuality.current.us_aqi_pm2_5,
            pm10: airQuality.current.us_aqi_pm10,
            no2: airQuality.current.us_aqi_no2,
            o3: airQuality.current.us_aqi_o3,
            so2: airQuality.current.us_aqi_so2,
            co: airQuality.current.us_aqi_co,
        };
        const dominantKey = (Object.keys(subIndices) as (keyof typeof subIndices)[]).reduce((a, b) =>
            subIndices[b] > subIndices[a] ? b : a
        );

        const data: WeatherData = {
            location: ESTATE_LOCATION,
            current: {
                temperature: forecast.current.temperature_2m,
                apparentTemperature: forecast.current.apparent_temperature,
                humidity: forecast.current.relative_humidity_2m,
                precipitation: forecast.current.precipitation,
                weatherCode: forecast.current.weather_code,
                isDay: forecast.current.is_day === 1,
                pressure: forecast.current.pressure_msl,
                windSpeed: forecast.current.wind_speed_10m,
                windDirection: forecast.current.wind_direction_10m,
                windGusts: forecast.current.wind_gusts_10m,
            },
            hourly: forecast.hourly.time.slice(0, 24).map((time, i) => ({
                time,
                temperature: forecast.hourly.temperature_2m[i],
                precipitationProbability: forecast.hourly.precipitation_probability[i],
                weatherCode: forecast.hourly.weather_code[i],
                uvIndex: forecast.hourly.uv_index[i],
            })),
            daily: forecast.daily.time.map((date, i) => ({
                date,
                weatherCode: forecast.daily.weather_code[i],
                tempMax: forecast.daily.temperature_2m_max[i],
                tempMin: forecast.daily.temperature_2m_min[i],
                precipitationProbabilityMax: forecast.daily.precipitation_probability_max[i],
                precipitationSum: forecast.daily.precipitation_sum[i],
                sunrise: forecast.daily.sunrise[i],
                sunset: forecast.daily.sunset[i],
                uvIndexMax: forecast.daily.uv_index_max[i],
                windSpeedMax: forecast.daily.wind_speed_10m_max[i],
            })),
            airQuality: {
                usAqi: airQuality.current.us_aqi,
                pm2_5: airQuality.current.pm2_5,
                pm10: airQuality.current.pm10,
                dominantPollutant: POLLUTANT_LABELS[dominantKey],
                subIndices,
            },
            generatedAt: new Date().toISOString(),
        };

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ message: "Unable to reach the weather service." }, { status: 502 });
    }
}
