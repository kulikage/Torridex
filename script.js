// Formspree AJAX Submit for TorrideX
(() => {
    const form = document.getElementById('contactForm');
    
    // Если формы нет на странице (например, мы на странице Team), скрипт не выполнится
    if (!form) return;
  
    const btn = document.getElementById('sendBtn');
    const status = document.getElementById('formStatus');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Сброс статусов
      if (status) {
          status.textContent = '';
          status.className = 'form-status';
      }
  
      // Блокируем кнопку
      const originalBtnText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Transmitting...'; // Технологичный текст загрузки
  
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
  
        if (res.ok) {
          form.reset();
          if (status) {
              status.textContent = 'Transmission Confirmed. Pitch Deck sent to verification queue.';
              status.classList.add('success');
          }
        } else {
          // Если ошибка на стороне Formspree
          const data = await res.json();
          if (Object.hasOwn(data, 'errors')) {
            status.textContent = data["errors"].map(error => error["message"]).join(", ");
          } else {
            status.textContent = 'Transmission Error. Please contact invest@torridex.com directly.';
          }
          status.classList.add('error');
        }
      } catch (err) {
        // Ошибка сети
        if (status) {
            status.textContent = 'Network Link Failed. Please try again later.';
            status.classList.add('error');
        }
      } finally {
        // Возвращаем кнопку в исходное состояние
        btn.disabled = false;
        btn.textContent = originalBtnText;
      }
    });
  })();
