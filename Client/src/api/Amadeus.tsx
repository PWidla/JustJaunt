import hotelsMockData from "./AmadeusMock/hotels.json";
import cityMockData from "./AmadeusMock/city.json";
import activitiesMockData from "./AmadeusMock/activities.json";
//todo extract interfaces
let accessToken: string | null = null;
let tokenExpiration: number | null = null;

export interface Geocode {
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
      console.log(accessToken);
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

interface FetchResult<T> {
  data?: T;
  error?: { message: string; status?: number };
}

export async function fetchWithToken<T>(
  url: string,
  method: string = "GET"
): Promise<FetchResult<T>> {
  const token = await ensureToken();
  if (!token) {
    return { error: { message: "Missing or invalid access token" } };
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
      return {
        error: {
          message: data.message || "An unexpected error occurred.",
          status: response.status,
        },
      };
    }

    return { data: data.data as T };
  } catch (error) {
    console.error("Error in fetchWithToken:", error);
    return {
      error: { message: "Error while fetching data. Please try again later." },
    };
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
): Promise<AmadeusActivity[]> => {
  const latitude = city.geoCode.latitude;
  const longitude = city.geoCode.longitude;

  const url = `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=5`; //todo think about radius
  return await fetchWithToken(url);
};

//hotels
export interface AmadeusHotel {
  // jsonprop na id?
  // dupeId: string;
  dupeId: number;
  name: string;
  geoCode: Geocode;
}

export const getHotels = async (
  city: AmadeusLocation
): Promise<AmadeusHotel[]> => {
  const cityCode = city.iataCode;
  const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;

  const result = await fetchWithToken<{
    data: AmadeusHotel[];
    error?: { status: number; message: string };
  }>(url);

  if (result.error) {
    if (result.error.status === 400) {
      throw new Error(result.error.message);
    } else {
      console.error(
        "Fetching hotels failed, returning mock data:",
        result.error
      );
      return hotelsMockData.data as AmadeusHotel[];
    }
  }

  return result.data!.data;
};
