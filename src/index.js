import "./css/styles.css";
import Notiflix from "notiflix";
import "notiflix/dist/notiflix-3.2.6.min.css";
import debounce from "lodash.debounce";
import { CountriesApi } from "./fetchCountries";

const inputEl = document.querySelector("#search-box");
const infoEl = document.querySelector(".country-info");
// const listEl = document.querySelector(".country-list");

const DEBOUNCE_DELAY = 300;

const countriesApi = new CountriesApi();

inputEl.addEventListener("input", debounce(findCountry, DEBOUNCE_DELAY));

function findCountry(e) {
  const query = e.target.value.trim();
  console.log(query);

  if (query === "") infoEl.innerHTML = "";

  countriesApi
    .getCountry(query)
    .then((data) => {
      console.log(data);

      if (data.length > 10) {
        Notiflix.Notify.info(
          "Too many matches found. Please enter a more specific name."
        );
        return;
      } else if (data.length <= 10 && data.length > 1) {
        renderList(data);
      } else {
        renderInfo(data);
      }
    })
    .catch((err) => {
      console.log(err);
      infoEl.innerHTML = "";

      Notiflix.Notify.failure("Oops, there is no country with that name");
    });
}

function renderInfo(data) {
  const markup = data
    .map((el) => {
      const languages = Object.values(el.languages);
      return `
      <h1>
        <img width="40" src="${el.flags.svg}"
        <p>${el.name.official}</p>
      </h1>
      <p>capital: ${el.capital}</p>  
      <p>population: ${el.population}</p>
      <p>languages: ${languages}</p>`;
    })
    .join("");

  infoEl.innerHTML = markup;
}

function renderList(data) {
  const markup = data
    .map((el) => {
      return `
      <img width="40" src="${el.flags.svg}"
      <p>${el.name.official}</p>
    `;
    })
    .join("");

  infoEl.innerHTML = markup;
}
