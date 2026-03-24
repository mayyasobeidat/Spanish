

let currentWordData = null;
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzbqVEZzR6FqbU2rDN8M5ZVTvJrvT7P_1lMZh7dWhzn4Q-SpjhZ9tn5mHr2zlSNhFi97A/exec"; 

async function translateLangbly(text, targetLang, sourceLang = "es") {
  const API_KEY = "UHmbUQivVPBQcdmED62Ma1"; 
  const BASE_URL = "https://api.langbly.com/language/translate/v2";

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text"
      })
    });

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return null;
  }
}

async function searchWord() {
  const word = document.getElementById("wordInput").value.trim();
  const lang = document.getElementById("languageSelect").value;
  if (!word) return;

  const translated = await translateLangbly(word, lang);
  currentWordData = { word: word, meaning: translated || "Translation failed" };
  document.getElementById("result").innerText = `${currentWordData.word} = ${currentWordData.meaning}`;
}

async function saveWordOnline() {
  if (!currentWordData) return;

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        word: currentWordData.word,
        meaning: currentWordData.meaning,
        language: document.getElementById("languageSelect").value
      })
    });
    const data = await res.json();
    console.log("Word saved:", data);
    fetchSavedWords(); // تحديث القائمة بعد الحفظ
  } catch (err) {
    console.error("Error saving word:", err);
  }
}

async function fetchSavedWords() {
  try {
    const res = await fetch(WEB_APP_URL);
    const data = await res.json();
    displayOnlineWords(data);
  } catch (err) {
    console.error("Error fetching words:", err);
  }
}

function displayOnlineWords(words) {
  const list = document.getElementById("savedList");
  list.innerHTML = "";

  words.forEach((w) => {
    const li = document.createElement("li");
    li.innerText = `${w.word} = ${w.meaning}`;
    list.appendChild(li);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", searchWord);
  document.getElementById("saveBtn").addEventListener("click", saveWordOnline);
  document.getElementById("refreshBtn").addEventListener("click", fetchSavedWords);
  fetchSavedWords();
});
