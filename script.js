const daysCounter = document.getElementById('daysCounter');
const timer = document.getElementById('timer');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const relapseBtn = document.getElementById('relapseBtn');
const logList = document.getElementById('logList');
const clearLogBtn = document.getElementById('clearLogBtn');
const rankNameEl = document.getElementById('rankName');

let startTime = localStorage.getItem('startTime');
if (!startTime) {
  startTime = Date.now();
  localStorage.setItem('startTime', startTime);
}

let log = JSON.parse(localStorage.getItem('log')) || [];

const quotes = [
  { text: "Stay strong.", author: "Unknown" },
  { text: "A man of focus. Commitment. Sheer will.", author: "Viggo Tarasov" },
  { text: "You are stronger than your urges.", author: "Anonymous" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" }
];

const ranks = [
  { title: "Scout", days: 1 },
  { title: "Private", days: 3 },
  { title: "Corporal", days: 5 },
  { title: "Sergeant", days: 7 },
  { title: "Master Sergeant", days: 10 },
  { title: "Knight", days: 14 },
  { title: "Knight-Lieutenant", days: 21 },
  { title: "Knight-Captain", days: 30 },
  { title: "Knight-Champion", days: 60 },
  { title: "Champion of the Light", days: 90 },
  { title: "Commander", days: 120 },
  { title: "Conqueror", days: 150 },
  { title: "Marshal", days: 180 },
  { title: "Field Marshal", days: 240 },
  { title: "Grand Marshal", days: 300 },
  { title: "High Overlord", days: 365 },
  { title: "The Immortal", days: 500 }
];

function updateRank(days) {
  let currentRank = "Unranked";
  for (let i = 0; i < ranks.length; i++) {
    if (days >= ranks[i].days) {
      currentRank = ranks[i].title;
    } else {
      break;
    }
  }
  rankNameEl.textContent = currentRank;
}

function updateTimer() {
  const now = Date.now();
  const elapsed = now - startTime;
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
  const seconds = Math.floor((elapsed / 1000) % 60);

  daysCounter.textContent = `${days.toString().padStart(2, '0')} days`;
  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  updateRank(days);
}

function updateQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  quoteText.textContent = `"${quotes[index].text}"`;
  quoteAuthor.textContent = `- ${quotes[index].author}`;
}

function updateLog() {
  logList.innerHTML = '';
  log.forEach(item => {
    const li = document.createElement('li');
    li.textContent = new Date(item).toLocaleString();
    logList.appendChild(li);
  });
}

relapseBtn.addEventListener('click', () => {
  log.push(Date.now());
  localStorage.setItem('log', JSON.stringify(log));
  startTime = Date.now();
  localStorage.setItem('startTime', startTime);
  updateLog();
});

clearLogBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear the entire relapse history?")) {
    log = [];
    localStorage.removeItem('log');
    updateLog();
  }
});

updateLog();
updateQuote();
setInterval(updateTimer, 1000);