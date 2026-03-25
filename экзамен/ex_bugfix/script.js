// ── Список участников ────────────────────────────────────────
let players = [];

const nameInput = document.getElementById("name-input");
const addForm = document.getElementById("add-form");
const playersList = document.getElementById("players-list");
const countSpan = document.getElementById("count");

// ОШИБКА 1: Исправлен click на submit
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();

  if (name === "") return;

  if (players.includes(name)) {
    alert("Такой участник уже есть!");
    return;
  }

  players.push(name);
  nameInput.value = "";
  renderPlayers();
});

function renderPlayers() {
  playersList.innerHTML = "";

  players.forEach((name, i) => {
    const li = document.createElement("li");
    li.textContent = name;

    const btn = document.createElement("button");
    btn.textContent = "✕";

    // ОШИБКА 2: Исправлен splice - добавлен второй аргумент 1
    btn.addEventListener("click", () => {
      players.splice(i, 1);
      renderPlayers();
    });

    li.append(btn);
    playersList.append(li);
  });

  // ОШИБКА 3: Добавлено обновление счётчика участников
  countSpan.textContent = players.length;
}

// ── Таймер ───────────────────────────────────────────────────
let seconds = 30;
let timerInterval = null;

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");

// ОШИБКА 4: Исправлено форматирование таймера
function updateTimerDisplay() {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  timerDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

startBtn.addEventListener("click", () => {
  if (timerInterval) return;

  // ОШИБКА 5: Добавлена проверка на отрицательные значения
  timerInterval = setInterval(() => {
    if (seconds > 0) {
      seconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }, 1000);
});

stopBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 30;
  updateTimerDisplay();
});

// ── Генерация команд ─────────────────────────────────────────
const teamSizeInput = document.getElementById("team-size");
const generateBtn = document.getElementById("generate-btn");
const teamsOutput = document.getElementById("teams-output");

generateBtn.addEventListener("click", () => {
  // ОШИБКА 6: Исправлено чтение значения - преобразование в число
  const size = parseInt(teamSizeInput.value, 10);

  // ОШИБКА 8 и 10: Добавлены проверки на валидность размера и пустой список
  if (isNaN(size) || size < 1) {
    alert("Размер команды должен быть положительным числом!");
    return;
  }

  if (players.length === 0) {
    alert("Добавьте хотя бы одного участника!");
    return;
  }

  if (players.length < size) {
    alert(`Нужно больше участников! Минимум ${size}, сейчас ${players.length}`);
    return;
  }

  // ОШИБКА 7: Исправлено - создаём копию массива, чтобы не мутировать оригинал
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const teams = [];
  for (let i = 0; i < shuffled.length; i += size) {
    teams.push(shuffled.slice(i, i + size));
  }

  teamsOutput.innerHTML = "";
  teams.forEach((team, idx) => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <h3>Команда ${idx + 1}</h3>
      <p>${team.join(", ")}</p>
    `;
    teamsOutput.append(card);
  });
});


updateTimerDisplay();
renderPlayers();