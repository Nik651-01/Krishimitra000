'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { getCropRecommendations, State } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sprout } from 'lucide-react';
import { Textarea } from '../ui/textarea';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="lg">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Soil Health
        </Button>
    );
}

// Wrapper action to provide default climate data if it's empty
async function getSoilHealthAnalysis(prevState: State, formData: FormData) {
    const climateData = formData.get('climateData');
    if (!climateData || climateData.toString().trim() === '') {
        formData.set('climateData', 'Average regional climate conditions for the specified location.');
    }
    return getCropRecommendations(prevState, formData);
}


export function SoilHealthForm() {
    const initialState: State = { message: null, errors: {}, data: null };
    const [state, dispatch] = useFormState(getSoilHealthAnalysis, initialState);

    return (
        <div className="space-y-8">
            <form action={dispatch}>
                <Card>
                    <CardHeader>
                        <CardTitle>Soil Health Analysis</CardTitle>
                        <CardDescription>
                            Input your soil test results to get a detailed health report and improvement tips.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="soilData">Soil Test Results</Label>
                            <Textarea
                                id="soilData"
                                name="soilData"
                                placeholder="e.g., pH: 6.5, Nitrogen: 50kg/ha, Phosphorus: 20kg/ha, Organic Matter: 2.5%"
                                required
                                rows={4}
                            />
                            {state.errors?.soilData && <p className="text-sm font-medium text-destructive">{state.errors.soilData[0]}</p>}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
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
                             <div className="space-y-2">
                                <Label htmlFor="climateData">Climate Data (Optional)</Label>
                                <Textarea
                                    id="climateData"
                                    name="climateData"
                                    placeholder="Leave blank to use average data for your location."
                                    rows={1}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </Card>
            </form>

            {state.data && (
                <div className="space-y-6 animate-in fade-in-50">
                    <h2 className="text-2xl font-bold font-headline">Your Soil Health Report</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sprout className="text-primary"/> Soil Improvement Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{state.data.soilImprovementTips}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
             {state.message && !state.data && (state.errors?.soilData || state.errors?.location) ? null : state.message && !state.data && (
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
