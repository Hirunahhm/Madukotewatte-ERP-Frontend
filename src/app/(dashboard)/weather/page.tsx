import { LiveWeather } from "@/features/weather/components/live-weather";
import { Next24Hours } from "@/features/weather/components/next-24-hours";
import { Outlook5Day } from "@/features/weather/components/outlook-5-day";
import { SatelliteRadar } from "@/features/weather/components/satellite-radar";
import { ActiveAlerts } from "@/features/weather/components/active-alerts";
import { AirQuality } from "@/features/weather/components/air-quality";

export default function WeatherPage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <LiveWeather />
                    <Next24Hours />
                    <Outlook5Day />
                </div>
                <div className="space-y-6">
                    <SatelliteRadar />
                    <ActiveAlerts />
                    <AirQuality />
                </div>
            </div>
        </div>
    );
}
