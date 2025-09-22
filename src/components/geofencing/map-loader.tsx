'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export function MapLoader() {
    const InteractiveMap = useMemo(() => dynamic(
        () => import('@/components/geofencing/interactive-map'),
        { ssr: false }
    ), []);

    return <InteractiveMap />;
}
