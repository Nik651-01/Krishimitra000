
'use client';
import { RecommendationForm } from "@/components/recommendations/recommendation-form";
import { useTranslation } from "@/hooks/use-translation";

export default function RecommendationsPage() {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('recommendations.title')}</h1>
                <p className="text-muted-foreground">
                    {t('recommendations.description')}
                </p>
            </div>
            <RecommendationForm />
        </div>
    );
}
