import { preprocessed } from "./preprocessed.js";

class Observable {
  #v;
  #subscribers;
  constructor() {
    this.#subscribers = [];
  }
  subscribe(callback) {
    this.#subscribers.push(callback);
  }
  get val() {
    return this.#v;
  }
  set val(next) {
    this.#v = next;
    for (const sub of this.#subscribers) {
      sub(this.#v);
    }
  }
}

const { startYear: dataStartYear, data: allData } = preprocessed;

const domYear = document.querySelector("#year");
const domYearTextbox = document.querySelector("#year-textbox");
const domSlider = document.querySelector("#slider");
const domFrequencyTextbox = document.querySelector("#frequency-textbox");
const domPeriodTextbox = document.querySelector("#period-textbox");
const domNumStates = document.querySelector("#num-states");
const domData = document.querySelector("#data");
const domDataList = document.querySelector("#data-list");
const domMapSvg = document.querySelector("#map-svg");

const fullCycle = 13 * 17;
const baselineYear = 2024;
const initYear = 2024;
const year = new Observable();

year.subscribe((y) => {
  const yStr = y.toString();
  domYear.textContent = yStr;
  domYearTextbox.value = yStr;
});

domYearTextbox.addEventListener("input", () => {
  domYear.ariaBusy = "true";
  domData.ariaBusy = "true";
  const parsedYear = Number.parseInt(domYearTextbox.value);
  if (!Number.isNaN(parsedYear)) {
    year.val = parsedYear;
  }
});

domYearTextbox.addEventListener("change", () => {
  domYear.ariaBusy = "false";
  domData.ariaBusy = "false";
});

function positiveModulo(n, d) {
  return (n % d + d) % d;
}

let sliderBase = baselineYear;

year.subscribe((y) => {
  const modulo = positiveModulo(y - baselineYear, fullCycle);
  domSlider.value = modulo.toString();
  sliderBase = y - modulo;
});

domSlider.addEventListener("input", () => {
  domYear.ariaBusy = "true";
  domData.ariaBusy = "true";
  year.val = sliderBase + Number(domSlider.value);
});

domSlider.addEventListener("change", () => {
  domYear.ariaBusy = "false";
  domData.ariaBusy = "false";
});

function frequencyToPeriod(freq) {
  const msPerMin = 60 * 1000;
  return msPerMin / freq;
}

const periodToFrequency = frequencyToPeriod;

let interval = null;

function setupAnimationInterval(period) {
  domYear.ariaBusy = "true";
  domData.ariaBusy = "true";
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
  if (period !== null) {
    interval = setInterval(() => {
      ++year.val;
    }, period);
  }
}

domFrequencyTextbox.addEventListener("input", () => {
  const parsedFrequency = Number.parseFloat(domFrequencyTextbox.value);
  const period =
    !Number.isNaN(parsedFrequency) && parsedFrequency > 0
      ? frequencyToPeriod(parsedFrequency)
      : null
  ;
  setupAnimationInterval(period);
  domPeriodTextbox.value = (
    period !== null
      ? period.toFixed(2)
      : ""
  );
});

domPeriodTextbox.addEventListener("input", () => {
  const parsedPeriod = Number.parseFloat(domPeriodTextbox.value);
  const period =
    !Number.isNaN(parsedPeriod) && parsedPeriod > 0
      ? parsedPeriod
      : null
  ;
  setupAnimationInterval(period);
  domFrequencyTextbox.value = (
    period !== null
      ? periodToFrequency(period).toFixed(2)
      : ""
  );
});

function animationChangeHandler() {
  domYear.ariaBusy = "false";
  if (interval === null) {
    domData.ariaBusy = "false";
  }
}

domFrequencyTextbox.addEventListener("change", animationChangeHandler);
domPeriodTextbox.addEventListener("change", animationChangeHandler);

const svgUrl =
  "https://raw.githubusercontent.com/" +
  "YawarRaza7349/CyclicCicadas/master/data/usMap.svg";
const svgText = await (await fetch(svgUrl)).text();
const svgContents =
  new DOMParser().parseFromString(svgText, "image/svg+xml")
    .documentElement.childNodes;
domMapSvg.append(...svgContents);

const fragment = document.createDocumentFragment();

for (const stateData of allData) {
  const dlItem = document.createElement("div");
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.append(stateData.state);
  dlItem.append(dt, dd);
  fragment.append(dlItem);
  stateData.datumElem = dd;
  stateData.dlItem = dlItem;
  stateData.svg = document.getElementById(stateData.state);
}

domDataList.append(fragment);

for (const path of document.querySelectorAll("#map-svg path")) {
  path.style.stroke = "black";
}

year.subscribe((y) => {
  domData.ariaBusy = "true";
  let numStates = 0;
  for (const { state, cycle13, cycle17, datumElem, dlItem, svg } of allData) {
    const deltaYear = y - dataStartYear;
    const total =
      cycle13[positiveModulo(deltaYear, 13)] +
      cycle17[positiveModulo(deltaYear, 17)];
    datumElem.textContent = total.toString();
    if (total === 0) {
      dlItem.ariaHidden = "true";
    } else {
      dlItem.ariaHidden = "false";
      ++numStates;
    }
    const colorValue = Math.log1p(total) * 26;
    const green = Math.trunc(255 - colorValue / 2);
    const blue = Math.trunc(255 - colorValue);
    svg.style.fill = `rgb(255 ${green} ${blue})`;
  }
  domNumStates.textContent = numStates.toString();
  domData.ariaBusy = "false";
});

year.val = initYear;
