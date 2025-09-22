import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";
import { fetchMapData } from "@/ai/flows/fetch-map-data";
import { MapPin, PlusCircle, Edit, Trash2, Globe } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

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

// Dynamically import the map component to ensure it's only loaded on the client side
const InteractiveMap = dynamic(() => import('@/components/geofencing/interactive-map'), { ssr: false });


export default function GeofencingPage() {

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Geofencing</h1>
                    <p className="text-muted-foreground">
                        Define and manage virtual boundaries for your farm areas. Draw a polygon to analyze an area.
                    </p>
                </div>
                <Button>
                    <PlusCircle />
                    <span>Create New Fence</span>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Interactive Farm Map</CardTitle>
                    <CardDescription>A visual overview of your farm. Use the tools on the left to draw a new geofenced area.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full h-[500px] bg-muted rounded-md flex items-center justify-center">
                        <InteractiveMap />
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Bhuvan LULC Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div id="lulc-data">
                            <p className="text-muted-foreground">Draw a polygon on the map to get Land Use Land Cover data for that area.</p>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>SoilGrids Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div id="soil-data">
                             <p className="text-muted-foreground">Draw a polygon on the map to get SoilGrids data for that area.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
