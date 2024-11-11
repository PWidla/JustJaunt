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

const mapToAmadeusLocation = (data: any[]): AmadeusLocation[] => {
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

export const getLocations = async (
  cityName: string
): Promise<AmadeusLocation[]> => {
  console.log("getlocations");
  const url = `https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=${cityName}`;
  console.log(url);

  const [result, error] = await fetchWithToken<AmadeusLocation[]>(url);

  if (error) {
    if (error.status === 500) {
      console.error(
        "Fetching locations failed due to amadeus server problem, returning mock data."
      );
      return mapToAmadeusLocation(cityMockData.data);
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

export const getActivities = async (
  city: AmadeusLocation
): Promise<AmadeusActivity[]> => {
  const latitude = city.geoCode.latitude;
  const longitude = city.geoCode.longitude;

  const url = `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=5`; //todo think about radius
  const [result, error] = await fetchWithToken<AmadeusActivity[]>(url);

  if (error) {
    if (error.status === 500) {
      console.error(
        "Fetching hotels failed due to amadeus server problem, returning mock data."
      );
      return mapToAmadeusActivity(activitiesMockData.data);
    } else {
      throw new Error(error.message);
    }
  }
  return mapToAmadeusActivity(activitiesMockData.data);

  return result;
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

  const [result, error] = await fetchWithToken<AmadeusHotel[]>(url);

  if (error) {
    if (error.status === 500) {
      console.error(
        "Fetching hotels failed due to amadeus server problem, returning mock data."
      );
      return hotelsMockData.data;
    } else {
      throw new Error(error.message);
    }
  }
  return hotelsMockData.data;

  return result;
};
