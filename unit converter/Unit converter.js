const categorySelect = document.getElementById("category");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const inputValue = document.getElementById("inputValue");
const resultDiv = document.getElementById("result");

const units = {
  length: {
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
    inches: 39.3701,
    centimeters: 100
  },
  mass: {
    grams: 1,
    kilograms: 0.001,
    pounds: 0.00220462,
    ounces: 0.035274,
    tonnes: 0.000001
  },
  temperature: {
    Celsius: "C",
    Fahrenheit: "F",
    Kelvin: "K"
  },
  speed: {
    "m/s": 1,
    "km/h": 3.6,
    "mph": 2.23694,
    "ft/s": 3.28084
  },
  volume: {
    liters: 1,
    milliliters: 1000,
    gallons: 0.264172,
    quarts: 1.05669,
    cups: 4.22675
  },
  time: {
    seconds: 1,
    minutes: 1 / 60,
    hours: 1 / 3600,
    days: 1 / 86400
  },
  area: {
    "square meters": 1,
    "square kilometers": 0.000001,
    "square miles": 3.861e-7,
    "square feet": 10.7639,
    "acres": 0.000247105,
    "hectares": 0.0001
  }
};

categorySelect.addEventListener("change", () => {
  const category = categorySelect.value;
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  if (category === "temperature") {
    Object.keys(units.temperature).forEach(unit => {
      fromUnit.add(new Option(unit, unit));
      toUnit.add(new Option(unit, unit));
    });
  } else {
    Object.keys(units[category]).forEach(unit => {
      fromUnit.add(new Option(unit, unit));
      toUnit.add(new Option(unit, unit));
    });
  }
});

document.getElementById("converterForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const category = categorySelect.value;
  const from = fromUnit.value;
  const to = toUnit.value;
  const value = parseFloat(inputValue.value);

  if (isNaN(value)) {
    resultDiv.textContent = "Please enter a valid number.";
    return;
  }

  let converted;

  if (category === "temperature") {
    converted = convertTemperature(value, from, to);
  } else {
    const fromFactor = units[category][from];
    const toFactor = units[category][to];
    converted = value * (toFactor / fromFactor);
  }

  resultDiv.textContent = `${value} ${from} = ${converted.toFixed(4)} ${to}`;
});

function convertTemperature(value, from, to) {
  let celsius;

  if (from === "Celsius") celsius = value;
  else if (from === "Fahrenheit") celsius = (value - 32) * (5 / 9);
  else if (from === "Kelvin") celsius = value - 273.15;

  if (to === "Celsius") return celsius;
  else if (to === "Fahrenheit") return (celsius * 9 / 5) + 32;
  else if (to === "Kelvin") return celsius + 273.15;
}
