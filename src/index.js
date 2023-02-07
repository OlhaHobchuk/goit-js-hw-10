import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector("#search-box"),
    list: document.querySelector('.country-list'),
    info: document.querySelector(".country-info"),
}

refs.list.style.listStyle = "none";

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  const country = event.target.value.trim();
 if (country === "") {
        Notiflix.Notify.info('Please, enter something');
       clearPage();
        return
 } else {
     fetchCountries(country)
    .then(makeMarkup)
    .catch(onFetchError);
    }
}

function makeMarkup (countries) {
  let markup = '';
  if (countries.length >= 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
      clearPage()
    return;
  } else if (countries.length === 1) {
    markup = countries
      .map(
        ({
          name: { official },
          flags: { svg },
          capital,
          population,
          languages,
        }) => {
          const lang = Object.values(languages);
          return `<p class="counry-title" style="font-weight: bold"><img width="40" height="20" src=${svg}> ${official}</p>
        <p class="text" style="font-weight: bold">Capital: <span class="span" style="font-weight: normal">${capital}</span></p>
        <p class="text" style="font-weight: bold">Population: <span class="span" style="font-weight: normal">${population}</span></p>
        <p class="text" style="font-weight: bold">Languages: <span class="span" style="font-weight: normal">${lang}</span></p>`;
        }
      )
      .join('');
    clearPage()
    refs.info.innerHTML = markup;
  } else {
    markup = countries
      .map(({ name: { official }, flags: { svg } }) => {
        return `<li><img src=${svg} width="40" height="20"> ${official}</li>`;
      })
      .join('');
    clearPage()
    refs.list.innerHTML = markup;
    
  }
}

function onFetchError() {
    clearPage()
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearPage() {
    refs.info.innerHTML = "";
    refs.list.innerHTML = "";
}