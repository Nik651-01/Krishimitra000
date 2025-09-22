import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";
import { fetchMapData } from "@/ai/flows/fetch-map-data";
import { MapPin, PlusCircle, Edit, Trash2, Globe } from "lucide-react";
import Image from "next/image";

const fences = [
    {
        id: 'field-a',
        name: 'North Field (Field A)',
        area: '12.5 Acres',
        crop: 'Wheat',
    },
    {
        id: 'field-b',
        name: 'South-East Orchard (Field B)',
        area: '8.2 Acres',
        crop: 'Grapes',
    },
    {
        id: 'reservoir',
        name: 'Reservoir Area',
        area: '2.1 Acres',
        crop: 'N/A',
    },
];

export default async function GeofencingPage() {

    const mapData = await fetchMapData({
        latitude: 19.9975,
        longitude: 73.7898,
        zoom: 12
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Geofencing</h1>
                    <p className="text-muted-foreground">
                        Define and manage virtual boundaries for your farm areas.
                    </p>
                </div>
                <Button>
                    <PlusCircle />
                    <span>Create New Fence</span>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Farm Map</CardTitle>
                    <CardDescription>A visual overview of your geofenced areas, ready for Bhuvan API integration.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full h-96 bg-muted rounded-md flex items-center justify-center">
                        <Image 
                            src={mapData.tileUrl}
                            alt="Farm map with geofenced areas"
                            fill
                            className="object-cover rounded-md"
                            data-ai-hint="farm map"
                        />
                         <div className="absolute inset-0 bg-primary/10 rounded-md"></div>
                         <div className="z-10 text-muted-foreground font-semibold bg-background/80 px-4 py-2 rounded-full flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            <span>Bhuvan API Integration Point</span>
                         </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Defined Fences</CardTitle>
                </CardHeader>
                <CardContent>
                    <List>
                        {fences.map(fence => (
                            <ListItem key={fence.id}>
                                <div className="flex items-center gap-4">
                                    <MapPin className="w-6 h-6 text-primary" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{fence.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {fence.area} - Current Crop: {fence.crop}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Edit className="w-4 h-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                         <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </div>
    );
}
