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

  if (query === "") {
    infoEl.style.border = "";
    infoEl.innerHTML = "";

    return;
  }

  countriesApi
    .getCountry(query)
    .then((data) => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          "Too many matches found. Please enter a more specific name."
        );
        infoEl.style.border = "";
        infoEl.innerHTML = "";
        return;
      } else if (data.length <= 10 && data.length > 1) {
        renderList(data);
      } else {
        renderInfo(data);
      }
    })
    .catch((err) => {
      console.log(err);

      if (query === "") {
        return;
      }

      infoEl.style.border = "";
      infoEl.innerHTML = "";

      Notiflix.Notify.failure("Oops, there is no country with that name");
    });
}

function renderInfo(data) {
  infoEl.style.border = "3px solid green";
  const markup = data
    .map((el) => {
      const languages = Object.values(el.languages);
      return `
      <h1 class="title">${el.name.common}</h1>
      <img class="flag" src="${el.flags.svg}"
      <ul>
        <li class="info-item"><b>capital:</b> ${el.capital}</li>  
        <li class="info-item"><b>population:</b> ${el.population}</li>
        <li class="info-item"><b>languages:</b> ${languages}</li>
      </ul>`;
    })
    .join("");

  infoEl.innerHTML = markup;
}

function renderList(data) {
  infoEl.style.border = "3px solid green";
  const markup = data
    .map((el) => {
      return `
      <div class="country-list">
        <p class="country-list__title">${el.name.common}</p>
        <img class="flag" width="40" src="${el.flags.svg}"
      </div>
    `;
    })
    .join("");

  infoEl.innerHTML = markup;
}
