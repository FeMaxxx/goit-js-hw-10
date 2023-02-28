export class CountriesApi {
  getCountry(query) {
    const countryName = query;
    const BACE_URL = "https://restcountries.com/v3.1";
    const PARAMS = ["name", "flags", "capital", "population", "languages"].join(
      ","
    );

    return fetch(`${BACE_URL}/name/${countryName}?fields=${PARAMS}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw new Error(res.status);
      })
      .catch((err) => {
        return err;
      });
  }
}
