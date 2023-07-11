import { useEffect } from 'react';
import './Marker.css';

interface MarkerProps {
    map: naver.maps.Map;
    position: {
        lat: number;
        lng: number;
    };
    content: string;
    onClick?: () => void;
}

const Marker = ({ map, position, content, onClick }: MarkerProps) => {
    useEffect(() => {
        let marker: naver.maps.Marker | null = null;
        if (map) {
            marker = new naver.maps.Marker({
                map,
                position: new naver.maps.LatLng(position),
                icon: {
                    content,
                },
            });
            // const bounds =new naver.maps.LatLngBounds(
            //     new naver.maps.LatLng(0,0),
            //     new naver.maps.LatLng(0,0)
            // )
        }

        if (onClick) {
            naver.maps.Event.addListener(marker, 'click', onClick);
            map.panTo(position);
        }

        return () => {
            marker?.setMap(null);
        };
    }, [map]);
    return null;
};

export default Marker;