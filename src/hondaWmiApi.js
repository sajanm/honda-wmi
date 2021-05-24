import { config } from "./config";

export const hondaWmiApi = {
    getData() {
      return fetch(config.API_URL)
        .then((response) => response.json());
    }
  }