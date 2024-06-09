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
const domAnimate = document.querySelector("#animate");
const domData = document.querySelector("#data");
const domMapSvg = document.querySelector("#map svg");

const fullCycle = 13 * 17;
const baselineYear = 2024;
const initYear = 2024;
const year = new Observable();

year.subscribe((y) => {
  const yStr = y.toString();
  domYear.innerText = yStr;
  domYearTextbox.value = yStr;
});

domYearTextbox.addEventListener("input", () => {
  domYear.ariaBusy = "true";
  domData.ariaBusy = "true";
  const parsed = Number.parseInt(domYearTextbox.value);
  if (!Number.isNaN(parsed)) {
    year.val = parsed;
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

let interval;

domAnimate.addEventListener("change", () => {
  if (domAnimate.checked) {
    domData.ariaBusy = "true";
    interval = setInterval(() => {
      ++year.val;
    }, 500);
  } else {
    clearInterval(interval);
    domData.ariaBusy = "false";
  }
});

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
  stateData.svg = document.getElementById(stateData.state);
  stateData.textNode = document.createTextNode("");
  stateData.dlItem = document.createElement("div");
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.append(stateData.state);
  dd.append(stateData.textNode);
  stateData.dlItem.append(dt, dd);
  fragment.append(stateData.dlItem);
}

domData.append(fragment);

for (const path of document.querySelectorAll("#map path")) {
  path.style.stroke = "black";
}

year.subscribe((y) => {
  domData.ariaBusy = "true";
  for (const { state, cycle13, cycle17, textNode, dlItem, svg } of allData) {
    const deltaYear = y - dataStartYear;
    const total =
      cycle13[positiveModulo(deltaYear, 13)] +
      cycle17[positiveModulo(deltaYear, 17)];
    textNode.nodeValue = total.toString();
    dlItem.ariaHidden = total === 0 ? "true" : "false";
    const colorValue = Math.log1p(total) * 26;
    const green = Math.trunc(255 - colorValue / 2);
    const blue = Math.trunc(255 - colorValue);
    svg.style.fill = `rgb(255 ${green} ${blue})`;
  }
  domData.ariaBusy = "false";
});

year.val = initYear;
