const daysCounter = document.getElementById('daysCounter');
const timer = document.getElementById('timer');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const relapseBtn = document.getElementById('relapseBtn');
const logList = document.getElementById('logList');
const clearLogBtn = document.getElementById('clearLogBtn');
const rankNameEl = document.getElementById('rankName');
const progressBar = document.getElementById('progressBar');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

let startTime = localStorage.getItem('startTime');
if (!startTime) {
  startTime = Date.now();
  localStorage.setItem('startTime', startTime);
}

let log = JSON.parse(localStorage.getItem('log')) || [];

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
  let currentRankIndex = -1;

  for (let i = 0; i < ranks.length; i++) {
    if (days >= ranks[i].days) {
      currentRank = ranks[i].title;
      currentRankIndex = i;
    } else break;
  }

  rankNameEl.textContent = currentRank;

  const allRanksEl = document.getElementById('allRanks');
  allRanksEl.innerHTML = '';
  ranks.forEach((rank, i) => {
    const rankEl = document.createElement('div');
    rankEl.classList.add('rank-item');
    if (i === currentRankIndex) rankEl.classList.add('current');
    rankEl.textContent = `${rank.title} (${rank.days}d)`;
    allRanksEl.appendChild(rankEl);
  });

  progressBar.style.width = `${Math.min((days / 500) * 100, 100)}%`;
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
  const cached = localStorage.getItem('quoteCache');
  const cacheTime = localStorage.getItem('quoteCacheTime');

  if (cached && cacheTime && Date.now() - cacheTime < 12 * 60 * 60 * 1000) {
    const quote = JSON.parse(cached);
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `- ${quote.author}`;
  } else {
    fetch('data/quotes.json')
      .then(res => res.json())
      .then(data => {
        const quote = data[Math.floor(Math.random() * data.length)];
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `- ${quote.author}`;
        localStorage.setItem('quoteCache', JSON.stringify(quote));
        localStorage.setItem('quoteCacheTime', Date.now());
      })
      .catch(err => {
        console.error('Failed to load quotes:', err);
        quoteText.textContent = `"Keep going."`;
        quoteAuthor.textContent = "- Unknown";
      });
  }
}

function updateLog() {
  logList.innerHTML = '';
  log.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${new Date(entry.time).toLocaleString()}</strong><br><em>${entry.note || 'No note provided.'}</em>`;
    logList.appendChild(li);
  });
}

relapseBtn.addEventListener('click', () => {
  if (!confirm("Are you sure you want to log a relapse?")) return;
  const note = prompt("What caused the relapse? (Optional)");
  const entry = {
    time: Date.now(),
    note: note ? note.trim() : ''
  };

  log.push(entry);
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

exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'relapse_log.json';
  a.click();
});

importFile.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        log = imported;
        localStorage.setItem('log', JSON.stringify(log));
        updateLog();
      } else {
        throw new Error("Invalid file format");
      }
    } catch (err) {
      alert("Failed to import log file.");
      console.error(err);
    }
  };
  reader.readAsText(file);
});

updateLog();
updateQuote();
setInterval(updateTimer, 1000);