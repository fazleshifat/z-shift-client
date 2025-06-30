import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Center of Bangladesh
const position = [23.685, 90.3563];

// Custom Leaflet marker icon
const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41], // default size
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -41], // point from which the popup should open relative to the iconAnchor
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
});

// Helper component to move map
function FlyToDistrict({ coords }) {
    const map = useMap();
    if (coords) {
        map.flyTo(coords, 14, { duration: 1.5 });
    }
    return null;
}

const BangladeshMap = ({ serviceCenters }) => {

    const [search, setSearch] = useState('');
    const [activeCoords, setActiveCoords] = useState(null);
    const [activeDistrict, setActiveDistrict] = useState(null);

    const filteredDistricts = serviceCenters.filter(d =>
        d?.district?.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearch = (e) => {
        e.preventDefault();
        if (filteredDistricts.length > 0) {
            const firstMatch = filteredDistricts[0];
            setActiveCoords([firstMatch.latitude, firstMatch.longitude]);
            setActiveDistrict(firstMatch.district);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-4">
                We are available in <span className="text-primary">64 districts</span>
            </h2>

            <div className="relative">
                {/* Search Bar - Absolute Positioned */}
                <form
                    onSubmit={handleSearch}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white shadow-md p-3 rounded-lg flex gap-2 items-center w-[90%] md:w-[60%]"
                >
                    <input
                        type="text"
                        placeholder="Search district..."
                        className="input input-bordered w-full"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary whitespace-nowrap">Go</button>
                </form>

                {/* Map */}
                <MapContainer
                    center={position}
                    zoom={8}
                    scrollWheelZoom={true}
                    style={{ height: '800px', width: '100%' }}
                    maxBounds={[[20.5, 88.0], [26.7, 92.0]]}
                    maxBoundsViscosity={1.0}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />

                    <FlyToDistrict coords={activeCoords} />

                    {filteredDistricts.map((d, i) => (
                        <Marker
                            key={i}
                            position={[d.latitude, d.longitude]}
                            icon={customIcon}
                        >
                            <Popup>
                                <strong>{d.district}</strong>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default BangladeshMap;
