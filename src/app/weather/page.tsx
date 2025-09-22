'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sun, Cloud, CloudRain, CloudDrizzle, Thermometer, Droplets, Wind, Sunrise, Sunset, Loader2, CloudSun } from "lucide-react";
import { useLocationStore } from '@/lib/location-store';
import { getWeatherForecast, WeatherForecast } from '@/ai/flows/get-weather-forecast';

const weeklyForecastData = [
    { day: "Tue", icon: CloudRain, high: 28, low: 21, desc: "Heavy Rain" },
    { day: "Wed", icon: Cloud, high: 30, low: 22, desc: "Cloudy" },
    { day: "Thu", icon: Sun, high: 32, low: 23, desc: "Sunny" },
    { day: "Fri", icon: Sun, high: 33, low: 24, desc: "Sunny" },
    { day: "Sat", icon: Cloud, high: 31, low: 23, desc: "Partly Cloudy" },
    { day: "Sun", icon: CloudDrizzle, high: 29, low: 22, desc: "Light Showers" },
];

function WeatherIcon({ description }: { description: string }) {
    if (description.toLowerCase().includes('rain') || description.toLowerCase().includes('drizzle')) {
        return <CloudDrizzle className="w-16 h-16 text-primary" />;
    }
    if (description.toLowerCase().includes('cloud')) {
        return <Cloud className="w-16 h-16 text-primary" />;
    }
    if (description.toLowerCase().includes('sun')) {
        return <Sun className="w-16 h-16 text-primary" />;
    }
    return <CloudSun className="w-16 h-16 text-primary" />;
}

export default function WeatherPage() {
    const { location, address, initialized } = useLocationStore();
    const [weather, setWeather] = useState<WeatherForecast | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWeather() {
            if (location) {
                setLoading(true);
                setError(null);
                try {
                    const forecast = await getWeatherForecast({
                        latitude: location.latitude,
                        longitude: location.longitude,
                    });
                    setWeather(forecast);
                } catch (e) {
                    setError("Could not fetch weather data.");
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            } else if (initialized) {
                setLoading(false);
            }
        }
        fetchWeather();
    }, [location, initialized]);
    
    if (!initialized) {
        return (
             <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const todayForecast = weather ? 
        { day: "Today", icon: WeatherIcon, high: weather.tempHigh, low: weather.tempLow, desc: weather.description } :
        { day: "Today", icon: CloudDrizzle, high: 26, low: 22, desc: "Partly Drizzly" };
    
    const forecast = [todayForecast, ...weeklyForecastData];


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Weather Forecast</h1>
                <p className="text-muted-foreground">
                    {address ? `7-day forecast for ${address.description}` : location ? `7-day forecast for your location (Lat: ${location.latitude.toFixed(2)}, Lon: ${location.longitude.toFixed(2)})` : "7-day forecast. Share your location for local weather."}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Conditions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {loading && (
                        <div className="flex items-center justify-center h-32 col-span-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-4 text-muted-foreground">Fetching weather for your location...</p>
                        </div>
                    )}
                    {error && <p className="text-destructive col-span-full">{error}</p>}
                    {!location && !loading && !error && (
                        <p className="text-muted-foreground h-32 flex items-center col-span-full">Share your location on the dashboard to see local weather conditions.</p>
                    )}
                    {weather && !loading && (
                        <>
                            <div className="flex items-center gap-4 lg:col-span-2">
                                <WeatherIcon description={weather.description} />
                                <div>
                                    <p className="text-5xl font-bold">{weather.currentTemp}°C</p>
                                    <p className="text-muted-foreground">{weather.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <Thermometer className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="font-semibold">High / Low</p>
                                    <p className="text-2xl font-semibold">{weather.tempHigh}° / {weather.tempLow}°</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <Droplets className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="font-semibold">Humidity</p>
                                    <p className="text-2xl font-semibold">{weather.humidity}%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <Wind className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="font-semibold">Wind</p>
                                    <p className="text-2xl font-semibold">{weather.windSpeed} km/h</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <Sunrise className="w-8 h-8 text-amber-500" />
                                <div>
                                    <p className="font-semibold">Sunrise</p>
                                    <p className="text-2xl font-semibold">6:10 AM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <Sunset className="w-8 h-8 text-orange-500" />
                                <div>
                                    <p className="font-semibold">Sunset</p>
                                    <p className="text-2xl font-semibold">7:05 PM</p>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[120px]">Day</TableHead>
                                    <TableHead>Condition</TableHead>
                                    <TableHead className="text-right">High / Low</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {forecast.map(f => (
                                    <TableRow key={f.day}>
                                        <TableCell className="font-medium">{f.day}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <f.icon description={f.desc} />
                                                <span>{f.desc}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{f.high}° / {f.low}°</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
