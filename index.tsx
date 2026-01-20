
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const startApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("Critical Error: Root element '#root' not found in DOM.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // إخفاء شاشة التحميل بمجرد نجاح التشغيل
    document.body.classList.add('app-loaded');
  } catch (error) {
    console.error("React Mounting Failed:", error);
    const serverWarning = document.getElementById('server-warning');
    if (serverWarning) {
      serverWarning.innerHTML = `
        <div class="text-red-500 p-8">
          <span class="material-symbols-outlined text-4xl">error</span>
          <h2 class="text-xl font-bold mt-2">خطأ في تحميل التطبيق</h2>
          <p class="text-sm mt-1">تأكد من اتصال الإنترنت وصلاحية مفتاح API.</p>
        </div>
      `;
    }
  }
};

// التأكد من جاهزية الـ DOM قبل محاولة التشغيل
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startApp();
} else {
  document.addEventListener('DOMContentLoaded', startApp);
}
