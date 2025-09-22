import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const advisoryServices = [
    {
        id: 'kisan-suvidha',
        title: 'Kisan Suvidha',
        description: 'A government platform providing information on weather, dealers, market prices, and plant protection.',
        href: '#',
    },
    {
        id: 'mkisan',
        title: 'mKisan',
        description: 'An SMS portal for farmers that provides advisories and information from various agricultural departments.',
        href: '#',
    },
    {
        id: 'farmonaut',
        title: 'Farmonaut',
        description: 'A private platform using satellite imagery to provide farm-level advisories and monitoring.',
        href: '#',
    },
    {
        id: 'agriapp',
        title: 'AgriApp',
        description: 'A comprehensive app offering crop advisory, soil testing, and an marketplace for agri-products.',
        href: '#',
    },
]

function AdvisoryCard({ serviceId, title, description, href }: { serviceId: string, title: string, description: string, href: string }) {
    const image = PlaceHolderImages.find(img => img.id === serviceId);

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
                        Visit Platform <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function AdvisoriesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Advisory Services</h1>
                <p className="text-muted-foreground">
                    Connect with integrated government and private agricultural platforms.
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {advisoryServices.map(service => (
                    <AdvisoryCard 
                        key={service.id}
                        serviceId={service.id}
                        title={service.title}
                        description={service.description}
                        href={service.href}
                    />
                ))}
            </div>
        </div>
    );
}
