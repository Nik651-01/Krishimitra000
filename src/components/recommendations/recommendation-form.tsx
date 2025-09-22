
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getCropRecommendations, CropRecState } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Trees, CalendarDays, Sprout } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

function SubmitButton() {
    const { pending } = useFormStatus();
    const { t } = useTranslation();
    return (
        <Button type="submit" disabled={pending} size="lg">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('recommendations.form.button')}
        </Button>
    );
}

export function RecommendationForm() {
    const initialState: CropRecState = { message: null, errors: {}, data: null };
    const [state, dispatch] = useActionState(getCropRecommendations, initialState);
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <form action={dispatch}>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('recommendations.form.title')}</CardTitle>
                        <CardDescription>
                            {t('recommendations.form.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="soilData">{t('recommendations.form.soilDataLabel')}</Label>
                            <Textarea
                                id="soilData"
                                name="soilData"
                                placeholder={t('recommendations.form.soilDataPlaceholder')}
                                required
                                rows={4}
                            />
                            {state.errors?.soilData && <p className="text-sm font-medium text-destructive">{state.errors.soilData[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="climateData">{t('recommendations.form.climateDataLabel')}</Label>
                            <Textarea
                                id="climateData"
                                name="climateData"
                                placeholder={t('recommendations.form.climateDataPlaceholder')}
                                required
                                rows={4}
                            />
                            {state.errors?.climateData && <p className="text-sm font-medium text-destructive">{state.errors.climateData[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">{t('recommendations.form.locationLabel')}</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder={t('recommendations.form.locationPlaceholder')}
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
                    <h2 className="text-2xl font-bold font-headline">{t('recommendations.form.resultsTitle')}</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Trees className="text-primary"/> {t('recommendations.form.recommendedCropsTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{state.data.recommendedCrops}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sprout className="text-primary"/> {t('recommendations.form.soilImprovementTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{state.data.soilImprovementTips}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarDays className="text-primary"/> {t('recommendations.form.plantingCalendarTitle')}</CardTitle>
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
                        <CardTitle>{t('recommendations.form.error')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{state.message}</p>
                    </CardContent>
                 </Card>
            )}
        </div>
    );
}
