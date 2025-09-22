
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

const advisoryServices = [
    {
        id: 'kisan-suvidha',
        titleKey: 'advisories.kisanSuvidha.title',
        descriptionKey: 'advisories.kisanSuvidha.description',
        href: '#',
    },
    {
        id: 'mkisan',
        titleKey: 'advisories.mkisan.title',
        descriptionKey: 'advisories.mkisan.description',
        href: '#',
    },
    {
        id: 'farmonaut',
        titleKey: 'advisories.farmonaut.title',
        descriptionKey: 'advisories.farmonaut.description',
        href: '#',
    },
    {
        id: 'agriapp',
        titleKey: 'advisories.agriapp.title',
        descriptionKey: 'advisories.agriapp.description',
        href: '#',
    },
]

function AdvisoryCard({ serviceId, title, description, href }: { serviceId: string, title: string, description: string, href: string }) {
    const image = PlaceHolderImages.find(img => img.id === serviceId);
    const { t } = useTranslation();

    return (
        <Card className="flex flex-col overflow-hidden">
            {image && (
                <div className="relative w-full h-40">
                    <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                    />
                </div>
            )}
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
                <Button asChild variant="secondary" className="w-full">
                    <Link href={href} target="_blank">
                        {t('advisories.visitPlatform')} <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function AdvisoriesPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('advisories.title')}</h1>
                <p className="text-muted-foreground">
                    {t('advisories.description')}
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {advisoryServices.map(service => (
                    <AdvisoryCard 
                        key={service.id}
                        serviceId={service.id}
                        title={t(service.titleKey)}
                        description={t(service.descriptionKey)}
                        href={service.href}
                    />
                ))}
            </div>
        </div>
    );
}
