// ── Список участников ────────────────────────────────────────
let players = [];

const nameInput = document.getElementById("name-input");
const addForm = document.getElementById("add-form");
const playersList = document.getElementById("players-list");
const countSpan = document.getElementById("count");

// ОШИБКА 1: Исправлен click на submit submit	При отправке формы|click	При клике мышкой
addForm.addEventListener("submit", (e) => {
  e.preventDefault(); // отмена дефолтного поведения, без нее будет обновляться вся страница
  const name = nameInput.value.trim();
  // trim - удаление пробелов с начала и конца

  if (name === "") return;

  if (players.includes(name)) {
    alert("Такой участник уже есть!");
    return;
  }
  // includes - проверяет находиться ли в строке эта подстрока
  // alert - всплывающее окно

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
      players.splice(i, 1); // splice - удаляет(изменяет) по индексу (индекс, кол)
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
  const m = Math.floor(seconds / 60); //Math.floor округление до ближайшего целого и сек в минуты
  const s = seconds % 60;

  timerDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  //String(m) - преобразование в строку, дополняет до указанной длины (2, нулями) спереди 
  // нужно для отоюражения времени читаемым 
}

startBtn.addEventListener("click", () => {
  if (timerInterval) return;

  // ОШИБКА 5: Добавлена проверка на отрицательные значения
  timerInterval = setInterval(() => { // setInterval переодическое выполнение команды
    if (seconds > 0) {
      seconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval); // остановка
      timerInterval = null;
    }
  }, 1000); //сек в миллисекундах
});
// Этот код создает интервал, который каждую секунду уменьшает счетчик секунд на 1, пока не дойдет до нуля, а затем останавливается.

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
  // преобразование строки в число
  // value получает значение перед . 
  // округление до целого 10 

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
// ... - оператор для создания поверхностной копии (защита исходного от изменений)
  // sort() - метод массива для сортировки. - 0.5(50% изменений)

  const teams = [];
  for (let i = 0; i < shuffled.length; i += size) {
    teams.push(shuffled.slice(i, i + size)); // сборка команд slice вырезаем без изменений сходного и push добавляем
  }

  teamsOutput.innerHTML = ""; // удаление старых команд
  teams.forEach((team, idx) => {
    const card = document.createElement("div"); // создание только в памяти
    card.className = "team-card"; // присваение css
    card.innerHTML = `
      <h3>Команда ${idx + 1}</h3>
      <p>${team.join(", ")}</p> // что будет между
    `;
    teamsOutput.append(card);
  });
});


updateTimerDisplay();
renderPlayers();
