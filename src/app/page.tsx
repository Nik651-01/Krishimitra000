import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TriangleAlert, CloudDrizzle, Thermometer, Wind, Droplets } from "lucide-react";
import Link from "next/link";
import { reasonAboutWeatherAlertRelevance } from "@/ai/flows/reason-weather-alert-relevance";

async function WeatherAlert() {
    const relevance = await reasonAboutWeatherAlertRelevance({
        weatherData: "Alert: Heavy rainfall (80mm) expected in the next 24 hours in Nashik district.",
        cropInformation: "Currently growing Grapes, post-harvest stage.",
        locationData: "Farm located in Nashik, Maharashtra, India."
    });

    return (
        <Alert className="bg-accent/20 border-accent/50 text-accent-foreground">
            <TriangleAlert className="h-4 w-4 text-accent-foreground" />
            <AlertTitle className="font-bold">Weather Alert: Heavy Rain Expected</AlertTitle>
            <AlertDescription>
                <p className="mb-2">Heavy rainfall (80mm) is forecast for the Nashik region in the next 24 hours.</p>
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

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, here's your farm's overview.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Today's Weather</CardTitle>
                        <CardDescription>Nashik, Maharashtra</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <CloudDrizzle className="w-16 h-16 text-primary" />
                                <div>
                                    <p className="text-5xl font-bold">26°C</p>
                                    <p className="text-muted-foreground">Partly Drizzly</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="flex items-center gap-2 justify-end">
                                    <p className="text-sm">31° / 22°</p>
                                    <Thermometer className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                    <p className="text-sm">Humidity 85%</p>
                                    <Droplets className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                    <p className="text-sm">Wind 12 km/h</p>
                                    <Wind className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
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

            <WeatherAlert />

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
