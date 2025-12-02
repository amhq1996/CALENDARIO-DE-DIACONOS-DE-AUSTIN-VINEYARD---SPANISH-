import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- Supabase Setup ---
const SUPABASE_URL = "https://hpsrrjrxtlmwfjjepbkr.supabase.co";       // replace with your Supabase project URL
const SUPABASE_KEY = "process.env.SUPABASE_KE";   // replace with your anon/public key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let events = [];
let currentWeek = new Date();
currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()); // start Sunday

const daysWeekDiv = document.getElementById("daysWeek");
const weekLabel = document.getElementById("weekLabel");
const prevWeekBtn = document.getElementById("prevWeek");
const nextWeekBtn = document.getElementById("nextWeek");

// Colors for dropdown
const colors = [
  { name: "Red", value: "#ff6b6b" },
  { name: "Blue", value: "#6bcfff" },
  { name: "Green", value: "#6bff95" },
  { name: "Yellow", value: "#ffe36b" },
  { name: "Purple", value: "#b46bff" }
];

// --- Fetch events from Supabase ---
async function fetchEvents() {
  const { data } = await supabase.from('events').select('*');
  events = data || [];
}

// --- Add event to Supabase ---
async function addEventToSupabase(event) {
  await supabase.from('events').insert([event]);
}

// --- Render the calendar week ---
function renderWeek() {
  daysWeekDiv.innerHTML = "";
  const startDate = new Date(currentWeek);
  const endDate = new Date(currentWeek);
  endDate.setDate(startDate.getDate() + 6);
  weekLabel.textContent = `${startDate.toDateString()} - ${endDate.toDateString()}`;

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + i);

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.innerHTML = `<h3>${dayDate.toDateString()}</h3>`;

    // Show events for this day
    const dayEvents = events.filter(ev => new Date(ev.date).toDateString() === dayDate.toDateString());
    dayEvents.forEach(ev => {
      const evDiv = document.createElement("div");
      evDiv.classList.add("event");
      evDiv.style.background = ev.color;
      evDiv.textContent = ev.title;
      dayDiv.appendChild(evDiv);
    });

    // Click to add new event
    dayDiv.onclick = async () => {
      const title = prompt("Event title:");
      if (!title) return;

      // Color selection
      const colorNames = colors.map(c => c.name).join(", ");
      let colorName = prompt(`Choose color: ${colorNames}`);
      const selectedColor = colors.find(c => c.name.toLowerCase() === (colorName || "").toLowerCase());
      const color = selectedColor ? selectedColor.value : "#ff6b6b";

      const newEvent = {
        date: dayDate.toISOString().split("T")[0],
        title,
        color
      };

      await addEventToSupabase(newEvent);
      await loadAndRender();
    };

    daysWeekDiv.appendChild(dayDiv);
  }
}

// --- Load events and render ---
async function loadAndRender() {
  await fetchEvents();
  renderWeek();
}

// --- Week navigation ---
prevWeekBtn.onclick = () => {
  currentWeek.setDate(currentWeek.getDate() - 7);
  loadAndRender();
};
nextWeekBtn.onclick = () => {
  currentWeek.setDate(currentWeek.getDate() + 7);
  loadAndRender();
};

// Initial load
loadAndRender();
