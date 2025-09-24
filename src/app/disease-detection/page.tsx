
'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Camera, Upload, ShieldCheck, ShieldAlert, Bug, Leaf, Microscope, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { detectPlantDisease, DetectPlantDiseaseOutput } from "@/ai/flows/detect-plant-disease";
import { useTranslation } from "@/hooks/use-translation";

export default function DiseaseDetectionPage() {
    const { t } = useTranslation();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DetectPlantDiseaseOutput | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setImagePreview(URL.createObjectURL(file));
                setImageData(dataUri);
                setResult(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!imageData) {
            setError(t('diseaseDetection.errorNoImage'));
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await detectPlantDisease({ photoDataUri: imageData });
            setResult(response);
        } catch (err) {
            console.error(err);
            setError(t('diseaseDetection.errorAnalysis'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('diseaseDetection.title')}</h1>
                <p className="text-muted-foreground">
                    {t('diseaseDetection.description')}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('diseaseDetection.uploadTitle')}</CardTitle>
                    <CardDescription>{t('diseaseDetection.uploadDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="plant-image">{t('diseaseDetection.imageLabel')}</Label>
                        <div className="flex items-center gap-4">
                            <Input id="plant-image" type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs" />
                        </div>
                    </div>

                    {imagePreview && (
                        <div className="w-full max-w-sm mx-auto">
                            <Image src={imagePreview} alt="Plant preview" width={400} height={300} className="rounded-md object-cover aspect-video" />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Button onClick={handleSubmit} disabled={loading || !imageData} size="lg">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Microscope className="mr-2 h-4 w-4" />}
                {t('diseaseDetection.buttonText')}
            </Button>
            
            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{t('diseaseDetection.errorTitle')}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {result && (
                <Card className="animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle>{t('diseaseDetection.resultsTitle')}</CardTitle>
                         {!result.identification.isPlant && (
                            <Alert variant="destructive">
                               <AlertTriangle className="h-4 w-4" />
                               <AlertTitle>{t('diseaseDetection.notAPlantTitle')}</AlertTitle>
                               <AlertDescription>{t('diseaseDetection.notAPlantDescription')}</AlertDescription>
                            </Alert>
                         )}
                    </CardHeader>
                    {result.identification.isPlant && (
                         <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Leaf /> {t('diseaseDetection.identificationTitle')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p><strong>{t('diseaseDetection.commonName')}:</strong> {result.identification.commonName}</p>
                                        <p><strong>{t('diseaseDetection.latinName')}:</strong> <em>{result.identification.latinName}</em></p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            {result.diagnosis.isHealthy ? <ShieldCheck className="text-green-600" /> : <ShieldAlert className="text-destructive" />}
                                            {t('diseaseDetection.diagnosisTitle')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p><strong>{t('diseaseDetection.healthStatus')}:</strong> 
                                            <span className={result.diagnosis.isHealthy ? "text-green-600 font-semibold" : "text-destructive font-semibold"}>
                                                {result.diagnosis.isHealthy ? t('diseaseDetection.healthy') : t('diseaseDetection.unhealthy')}
                                            </span>
                                        </p>
                                        <p><strong>{t('diseaseDetection.diseaseName')}:</strong> {result.diagnosis.disease}</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                     <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Bug /> {t('diseaseDetection.treatmentTitle')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="whitespace-pre-wrap text-sm">
                                        {result.diagnosis.preventionAndTreatment}
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}

        </div>
    );
}
