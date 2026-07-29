export interface CurrentConditions {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    weatherCode: number;
    isDay: boolean;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    windGusts: number;
}

export interface HourlyPoint {
    time: string;
    temperature: number;
    precipitationProbability: number;
    weatherCode: number;
    uvIndex: number;
}

export interface DailyPoint {
    date: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    precipitationProbabilityMax: number;
    precipitationSum: number;
    sunrise: string;
    sunset: string;
    uvIndexMax: number;
    windSpeedMax: number;
}

export interface AirQuality {
    usAqi: number;
    pm2_5: number;
    pm10: number;
    dominantPollutant: string;
    subIndices: {
        pm2_5: number;
        pm10: number;
        no2: number;
        o3: number;
        so2: number;
        co: number;
    };
}

export interface WeatherData {
    location: { lat: number; lon: number; label: string };
    current: CurrentConditions;
    hourly: HourlyPoint[];
    daily: DailyPoint[];
    airQuality: AirQuality;
    generatedAt: string;
}

export type TemperatureUnit = "C" | "F";
