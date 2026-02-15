import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { getSocket } from '@/services/socket';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import RedDot from '/images/red-dot.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
	// iconRetinaUrl: RedDot,
	iconRetinaUrl: markerIcon2x,
	iconUrl: markerIcon,
	shadowUrl: markerShadow,
});

export const LiveMap = () => {
	const [position, setPosition] = useState<[number, number] | null>([
		8.163334, 125.130747,
	]);
	const [path, setPath] = useState<[number, number][]>([]);

	useEffect(() => {
		const socket = getSocket('race');

		socket.on('gpsUpdate', (gps) => {
			const coords: [number, number] = [gps.lat, gps.lon];
			setPosition(coords);
			setPath((prev) => [...prev, coords]);
		});

		return () => {
			socket.off('gpsUpdate');
		};
	}, []);

	if (!position) return <div>No GPS data yet</div>;

	return (
		<MapContainer
			center={position}
			zoom={15}
			style={{ height: '400px', width: '100%' }}
		>
			<TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
			<Marker position={position} />
			<Polyline positions={path} />
		</MapContainer>
	);
};
