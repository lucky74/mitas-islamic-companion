export function calculateQiblaDirection(lat: number, lng: number): number {
  const kaabaLat = 21.4225 * (Math.PI / 180);
  const kaabaLng = 39.8262 * (Math.PI / 180);
  const userLat = lat * (Math.PI / 180);
  const userLng = lng * (Math.PI / 180);

  const numerator = Math.sin(kaabaLng - userLng);
  const denominator =
    Math.cos(userLat) * Math.tan(kaabaLat) -
    Math.sin(userLat) * Math.cos(kaabaLng - userLng);

  const qiblaRadians = Math.atan2(numerator, denominator);
  const qiblaDegrees = (qiblaRadians * 180) / Math.PI;

  return (qiblaDegrees + 360) % 360;
}

export function getUserLocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

