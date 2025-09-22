
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getSoilHealthAnalysis, SoilHealthState } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sprout } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { GaugeCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

function SubmitButton() {
    const { pending } = useFormStatus();
    const { t } = useTranslation();
    return (
        <Button type="submit" disabled={pending} size="lg">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('soilHealthPage.form.button')}
        </Button>
    );
}

export function SoilHealthForm() {
    const initialState: SoilHealthState = { message: null, errors: {}, data: null };
    const [state, dispatch] = useActionState(getSoilHealthAnalysis, initialState);
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <form action={dispatch}>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('soilHealthPage.form.title')}</CardTitle>
                        <CardDescription>
                            {t('soilHealthPage.form.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="soilData">{t('soilHealthPage.form.soilTestResultsLabel')}</Label>
                            <Textarea
                                id="soilData"
                                name="soilData"
                                placeholder={t('soilHealthPage.form.soilTestResultsPlaceholder')}
                                required
                                rows={4}
                            />
                            {state.errors?.soilData && <p className="text-sm font-medium text-destructive">{state.errors.soilData[0]}</p>}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="location">{t('soilHealthPage.form.locationLabel')}</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder={t('soilHealthPage.form.locationPlaceholder')}
                                    required
                                />
                                {state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location[0]}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="climateData">{t('soilHealthPage.form.climateDataLabel')}</Label>
                                <Textarea
                                    id="climateData"
                                    name="climateData"
                                    placeholder={t('soilHealthPage.form.climateDataPlaceholder')}
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
                    <h2 className="text-2xl font-bold font-headline">{t('soilHealthPage.form.reportTitle')}</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><GaugeCircle className="text-primary"/> {t('soilHealthPage.form.overallHealthTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold">{state.data.healthScore}<span className="text-2xl text-muted-foreground">/100</span></div>
                                <div className="w-full">
                                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                        <span>{t('soilHealthPage.form.poor')}</span>
                                        <span>{t('soilHealthPage.form.fair')}</span>
                                        <span>{t('soilHealthPage.form.good')}</span>
                                        <span>{t('soilHealthPage.form.excellent')}</span>
                                    </div>
                                    <Progress value={state.data.healthScore} className="h-4" />
                                     <div className="relative w-full h-1 mt-1">
                                        <div className="absolute h-full w-[2px] bg-foreground" style={{left: '75%'}}></div>
                                        <p className="absolute text-xs -translate-x-1/2" style={{left: '75%'}}>{t('soilHealthPage.form.good')}</p>
                                    </div>
                                </div>
                            </div>
                             <p className="text-center text-lg">{t('soilHealthPage.form.ratingPrefix')} <span className="font-semibold text-primary">{state.data.rating}</span>{t('soilHealthPage.form.ratingSuffix')}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sprout className="text-primary"/> {t('soilHealthPage.form.recommendationsTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{state.data.recommendations}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
             {state.message && !state.data && (state.errors?.soilData || state.errors?.location) ? null : state.message && !state.data && (
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('soilHealthPage.form.error')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{state.message}</p>
                    </CardContent>
                 </Card>
            )}
        </div>
    );
}
