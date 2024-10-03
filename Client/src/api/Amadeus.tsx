//todo extract interfaces
let accessToken: string | null = null;
let tokenExpiration: number | null = null;

interface Geocode {
  latitude: number;
  longitude: number;
}

const getAmadeusAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: import.meta.env.VITE_AMADEUS_API_KEY || "",
          client_secret: import.meta.env.VITE_AMADEUS_API_SECRET || "",
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      accessToken = data.access_token;
      tokenExpiration = Date.now() + data.expires_in * 1000;
      return accessToken;
    } else {
      console.error("Error fetching access token:", data);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const ensureToken = async (): Promise<string | null> => {
  if (!accessToken || !tokenExpiration || Date.now() >= tokenExpiration) {
    return await getAmadeusAccessToken();
  }
  return accessToken;
};

export async function fetchWithToken<T>(
  url: string,
  method: string = "GET"
): Promise<T> {
  const token = await ensureToken();
  if (!token) {
    throw new Error("Missing or invalid access token");
  }

  const options: RequestInit = {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error while fetching data: ${data.message || "An unexpected error occurred."}`
      );
    }

    return data.data as T;
  } catch (error) {
    console.error("Error in fetchWithToken:", error);
    throw new Error("Error while fetching data. Please try again later.");
  }
}

export interface AmadeusLocation {
  type: string;
  subType: string;
  name: string;
  geoCode: Geocode;
  address: Address;
  iataCode: string;
}

interface Address {
  cityName: string;
  cityCode: string;
  countryName: string;
  countryCode: string;
  regionCode: string;
}

export const getLocations = async (
  cityName: string
): Promise<Array<AmadeusLocation> | null> => {
  const url = `https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=${cityName}`;
  return await fetchWithToken(url);
};

//activity
export interface AmadeusActivity {
  id: string;
  name: string;
  description: string;
  geoCode: Geocode;
  pictures: string;
}

export const getActivities = async (
  city: AmadeusLocation
): Promise<AmadeusActivity | null> => {
  const latitude = city.geoCode.latitude;
  const longitude = city.geoCode.longitude;

  const url = `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=5`; //todo think about radius
  return await fetchWithToken(url);
};

//hotels
export interface AmadeusHotel {
  name: string;
  geoCode: Geocode;
}

export const getHotels = async (
  city: AmadeusLocation
): Promise<AmadeusHotel | null> => {
  const cityCode = city.iataCode;

  const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;
  return await fetchWithToken(url);
};
