/**
 * تسجيل دخول: مريض + أدمن + طبيب من التخزين المحلي.
 */
(function () {
  var form = document.getElementById("login-form");
  var messageEl = document.getElementById("form-message");

  function showError(text) {
    messageEl.textContent = text;
    messageEl.classList.add("error");
  }

  function clearMessage() {
    messageEl.textContent = "";
    messageEl.classList.remove("error");
  }

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearMessage();

    var roleKey = document.getElementById("role").value;
    var email = document.getElementById("email").value.trim().toLowerCase();
    var password = document.getElementById("password").value;

    if (roleKey === "patient") {
      var store = window.HCPatientStore;
      if (!store) {
        showError("تعذر تحميل بيانات المرضى.");
        return;
      }
      var patient = store.findByEmail(email);
      if (!patient || patient.password !== password) {
        showError("البريد أو كلمة المرور غير صحيحة. إن لم يكن لديك حساب، سجّل من صفحة إنشاء الحساب.");
        return;
      }
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
        showError("تعذر حفظ الجلسة في المتصفح.");
        return;
      }
      window.location.href = "pages/patient/dashboard.html";
      return;
    }

    var staffStore = window.HCStaffStore;
    if (!staffStore) {
      showError("تعذر تحميل بيانات حسابات الطاقم الطبي.");
      return;
    }
    var account = staffStore.findByEmailRole(email, roleKey);
    if (!account || password !== account.password) {
      showError("البريد أو كلمة المرور غير صحيحة.");
      return;
    }

    try {
      localStorage.setItem(
        "hc_session",
        JSON.stringify({
          role: account.role,
          email: account.email,
          displayName: account.displayName || "",
          specialty: account.specialty || "",
          at: Date.now(),
        })
      );
    } catch (err) {
      showError("تعذر حفظ الجلسة في المتصفح.");
      return;
    }

    if (account.role === "admin") {
      window.location.href = "pages/admin/dashboard.html";
    } else {
      window.location.href = "pages/doctor/dashboard.html";
    }
  });
})();
