'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getCropRecommendations, State } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Trees, CalendarDays, Sprout } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="lg">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Recommendations
        </Button>
    );
}

export function RecommendationForm() {
    const initialState: State = { message: null, errors: {}, data: null };
    const [state, dispatch] = useActionState(getCropRecommendations, initialState);

    return (
        <div className="space-y-8">
            <form action={dispatch}>
                <Card>
                    <CardHeader>
                        <CardTitle>Find the Perfect Crops</CardTitle>
                        <CardDescription>
                            Enter your farm's details below to receive AI-powered crop recommendations. The more detail you provide, the better the results.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="soilData">Soil Data</Label>
                            <Textarea
                                id="soilData"
                                name="soilData"
                                placeholder="e.g., pH: 6.5, Nitrogen: 50kg/ha, Phosphorus: 20kg/ha, Organic Matter: 2.5%, Soil Type: Loamy"
                                required
                                rows={4}
                            />
                            {state.errors?.soilData && <p className="text-sm font-medium text-destructive">{state.errors.soilData[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="climateData">Climate Data</Label>
                            <Textarea
                                id="climateData"
                                name="climateData"
                                placeholder="e.g., Avg. annual rainfall: 700mm, Avg. temperature: 25°C, Sunlight: 8 hours/day"
                                required
                                rows={4}
                            />
                            {state.errors?.climateData && <p className="text-sm font-medium text-destructive">{state.errors.climateData[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="e.g., Pune, Maharashtra, India"
                                required
                            />
                            {state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location[0]}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </Card>
            </form>

            {state.data && (
                <div className="space-y-6 animate-in fade-in-50">
                    <h2 className="text-2xl font-bold font-headline">Your Personalized Recommendations</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Trees className="text-primary"/> Recommended Crops</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{state.data.recommendedCrops}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sprout className="text-primary"/> Soil Improvement Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{state.data.soilImprovementTips}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarDays className="text-primary"/> Planting Calendar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{state.data.plantingCalendar}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
            {state.message && !state.data && (state.errors?.soilData || state.errors?.climateData || state.errors?.location) ? null : state.message && !state.data && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{state.message}</p>
                    </CardContent>
                 </Card>
            )}
        </div>
    );
}
