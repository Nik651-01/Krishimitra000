import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sun, Cloud, CloudRain, CloudDrizzle, Thermometer, Droplets, Wind, Sunrise, Sunset } from "lucide-react";

const forecast = [
    { day: "Today", icon: CloudDrizzle, high: 26, low: 22, desc: "Partly Drizzly" },
    { day: "Tue", icon: CloudRain, high: 28, low: 21, desc: "Heavy Rain" },
    { day: "Wed", icon: Cloud, high: 30, low: 22, desc: "Cloudy" },
    { day: "Thu", icon: Sun, high: 32, low: 23, desc: "Sunny" },
    { day: "Fri", icon: Sun, high: 33, low: 24, desc: "Sunny" },
    { day: "Sat", icon: Cloud, high: 31, low: 23, desc: "Partly Cloudy" },
    { day: "Sun", icon: CloudDrizzle, high: 29, low: 22, desc: "Light Showers" },
];

export default function WeatherPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Weather Forecast</h1>
                <p className="text-muted-foreground">
                    7-day forecast for Nashik, Maharashtra.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Conditions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-4 lg:col-span-2">
                        <CloudDrizzle className="w-16 h-16 text-primary" />
                        <div>
                            <p className="text-5xl font-bold">26°C</p>
                            <p className="text-muted-foreground">Partly Drizzly</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 text-sm">
                        <Thermometer className="w-8 h-8 text-primary" />
                        <div>
                            <p className="font-semibold">Feels Like</p>
                            <p className="text-2xl font-semibold">28°C</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 text-sm">
                        <Droplets className="w-8 h-8 text-primary" />
                        <div>
                            <p className="font-semibold">Humidity</p>
                            <p className="text-2xl font-semibold">85%</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 text-sm">
                        <Wind className="w-8 h-8 text-primary" />
                        <div>
                            <p className="font-semibold">Wind</p>
                            <p className="text-2xl font-semibold">12 km/h</p>
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
                                                <f.icon className="w-6 h-6 text-primary" />
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
