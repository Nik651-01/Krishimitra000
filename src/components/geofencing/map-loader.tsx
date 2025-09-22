'use client';

import dynamic from 'next/dynamic';

// Dynamically import the map component to ensure it's only loaded on the client side
const InteractiveMap = dynamic(() => import('@/components/geofencing/interactive-map'), { ssr: false });

export function MapLoader() {
    return <InteractiveMap />;
}
