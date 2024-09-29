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
  console.log(accessToken); //
  return accessToken;
};

//
interface Location {
  type: string;
  subType: string; //airport/city
  name: string;
  geoCode: Geocode;
  //include airports
  address: Address;
}

interface Address {
  cityName: string;
  cityCode: string;
  countryName: string;
  countryCode: string;
  regionCode: string;
}

export const searchCity = async (
  cityName: string
): Promise<Location | null> => {
  try {
    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/cities?&keyword=${cityName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log(data); //

    if (response.ok) {
      return data;
    } else {
      console.error("Error fetching city information:", data);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

//activity
export interface Activity {
  id: string;
  name: string;
  description: string;
  geoCode: Geocode;
  pictures: string;
}

export const getActivities = async (
  city: Location
): Promise<Array<Activity> | null> => {
  try {
    const latitude = city.geoCode.latitude;
    const longitude = city.geoCode.longitude;

    const response = await fetch(
      //radius parameter, 0 to 20
      `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=5`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log(data); //

    if (response.ok) {
      return data;
    } else {
      console.error("Error fetching activities:", data);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
