
'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";
import { MapPin, PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { MapLoader } from "@/components/geofencing/map-loader";
import { useTranslation } from "@/hooks/use-translation";
import { getGeofenceData } from "@/ai/flows/get-geofence-data";

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

type GeofenceData = {
    lulcData: string;
    soilData: string;
} | null;

export default function GeofencingPage() {
    const { t } = useTranslation();
    const [loadingData, setLoadingData] = useState(false);
    const [geofenceData, setGeofenceData] = useState<GeofenceData>(null);

    const handleAreaSelect = async (areaIdentifier: string) => {
        setLoadingData(true);
        setGeofenceData(null);
        try {
            const data = await getGeofenceData({ areaIdentifier });
            setGeofenceData(data);
        } catch (error) {
            console.error("Failed to fetch geofence data:", error);
            // Optionally, set an error state here to show in the UI
        } finally {
            setLoadingData(false);
        }
    };

    const handleClear = () => {
        setGeofenceData(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-headline">{t('geofencing.title')}</h1>
                    <p className="text-muted-foreground">
                        {t('geofencing.description')}
                    </p>
                </div>
                <Button>
                    <PlusCircle />
                    <span>{t('geofencing.createFence')}</span>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('geofencing.mapTitle')}</CardTitle>
                    <CardDescription>{t('geofencing.mapDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full h-[500px] bg-muted rounded-md flex items-center justify-center">
                        <MapLoader onAreaSelect={handleAreaSelect} onClear={handleClear} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('geofencing.lulcTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {loadingData && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Loading LULC data...</span>
                            </div>
                         )}
                         {geofenceData && <p>{geofenceData.lulcData}</p>}
                         {!loadingData && !geofenceData && (
                            <p className="text-muted-foreground">{t('geofencing.lulcDescription')}</p>
                         )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('geofencing.soilTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingData && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Loading Soil data...</span>
                            </div>
                         )}
                         {geofenceData && <p>{geofenceData.soilData}</p>}
                         {!loadingData && !geofenceData && (
                             <p className="text-muted-foreground">{t('geofencing.soilDescription')}</p>
                         )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('geofencing.definedFences')}</CardTitle>
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
                                            {fence.area} - {t('geofencing.currentCrop')}: {fence.crop}
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
