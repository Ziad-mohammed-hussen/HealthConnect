(function () {
  var form = document.getElementById("register-form");
  var messageEl = document.getElementById("form-message");
  var store = window.HCPatientStore;

  function showError(text) {
    messageEl.textContent = text;
    messageEl.classList.add("error");
    messageEl.classList.remove("success");
  }

  function showSuccess(text) {
    messageEl.textContent = text;
    messageEl.classList.remove("error");
    messageEl.classList.add("success");
  }

  function clearMessage() {
    messageEl.textContent = "";
    messageEl.classList.remove("error", "success");
  }

  if (!form || !store) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearMessage();

    var name = document.getElementById("full-name").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirm").value;

    if (name.length < 2) {
      showError("الرجاء إدخال الاسم الكامل.");
      return;
    }
    if (!email || email.indexOf("@") < 1) {
      showError("الرجاء إدخال بريد إلكتروني صالح.");
      return;
    }
    if (password.length < 6) {
      showError("كلمة المرور يجب أن لا تقل عن 6 أحرف.");
      return;
    }
    if (password !== confirm) {
      showError("تأكيد كلمة المرور غير مطابق.");
      return;
    }

    var result = store.register({ name: name, email: email, phone: phone, password: password });
    if (!result.ok) {
      showError(result.error);
      return;
    }

    var patient = store.findByEmail(email);
    try {
      localStorage.setItem(
        "hc_session",
        JSON.stringify({
          role: "patient",
          email: patient.email,
          displayName: patient.name,
          at: Date.now(),
        })
      );
    } catch (err) {
      showError("تم إنشاء الحساب لكن تعذر تسجيل الدخول تلقائياً. جرّب تسجيل الدخول يدوياً.");
      return;
    }

    showSuccess("تم إنشاء حسابك بنجاح…");
    setTimeout(function () {
      window.location.href = "pages/patient/dashboard.html";
    }, 600);
  });
})();
