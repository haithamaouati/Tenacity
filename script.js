const daysCounter = document.getElementById("daysCounter");
const timer = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");

const relapseBtn = document.getElementById("relapseBtn");
const clearLogBtn = document.getElementById("clearLogBtn");
const logList = document.getElementById("logList");

let startTime = localStorage.getItem("startTime") || Date.now();
localStorage.setItem("startTime", startTime);

function updateTimer() {
  const now = Date.now();
  const elapsed = now - startTime;

  const seconds = Math.floor(elapsed / 1000) % 60;
  const minutes = Math.floor(elapsed / 60000) % 60;
  const hours = Math.floor(elapsed / 3600000) % 24;
  const days = Math.floor(elapsed / 86400000);

  daysCounter.textContent = `${days} days`;
  timer.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  updateProgress(days);
  updateRank(days);
}

function updateProgress(days) {
  const maxDays = 500;
  const percent = Math.min(100, (days / maxDays) * 100);
  progressBar.style.width = percent + "%";
}

relapseBtn.addEventListener("click", () => {
  const now = new Date().toLocaleString();
  const relapseEntry = document.createElement("li");
  relapseEntry.textContent = `Relapsed on ${now}`;
  logList.appendChild(relapseEntry);

  let logs = JSON.parse(localStorage.getItem("relapseLog") || "[]");
  logs.push(`Relapsed on ${now}`);
  localStorage.setItem("relapseLog", JSON.stringify(logs));

  startTime = Date.now();
  localStorage.setItem("startTime", startTime);
});

clearLogBtn.addEventListener("click", () => {
  logList.innerHTML = "";
  localStorage.removeItem("relapseLog");
});

function loadLog() {
  const logs = JSON.parse(localStorage.getItem("relapseLog") || "[]");
  logs.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    logList.appendChild(li);
  });
}

// Restored RANKS (Full List)
const rankName = document.getElementById("rankName");
const allRanksDiv = document.getElementById("allRanks");

const ranks = [
  { name: "Scout", days: 1 },
  { name: "Private", days: 3 },
  { name: "Corporal", days: 5 },
  { name: "Sergeant", days: 7 },
  { name: "Master Sergeant", days: 10 },
  { name: "Knight", days: 14 },
  { name: "Knight-Lieutenant", days: 21 },
  { name: "Knight-Captain", days: 30 },
  { name: "Knight-Champion", days: 60 },
  { name: "Champion of the Light", days: 90 },
  { name: "Commander", days: 120 },
  { name: "Conqueror", days: 150 },
  { name: "Marshal", days: 180 },
  { name: "Field Marshal", days: 240 },
  { name: "Grand Marshal", days: 300 },
  { name: "High Overlord", days: 365 },
  { name: "The Immortal", days: 500 }
];

function updateRank(currentDays) {
  let current = ranks[0];
  for (const rank of ranks) {
    if (currentDays >= rank.days) current = rank;
  }
  rankName.textContent = current.name;
  renderRanks(current.name);
}

function renderRanks(currentRank) {
  allRanksDiv.innerHTML = "";
  for (const rank of ranks) {
    const div = document.createElement("div");
    div.classList.add("rank-item");
    if (rank.name === currentRank) {
      div.classList.add("current");
    }
    div.textContent = `${rank.name} (${rank.days} days)`;
    allRanksDiv.appendChild(div);
  }
}

loadLog();
setInterval(updateTimer, 1000);
