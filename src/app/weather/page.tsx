
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sun, Cloud, CloudRain, CloudDrizzle, Thermometer, Droplets, Wind, Sunrise, Sunset, Loader2, CloudSun, WifiOff, MapPin } from "lucide-react";
import { useLocationStore } from '@/lib/location-store';
import { getWeatherForecast, WeatherForecast } from '@/ai/flows/get-weather-forecast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';

const weeklyForecastData = [
    { day: "Tue", icon: CloudRain, high: 28, low: 21, desc: "Heavy Rain" },
    { day: "Wed", icon: Cloud, high: 30, low: 22, desc: "Cloudy" },
    { day: "Thu", icon: Sun, high: 32, low: 23, desc: "Sunny" },
    { day: "Fri", icon: Sun, high: 33, low: 24, desc: "Sunny" },
    { day: "Sat", icon: Cloud, high: 31, low: 23, desc: "Partly Cloudy" },
    { day: "Sun", icon: CloudDrizzle, high: 29, low: 22, desc: "Light Showers" },
];

function WeatherIcon({ description, className }: { description: string, className?: string }) {
    const defaultClass = "w-16 h-16 text-primary";
    if (description.toLowerCase().includes('rain') || description.toLowerCase().includes('drizzle')) {
        return <CloudDrizzle className={cn(defaultClass, className)} />;
    }
    if (description.toLowerCase().includes('cloud')) {
        return <Cloud className={cn(defaultClass, className)} />;
    }
    if (description.toLowerCase().includes('sun')) {
        return <Sun className={cn(defaultClass, className)} />;
    }
    return <CloudSun className={cn(defaultClass, className)} />;
}

export default function WeatherPage() {
    const { location, address, initialized, weather, setWeather } = useLocationStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

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
                    setError(t('weatherPage.error'));
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            } else if (initialized) {
                setLoading(false);
            }
        }
        fetchWeather();
    }, [location, initialized, setWeather, t]);
    
    if (!initialized) {
        return (
             <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const isStale = !!error && !!weather;

    const todayForecast = weather ? 
        { day: "Today", high: weather.tempHigh, low: weather.tempLow, desc: weather.description } :
        { day: "Today", high: 26, low: 22, desc: "Partly Drizzly" };
    
    const forecast = [
        { ...todayForecast, icon: (props: any) => <WeatherIcon {...props} /> }, 
        ...weeklyForecastData.map(f => ({...f, icon: (props: any) => <f.icon {...props} />  }))
    ];


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('weatherPage.title')}</h1>
                <p className="text-muted-foreground">
                    {address ? t('weatherPage.description', {location: address.description}) : t('weatherPage.descriptionNoLocation')}
                </p>
            </div>

            <Card>
                <CardHeader>
                     <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{t('weatherPage.currentConditions')}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="w-4 h-4" /> 
                                {address?.description || t('dashboard.weather.locationNotAvailable')}
                            </CardDescription>
                            {location && (
                                <p className="text-xs text-muted-foreground mt-1 ml-6">
                                    Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
                                </p>
                            )}
                        </div>
                        {isStale && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted rounded-md">
                                <WifiOff className="w-4 h-4" />
                                <span>{t('weatherPage.offline')} {formatDistanceToNow(new Date(weather.fetchedAt!), { addSuffix: true })}</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                 <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {loading && (
                        <div className="flex items-center justify-center h-32 col-span-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-4 text-muted-foreground">{t('weatherPage.loading')}</p>
                        </div>
                    )}
                    {error && !weather && <p className="text-destructive h-32 flex items-center col-span-full">{error} {t('weatherPage.checkConnection')}</p>}

                    {!location && !loading && !weather && (
                        <p className="text-muted-foreground h-32 flex items-center col-span-full">{t('weatherPage.shareLocationPrompt')}</p>
                    )}
                    {weather && (
                        <>
                            <div className="flex items-center gap-4 lg:col-span-2">
                                <WeatherIcon description={weather.description} />
                                <div>
                                    <p className="text-5xl font-bold">{weather.currentTemp}°C</p>
                                    <p className="text-muted-foreground">{weather.description}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 col-span-full sm:col-span-1 lg:col-span-2">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="w-6 h-6 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('dashboard.weather.tempHighLow')}</p>

                                        <p className="font-semibold">{weather.tempHigh}° / {weather.tempLow}°</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Droplets className="w-6 h-6 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('dashboard.weather.humidity')}</p>
                                        <p className="font-semibold">{weather.humidity}%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Wind className="w-6 h-6 text-muted-foreground" />
                                     <div>
                                        <p className="text-sm text-muted-foreground">{t('dashboard.weather.wind')}</p>
                                        <p className="font-semibold">{weather.windSpeed} km/h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sunrise className="w-6 h-6 text-muted-foreground" />
                                     <div>
                                        <p className="text-sm text-muted-foreground">{t('dashboard.weather.sunrise')}</p>
                                        <p className="font-semibold">6:10 AM</p>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Sunset className="w-6 h-6 text-muted-foreground" />
                                     <div>
                                        <p className="text-sm text-muted-foreground">{t('dashboard.weather.sunset')}</p>
                                        <p className="font-semibold">7:05 PM</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('weatherPage.weeklyForecast')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[120px]">{t('weatherPage.day')}</TableHead>
                                    <TableHead>{t('weatherPage.condition')}</TableHead>
                                    <TableHead className="text-right">{t('weatherPage.highLow')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {forecast.map(f => (
                                    <TableRow key={f.day}>
                                        <TableCell className="font-medium">{f.day === 'Today' ? t('weatherPage.today') : f.day}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <f.icon description={f.desc} className="w-6 h-6" />
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
