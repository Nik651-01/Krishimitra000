
'use client';
import { SoilHealthForm } from "@/components/soil/soil-health-form";
import { useTranslation } from "@/hooks/use-translation";

export default function SoilHealthPage() {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('soilHealthPage.title')}</h1>
                <p className="text-muted-foreground">
                    {t('soilHealthPage.description')}
                </p>
            </div>
            <SoilHealthForm />
        </div>
    );
}
