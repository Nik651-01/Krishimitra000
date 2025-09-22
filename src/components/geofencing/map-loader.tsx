'use client';

import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(
    () => import('@/components/geofencing/interactive-map'),
    { ssr: false }
);

type MapLoaderProps = {
    onAreaSelect: (areaIdentifier: string, areaInAcres: number) => void;
    onFirstVertex: (areaIdentifier: string) => void;
    onClear: () => void;
}

export function MapLoader({ onAreaSelect, onFirstVertex, onClear }: MapLoaderProps) {
    return <InteractiveMap onAreaSelect={onAreaSelect} onFirstVertex={onFirstVertex} onClear={onClear} />;
}
