const API_URL = "https://script.google.com/macros/s/AKfycbwEQlq4PQTlhPTJGfbl_l83dhDMPQLnqNF1zuVvFu4ourXe5T3kaw1iKHggkTri_Lta/exec";

async function saveNewWord(spanish, arabic, user) {
    // تشفير الكلمات عشان الروابط ما تخرب بسبب المسافات أو الحروف الخاصة
    const sp = encodeURIComponent(spanish);
    const ar = encodeURIComponent(arabic);
    
    const saveUrl = `${API_URL}?action=save&user=${user}&sp=${sp}&ar=${ar}`;

    try {
        const response = await fetch(saveUrl);
        const data = await response.json();
        console.log("الرد من السيرفر:", data);
        if (data.includes("✅")) {
            alert("تم الحفظ بنجاح!");
        }
    } catch (error) {
        console.error("فشل الاتصال:", error);
    }
}
async function loadData() {
    if (!currentUser) return;
    
    showLoading(true); // دالة تظهر مؤشر تحميل بسيط
    
    try {
        // نرسل طلب GET مع باراميترز (Action و User)
        const response = await fetch(`${API_URL}?action=getWords&user=${currentUser}`);
        const data = await response.json();
        
        renderTable(data); // الدالة التي ترسم الجدول (نفس المنطق القديم)
        updateStats(data); // تحديث الإحصائيات
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        showToast("فشل الاتصال بالسيرفر ❌");
    } finally {
        showLoading(false);
    }
}

async function saveNewWord(spanish, arabic) {
    const payload = {
        action: "save",
        sp: spanish,
        ar: arabic,
        user: currentUser
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        if (result.status.includes("✅")) {
            showToast("تم الحفظ بنجاح!");
            loadData(); // إعادة تحميل الجدول لتظهر الكلمة الجديدة
        } else {
            showToast(result.status);
        }
    } catch (error) {
        showToast("حدث خطأ أثناء الحفظ ⚠️");
    }
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker Registered ✅"));
}
