import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 51.5074,
  lng: -0.1278
};

export const ATMLocator: React.FC = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [atms, setAtms] = useState<google.maps.places.PlaceResult[]>([]);

  const {
    value,
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['geocode'],
      componentRestrictions: { country: 'GB' },
    },
  });

  const searchNearbyATMs = async (location: google.maps.LatLngLiteral) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location,
      radius: 5000,
      type: 'atm',
      keyword: 'natwest atm'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setAtms(results);
      }
    });
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setCenter({ lat, lng });
      searchNearbyATMs({ lat, lng });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for NatWest ATMs near..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {data.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">
            {data.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion.description)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
        >
          {atms.map((atm, index) => (
            <Marker
              key={index}
              position={{
                lat: atm.geometry?.location.lat() || 0,
                lng: atm.geometry?.location.lng() || 0,
              }}
              title={atm.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};