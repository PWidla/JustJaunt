import hotelsMockData from "./AmadeusMock/hotels.json";
import locationMockData from "./AmadeusMock/locations.json";
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

export async function fetchWithToken<T>(
  url: string,
  method: string = "GET"
): Promise<[T, { message: string; status?: number } | null]> {
  const token = await ensureToken();
  if (!token) {
    return [[] as T, { message: "Missing or invalid access token" }];
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
      return [
        [] as T,
        {
          message: data.message || "An unexpected error occurred.",
          status: response.status,
        },
      ];
    }

    return [data.data as T, null];
  } catch (error) {
    console.error("Error in fetchWithToken:", error);
    return [
      [] as T,
      { message: "Error while fetching data. Please try again later." },
    ];
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

export const mapToAmadeusLocation = (data: any[]): AmadeusLocation[] => {
  return data.map((item) => ({
    type: item.type,
    subType: item.subType,
    name: item.name,
    iataCode: item.iataCode,
    geoCode: {
      latitude: item.geoCode.latitude,
      longitude: item.geoCode.longitude,
    },
    address: {
      cityName: item.address.cityName,
      cityCode: item.address.cityCode,
      countryName: item.address.countryName,
      countryCode: item.address.countryCode,
      regionCode: item.address.regionCode,
    },
  }));
};

export const getMockLocations = () => {
  return mapToAmadeusLocation(locationMockData.data);
};

export const getLocations = async (
  cityName: string
): Promise<AmadeusLocation[]> => {
  console.log("getlocations");
  const url = `https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=${cityName}&max=5`;
  console.log(url);

  const [result, error] = await fetchWithToken<AmadeusLocation[]>(url);

  if (error) {
    if (error.status === 500) {
      console.error(
        "Fetching locations failed due to amadeus server problem, returning mock data."
      );
      return getMockLocations();
    } else {
      throw new Error(error.message);
    }
  }

  return result;
};

//activity
export interface AmadeusActivity {
  id: string;
  name: string;
  description: string;
  geoCode: Geocode;
  pictures: string;
}

const mapToAmadeusActivity = (data: any[]): AmadeusActivity[] => {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    geoCode: {
      latitude: item.geoCode.latitude,
      longitude: item.geoCode.longitude,
    },
    pictures: item.pictures && item.pictures.length > 0 ? item.pictures[0] : "",
  }));
};

export const getMockActivities = () => {
  return mapToAmadeusActivity(activitiesMockData.data);
};

export const getActivities = async (
  city: AmadeusLocation
): Promise<{ activities: AmadeusActivity[]; isMock: boolean }> => {
  const latitude = city.geoCode.latitude;
  const longitude = city.geoCode.longitude;

  const url = `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=5`; //todo think about radius
  const [result, error] = await fetchWithToken<AmadeusActivity[]>(url);

  if (error) {
    if (error.status === 500) {
      console.error(
        "Fetching hotels failed due to amadeus server problem, returning mock data."
      );

      return { activities: [], isMock: true };
    } else {
      throw new Error(error.message);
    }
  }
  return mapToAmadeusActivity(activitiesMockData.data);

  return { activities: result, isMock: false };
};

//hotels
export interface AmadeusHotel {
  // jsonprop na id?
  // dupeId: string;
  dupeId: number;
  name: string;
  geoCode: Geocode;
}

export const getMockHotels = () => {
  return hotelsMockData.data;
};

export const getHotels = async (
  city: AmadeusLocation
): Promise<{ hotels: AmadeusHotel[]; isMock: boolean }> => {
  const cityCode = city.iataCode;
  const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;

  const [result, error] = await fetchWithToken<AmadeusHotel[]>(url);

  if (error) {
    if (error.status === 500) {
      console.error(
        "Fetching hotels failed due to amadeus server problem, returning mock data."
      );
      return { hotels: [], isMock: true };
    } else {
      throw new Error(error.message);
    }
  }
  return hotelsMockData.data;

  return { hotels: result, isMock: true };
};
