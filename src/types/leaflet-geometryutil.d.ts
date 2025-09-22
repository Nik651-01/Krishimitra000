import 'leaflet';

declare module 'leaflet' {
    namespace GeometryUtil {
        function geodesicArea(latlngs: LatLng[]): number;
    }
}
