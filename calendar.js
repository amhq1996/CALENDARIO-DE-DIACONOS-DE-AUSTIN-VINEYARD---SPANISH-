import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔹 SUPABASE CONNECTION
const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";
const SUPABASE_KEY = "PASTE_YOUR_ANON_KEY_HERE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let events = [];
let currentWeek = new Date();
currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());

const daysWeek = document.getElementById("daysWeek");
const weekLabel = document.getElementById("weekLabel");

const colors = ["#ff6b6b", "#6bcfff", "#6bff95", "#ffe36b", "#b46bff"];

// 🔹 FETCH EVENTS
async function loadEvents() {
  const { data } = await supabase.from("events").select("*");
  events = data || [];
}

// 🔹 ADD EVENT
async function addEvent(event) {
  await supabase.from("events").insert([event]);
  await loadEvents();
  renderWeek();
}

// 🔹 RENDER WEEK
function renderWeek() {
  daysWeek.innerHTML = "";

  const start = new Date(currentWeek);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  weekLabel.textContent = `${start.toDateString()} - ${end.toDateString()}`;

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.innerHTML = `<h3>${date.toDateString()}</h3>`;

    events
      .filter(e => e.date === dateStr)
      .forEach(e => {
        const ev = document.createElement("div");
        ev.className = "event";
        ev.style.background = e.color;
        ev.textContent = e.title;
        dayDiv.appendChild(ev);
      });

    dayDiv.onclick = () => {
      const title = prompt("Event name:");
      if (!title) return;

      const picker = document.createElement("div");
      picker.className = "color-picker";

      colors.forEach(c => {
        const dot = document.createElement("div");
        dot.className = "color";
        dot.style.background = c;
        dot.onclick = async () => {
          await addEvent({ date: dateStr, title, color: c });
          picker.remove();
        };
        picker.appendChild(dot);
      });

      dayDiv.appendChild(picker);
    };

    daysWeek.appendChild(dayDiv);
  }
}

// NAVIGATION
document.getElementById("prevWeek").onclick = () => {
  currentWeek.setDate(currentWeek.getDate() - 7);
  renderWeek();
};

document.getElementById("nextWeek").onclick = () => {
  currentWeek.setDate(currentWeek.getDate() + 7);
  renderWeek();
};

// INIT
await loadEvents();
renderWeek();
