// استبدل هذا الرابط برابط الـ Deployment الخاص بك من Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwEQlq4PQTlhPTJGfbl_l83dhDMPQLnqNF1zuVvFu4ourXe5T3kaw1iKHggkTri_Lta/exec";
const currentUser = localStorage.getItem('app_user_id');

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
