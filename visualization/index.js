"use strict";

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



const domEditYear = document.querySelector("#edit-year");
const domSubmitYear = document.querySelector("#submit-year");
const domYearWidgetDormant = document.querySelector("#year-widget-dormant");
const domYearWidgetActive = document.querySelector("#year-widget-active");
const domYearTextbox = document.querySelector("#year-textbox");
const domYear = document.querySelector("#year");
const domSlider = document.querySelector("#slider");
const domAnimate = document.querySelector("#animate");
const domPause = document.querySelector("#pause");
const domData = document.querySelector("#data");

const fullCycle = 13 * 17;
const baselineYear = 2024;
const initYear = 2024;
const year = new Observable();

year.subscribe((y) => {
  domYear.innerText = y;
});

domEditYear.addEventListener("click", () => {
  domYearWidgetDormant.hidden = true;
  domYearTextbox.value = year.val;
  domYearWidgetActive.hidden = false;
});

domYearTextbox.addEventListener("input", () => {
  domSubmitYear.disabled = !domYearTextbox.validity.valid;
});

domSubmitYear.addEventListener("click", () => {
  const parsed = Number.parseInt(domYearTextbox.value);
  if (!Number.isNaN(parsed)) {
    domYearWidgetActive.hidden = true;
    year.val = parsed;
    domYearWidgetDormant.hidden = false;
  }
});

function positiveModulo(n, d) {
  return (n % d + d) % d;
}

let sliderBase = baselineYear;

year.subscribe((y) => {
  const modulo = positiveModulo(y - baselineYear, fullCycle);
  domSlider.value = modulo;
  sliderBase = y - modulo;
});

domSlider.addEventListener("input", () => {
  year.val = sliderBase + (+domSlider.value);
});

let interval;

domAnimate.addEventListener("click", () => {
  domAnimate.hidden = true;
  interval = setInterval(() => {
    ++year.val;
  }, 500);
  domData.ariaBusy = true;
  domPause.hidden = false;
});

domPause.addEventListener("click", () => {
  domPause.hidden = true;
  clearInterval(interval);
  domData.ariaBusy = false;
  domAnimate.hidden = false;
});

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
  for (const { state, cycle13, cycle17, textNode, dlItem, svg } of allData) {
    const deltaYear = y - dataStartYear;
    const total = cycle13[positiveModulo(deltaYear, 13)] + cycle17[positiveModulo(deltaYear, 17)];
    textNode.nodeValue = total;
    dlItem.ariaHidden = total === 0 ? "true" : "false";
    const colorValue = Math.log1p(total) * 26;
    svg.style.fill = "rgb(255 " + Math.trunc(255 - colorValue / 2) + " " + Math.trunc(255 - colorValue) + ")";
  }
});

year.val = initYear;
