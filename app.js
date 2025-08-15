let answer, min, max, count, timer, timeLeft;
let language = "zh";

const messages = {
  zh: {
    title: "終極密碼 🔐",
    range:
      '請在 <span id="min">1</span> 到 <span id="max">100</span> 之間猜一個數字',
    input: "輸入你的猜測...",
    guess: "猜！",
    reset: "重新開始",
    tooSmall: "太小囉！再試試",
    tooBig: "太大了！再來一次",
    correct: (ans, count) =>
      `🎉 恭喜你猜對了！答案是 ${ans}，共猜了 ${count} 次。`,
    invalid: (min, max) => `請輸入 ${min} 到 ${max} 之間的數字`,
    time: (sec) => `剩餘時間：${sec} 秒`,
    timeout: `⏱ 時間到！遊戲結束。`,
  },
  en: {
    title: "Ultimate Password 🔐",
    range:
      'Guess a number between <span id="min">1</span> and <span id="max">100</span>',
    input: "Enter your guess...",
    guess: "Guess!",
    reset: "Restart",
    tooSmall: "Too low! Try again.",
    tooBig: "Too high! Try again.",
    correct: (ans, count) =>
      `🎉 You got it! The number was ${ans}, and it took ${count} guesses.`,
    invalid: (min, max) => `Please enter a number between ${min} and ${max}`,
    time: (sec) => `Time left: ${sec} sec`,
    timeout: `⏱ Time's up! Game over.`,
  },
};

function initGame() {
  min = 1;
  max = 100;
  answer = Math.floor(Math.random() * 100) + 1;
  count = 0;
  timeLeft = 30;
  updateText();
  document.getElementById("min").textContent = min;
  document.getElementById("max").textContent = max;
  document.getElementById("message").textContent = "";
  document.getElementById("log").textContent = "";
  document.getElementById("guess").value = "";
  document.getElementById("guess").disabled = false;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent =
      messages[language].time(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("message").textContent =
        messages[language].timeout;
      document.getElementById("guess").disabled = true;
      document.getElementById("gameoverSound").play();
    }
  }, 1000);
}

function checkGuess() {
  const input = document.getElementById("guess");
  const guess = parseInt(input.value);
  if (isNaN(guess) || guess < min || guess > max) {
    document.getElementById("message").textContent = messages[language].invalid(
      min,
      max
    );
    return;
  }
  count++;
  const log = document.getElementById("log");
  log.textContent += `#${count}: ${guess}\n`;

  if (guess === answer) {
    document.getElementById("message").textContent = messages[language].correct(
      answer,
      count
    );
    document.getElementById("guess").disabled = true;
    document.getElementById("guessBtn").disabled = true; // 禁用猜測按鈕
    document.getElementById("correctSound").play();
    clearInterval(timer);
  } else if (guess < answer) {
    min = guess + 1;
    document.getElementById("message").textContent =
      messages[language].tooSmall;
    document.getElementById("wrongSound").play();
  } else {
    max = guess - 1;
    document.getElementById("message").textContent = messages[language].tooBig;
    document.getElementById("wrongSound").play();
  }
  document.getElementById("min").textContent = min;
  document.getElementById("max").textContent = max;
  input.value = "";
  input.focus();
}

function resetGame() {
  document.getElementById("guessBtn").disabled = false; // 重新啟用猜測按鈕
  initGame();
}

function toggleLanguage() {
  language = language === "zh" ? "en" : "zh";
  updateText();
}

function updateText() {
  document.getElementById("title").textContent = messages[language].title;
  document.getElementById("rangeText").innerHTML = messages[language].range;
  document.getElementById("guess").placeholder = messages[language].input;
  document.getElementById("guessBtn").textContent = messages[language].guess;
  document.getElementById("resetBtn").textContent = messages[language].reset;
  document.getElementById("timer").textContent =
    messages[language].time(timeLeft);
  document.querySelector(".lang-btn").textContent =
    language === "zh" ? "🌐 EN" : "🌐 中文";
}

const bgm = document.getElementById("bgm");
bgm.volume = 0.3; // 預設音量

function changeVolume(value) {
  bgm.volume = parseFloat(value);
}

initGame();
