
'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TriangleAlert, CloudDrizzle, Thermometer, Wind, Droplets, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { reasonAboutWeatherAlertRelevance } from "@/ai/flows/reason-weather-alert-relevance";
import { useLocationStore } from '@/lib/location-store';
import { getWeatherForecast, WeatherForecast } from '@/ai/flows/get-weather-forecast';

// This is now a client component, but we can still fetch data on the server
// for initial render if needed, or fetch on client. For simplicity, we'll keep this as a placeholder.
// In a real app, this would be a server component that fetches and passes data to a client component.
function WeatherAlert() {
    // const relevance = await reasonAboutWeatherAlertRelevance({
    //     weatherData: "Alert: Heavy rainfall (80mm) expected in the next 24 hours in your area.",
    //     cropInformation: "Currently growing Grapes, post-harvest stage.",
    //     locationData: "User's current location"
    // });
    const relevance = { isRelevant: true, reasoning: 'Heavy rain after harvest can affect drying and storage.' };

    return (
        <Alert className="bg-accent/20 border-accent/50 text-accent-foreground">
            <TriangleAlert className="h-4 w-4 text-accent-foreground" />
            <AlertTitle className="font-bold">Weather Alert: Heavy Rain Expected</AlertTitle>
            <AlertDescription>
                <p className="mb-2">Heavy rainfall (80mm) is forecast for your region in the next 24 hours.</p>
                {relevance.isRelevant && (
                    <div className="mt-2 p-3 bg-background/50 rounded-md border">
                        <p className="font-semibold text-sm text-foreground">Why it matters for your farm:</p>
                        <p className="text-sm">{relevance.reasoning}</p>
                    </div>
                )}
            </AlertDescription>
        </Alert>
    )
}

function LocationPrompt() {
    const { location, loading, error, requestLocation } = useLocationStore();

    if (location || loading) return null;

    return (
        <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
                <CardTitle>Personalize Your Experience</CardTitle>
                <CardDescription>Share your location to get weather and advisories relevant to your farm.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={requestLocation}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Share Location
                </Button>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </CardContent>
        </Card>
    );
}

function WeatherDisplay() {
    const { location, address } = useLocationStore();
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
                        longitude: location.longitude 
                    });
                    setWeather(forecast);
                } catch (e) {
                    setError("Could not fetch weather data.");
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
        fetchWeather();
    }, [location]);

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Today's Weather</CardTitle>
                <CardDescription>
                    {address?.description || 'Current Location'}
                    {!location && !loading && "Location not available"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Fetching weather...</p>
                    </div>
                )}
                {error && <p className="text-destructive">{error}</p>}
                {weather && !loading && (
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <CloudDrizzle className="w-16 h-16 text-primary" />
                            <div>
                                <p className="text-5xl font-bold">{weather.currentTemp}°C</p>
                                <p className="text-muted-foreground">{weather.description}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-right">
                            <div className="flex items-center gap-2 justify-end">
                                <p className="text-sm">{weather.tempHigh}° / {weather.tempLow}°</p>
                                <Thermometer className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <p className="text-sm">Humidity {weather.humidity}%</p>
                                <Droplets className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <p className="text-sm">Wind {weather.windSpeed} km/h</p>
                                <Wind className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                )}
                 {!location && !loading && !error && (
                    <p className="text-muted-foreground h-24 flex items-center">Share location to see local weather.</p>
                 )}
            </CardContent>
        </Card>
    );
}


export default function DashboardPage() {
    const { location, initialized } = useLocationStore();

    // The store initializes from localStorage, we wait until it's ready.
    if (!initialized) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, here's your farm's overview.</p>
            </div>

            <LocationPrompt />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <WeatherDisplay />
                
                <Card>
                    <CardHeader>
                        <CardTitle>Soil Health</CardTitle>
                        <CardDescription>Key nutrient levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex justify-between"><span>Nitrogen (N)</span> <span className="font-semibold text-green-600">Optimal</span></li>
                            <li className="flex justify-between"><span>Phosphorus (P)</span> <span className="font-semibold text-orange-500">Slightly Low</span></li>
                            <li className="flex justify-between"><span>Potassium (K)</span> <span className="font-semibold text-green-600">Optimal</span></li>
                            <li className="flex justify-between"><span>pH Level</span> <span className="font-semibold">6.8</span></li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {location && <WeatherAlert />}

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personalized Crop Recommendations</CardTitle>
                        <CardDescription>Get AI-powered suggestions for your next planting season based on your farm's data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                           <Link href="/recommendations">Get Recommendations <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Advisory Services</CardTitle>
                        <CardDescription>Connect with government schemes and private agricultural platforms for holistic support.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/advisories">Explore Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
