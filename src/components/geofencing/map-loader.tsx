'use client';

import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(
    () => import('@/components/geofencing/interactive-map'),
    { ssr: false }
);

type MapLoaderProps = {
    onAreaSelect: (areaIdentifier: string) => void;
    onClear: () => void;
}

export function MapLoader({ onAreaSelect, onClear }: MapLoaderProps) {
    return <InteractiveMap onAreaSelect={onAreaSelect} onClear={onClear} />;
}
