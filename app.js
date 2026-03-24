let currentWordData = null;

// ==================
// 1️⃣ ترجمة الكلمة عبر Langbly
// ==================
async function translateLangbly(text, targetLang, sourceLang = "es") {
  const API_KEY = "UHmbUQivVPBQcdmED62Ma1"; // ضع هنا الـ Key تبعك
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

// ==================
// 2️⃣ البحث عن كلمة
// ==================
async function searchWord() {
  const word = document.getElementById("wordInput").value.trim();
  const lang = document.getElementById("languageSelect").value;

  if (!word) return;

  const translated = await translateLangbly(word, lang);

  currentWordData = {
    word: word,
    meaning: translated || "Translation failed"
  };

  document.getElementById("result").innerText =
    `${currentWordData.word} = ${currentWordData.meaning}`;
}

// ==================
// 3️⃣ حفظ الكلمة أونلاين (Google Sheets)
// ==================
async function saveWordOnline() {
  if (!currentWordData) return;
  const url = "https://script.google.com/macros/s/AKfycbwDkGYlnIOGbNNnf8_vu2GOCtyDZHfWVyGoMMUm6rUY7R0U06AW4JOG8fD6amdu209hig/exec";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        word: currentWordData.word,
        meaning: currentWordData.meaning,
        language: document.getElementById("languageSelect").value
      })
    });

    const data = await res.json();
    console.log("Word saved:", data);
    fetchSavedWords(); // تحديث القائمة
  } catch (err) {
    console.error("Error saving word online:", err);
  }
}

// ==================
// 4️⃣ جلب الكلمات من Google Sheets
// ==================
async function fetchSavedWords() {
  const url = "https://script.google.com/macros/s/AKfycbwDkGYlnIOGbNNnf8_vu2GOCtyDZHfWVyGoMMUm6rUY7R0U06AW4JOG8fD6amdu209hig/exec";
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayOnlineWords(data);
  } catch (error) {
    console.error("Error fetching words:", error);
  }
}

// ==================
// 5️⃣ عرض الكلمات أونلاين
// ==================
function displayOnlineWords(words) {
  const list = document.getElementById("savedList");
  list.innerHTML = "";

  words.forEach((w, index) => {
    const li = document.createElement("li");
    li.innerText = `${w.word} = ${w.meaning}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.onclick = () => {
      alert("حذف كلمة أونلاين يحتاج تعديل Apps Script");
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// ==================
// 6️⃣ ربط الأزرار عند تحميل الصفحة
// ==================
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", searchWord);
  document.getElementById("saveBtn").addEventListener("click", saveWordOnline);
  document.getElementById("refreshBtn").addEventListener("click", fetchSavedWords);

  fetchSavedWords(); // جلب الكلمات عند فتح الصفحة
});
