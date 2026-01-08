/* ---------- PRODUCTS ---------- */
const products = [
  { name: "Milk", calories: 60, protein: 3, fat: 3.2, carbs: 4.7 },
  { name: "Chicken breast", calories: 165, protein: 31, fat: 3.6, carbs: 0 },
  { name: "Rice", calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
  { name: "Egg", calories: 155, protein: 13, fat: 11, carbs: 1.1 },
];

/* ---------- STATE ---------- */
const meals =
  JSON.parse(localStorage.getItem("meals")) || {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  };

const weekData =
  JSON.parse(localStorage.getItem("weekCalories")) || {};

/* ---------- SELECT ---------- */
const select = document.getElementById("product-select");
products.forEach((p, i) => {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = p.name;
  select.appendChild(option);
});

/* ---------- ADD PRODUCT ---------- */
document.getElementById("add-btn").addEventListener("click", () => {
  const product = products[select.value];
  const weight = Number(document.getElementById("weight").value);
  const meal = document.getElementById("meal").value;

  if (!weight) return alert("Enter weight");

  meals[meal].push({ ...product, weight });
  save();
  render();
});

/* ---------- SAVE ---------- */
function save() {
  localStorage.setItem("meals", JSON.stringify(meals));
}

/* ---------- RENDER ---------- */
function render() {
  let totals = { calories: 0, protein: 0, fat: 0, carbs: 0 };

  Object.keys(meals).forEach((meal) => {
    const list = document.getElementById(`${meal}-list`);
    list.innerHTML = "";

    meals[meal].forEach((item, index) => {
      const factor = item.weight / 100;

      totals.calories += item.calories * factor;
      totals.protein += item.protein * factor;
      totals.fat += item.fat * factor;
      totals.carbs += item.carbs * factor;

      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} – ${item.weight} g
        <button onclick="removeItem('${meal}', ${index})">❌</button>
      `;
      list.appendChild(li);
    });
  });

  document.getElementById("calories").textContent = totals.calories.toFixed(0);
  document.getElementById("protein").textContent = totals.protein.toFixed(1);
  document.getElementById("fat").textContent = totals.fat.toFixed(1);
  document.getElementById("carbs").textContent = totals.carbs.toFixed(1);

  saveDailyCalories(totals.calories);
  renderChart();
}

/* ---------- REMOVE ---------- */
function removeItem(meal, index) {
  meals[meal].splice(index, 1);
  save();
  render();
}

/* ---------- WEEK DATA ---------- */
function saveDailyCalories(calories) {
  const today = new Date().toISOString().slice(0, 10);
  weekData[today] = calories;
  localStorage.setItem("weekCalories", JSON.stringify(weekData));
}

/* ---------- CHART ---------- */
function renderChart() {
  const days = Object.keys(weekData).slice(-7);
  const values = days.map((d) => weekData[d]);

  const avg =
    values.reduce((a, b) => a + b, 0) / (values.length || 1);
  document.getElementById(
    "average"
  ).textContent = `Average calories per week: ${avg.toFixed(0)}`;

  if (window.chart) window.chart.destroy();

  window.chart = new Chart(document.getElementById("weekChart"), {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "Calories",
          data: values,
        },
      ],
    },
  });
}

render();

/* ---------- TRANSLATION ---------- */
const translations = {
  ua: {
    title: "Калькулятор калорій",
    add: "Додати продукт",
    summary: "Підсумок за день",
    weekly: "Калорії за тиждень",
  },
  en: {
    title: "Calorie & Macro Calculator",
    add: "Add product",
    summary: "Daily summary",
    weekly: "Weekly calories",
  },
};

let lang = "en";

document.getElementById("lang-toggle").addEventListener("click", () => {
  lang = lang === "en" ? "ua" : "en";
  applyLang();
});

function applyLang() {
  document.getElementById("title").textContent = translations[lang].title;
  document.getElementById("add-product-title").textContent =
    translations[lang].add;
  document.getElementById("summary-title").textContent =
    translations[lang].summary;
  document.getElementById("weekly-title").textContent =
    translations[lang].weekly;
}

applyLang();
