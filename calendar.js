import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* 🔴 REPLACE THESE WITH YOUR OWN */
const SUPABASE_URL = "https://hpsrrjrxtlmwfjjepbkr.supabase.co";
const SUPABASE_KEY = "process.env.SUPABASE_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let events = [];
let currentWeek = new Date();
currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());

const daysWeekDiv = document.getElementById("daysWeek");
const weekLabel = document.getElementById("weekLabel");

document.getElementById("prevWeek").onclick = () => {
  currentWeek.setDate(currentWeek.getDate() - 7);
  loadCalendar();
};

document.getElementById("nextWeek").onclick = () => {
  currentWeek.setDate(currentWeek.getDate() + 7);
  loadCalendar();
};

async function fetchEvents() {
  const { data } = await supabase.from("events").select("*");
  events = data || [];
}

async function addEvent(event) {
  await supabase.from("events").insert([event]);
}

function renderWeek() {
  daysWeekDiv.innerHTML = "";

  const start = new Date(currentWeek);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  weekLabel.textContent = `${start.toDateString()} - ${end.toDateString()}`;

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.innerHTML = `<h3>${date.toDateString()}</h3>`;

    events
      .filter(e => new Date(e.date).toDateString() === date.toDateString())
      .forEach(e => {
        const ev = document.createElement("div");
        ev.className = "event";
        ev.style.background = e.color;
        ev.textContent = e.title;
        dayDiv.appendChild(ev);
      });

    dayDiv.onclick = async () => {
      const title = prompt("Event title:");
      if (!title) return;

      const color = prompt("Color (red, blue, green, purple)?", "blue");

      const colorMap = {
        red: "#ef4444",
        blue: "#3b82f6",
        green: "#22c55e",
        purple: "#8b5cf6"
      };

      await addEvent({
        title,
        color: colorMap[color] || "#3b82f6",
        date: date.toISOString().split("T")[0]
      });

      loadCalendar();
    };

    daysWeekDiv.appendChild(dayDiv);
  }
}

async function loadCalendar() {
  await fetchEvents();
  renderWeek();
}

loadCalendar();
