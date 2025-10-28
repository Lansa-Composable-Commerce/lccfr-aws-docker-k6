import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { API } from "@/utils/constants";
import { Country } from "@/types";

interface CountriesResponse {
  Countries: Country[];
}

export async function getCountries() {
  const axios = axiosInstance();

  try {
    const response: AxiosResponse<CountriesResponse> = await axios.get(
      API.COUNTRIES,
    );

    return response.data.Countries;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on getting countries:", error.response);
    } else {
      console.error("An error occurred on getting countries:", error);
    }
  }
}
