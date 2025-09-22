'use client';

import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(
    () => import('@/components/geofencing/interactive-map'),
    { ssr: false }
);

export function MapLoader() {
    return <InteractiveMap />;
}
