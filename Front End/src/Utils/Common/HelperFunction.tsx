import FingerprintJS from '@fingerprintjs/fingerprintjs';

type PlaceInfo = {
  places: {
    'place name': string;
    state: string;
    'state abbreviation': string;
    latitude: string;
    longitude: string;
  }[];
};
export const getFingerprint = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId; // Consistent across sessions on same browser
};
export const getCityState = (
  zip: string,
  callback: (
    result: {
      city: string;
      state: string;
      stateAbbr: string;
      latitude: string;
      longitude: string;
    } | null
  ) => void
) => {
  fetch(`https://api.zippopotam.us/us/${zip}`)
    .then(res => {
      if (!res.ok) throw new Error('Invalid ZIP code');
      return res.json();
    })
    .then((data: PlaceInfo) => {
      const place = data.places[0];
      console.log(place, 'place');
      callback({
        city: place['place name'],
        state: place['state'],
        stateAbbr: place['state abbreviation'].replace(/[()]/g, ''),
        latitude: place['latitude'],
        longitude: place['longitude'],
      });
    })
    .catch(() => callback(null));
};
