/**
 * تسجيل دخول: أدمن/طبيب (حسابات ثابتة) + مريض (من حسابات التسجيل في المتصفح).
 */
(function () {
  var ACCOUNTS = {
    admin: {
      email: "admin@healthconnect.local",
      password: "admin123",
      role: "admin",
      displayName: "مدير النظام",
    },
    doctor: {
      email: "doctor@healthconnect.local",
      password: "doctor123",
      role: "doctor",
      displayName: "د. سارة أحمد",
    },
  };

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

    var account = ACCOUNTS[roleKey];

    if (!account) {
      showError("نوع المستخدم غير صالح.");
      return;
    }
    if (email !== account.email.toLowerCase() || password !== account.password) {
      showError("البريد أو كلمة المرور غير صحيحة، أو نوع المستخدم لا يطابق الحساب الثابت.");
      return;
    }

    try {
      localStorage.setItem(
        "hc_session",
        JSON.stringify({
          role: account.role,
          email: account.email,
          displayName: account.displayName,
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
