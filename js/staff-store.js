/**
 * تخزين حسابات الإدارة والأطباء داخل المتصفح.
 */
(function (global) {
  var KEY = "hc_staff_accounts";
  var seeded = false;

  function defaults() {
    return [
      {
        id: "admin-1",
        role: "admin",
        email: "admin@healthconnect.local",
        password: "admin123",
        displayName: "مدير النظام",
        specialty: "",
        createdAt: Date.now(),
      },
      {
        id: "doctor-1",
        role: "doctor",
        email: "doctor@healthconnect.local",
        password: "doctor123",
        displayName: "د. سارة أحمد",
        specialty: "أمراض القلب",
        createdAt: Date.now(),
      },
    ];
  }

  function getAll() {
    try {
      var raw = localStorage.getItem(KEY);
      var list = raw ? JSON.parse(raw) : null;
      if (!Array.isArray(list) || !list.length) {
        list = defaults();
        saveAll(list);
      }
      return list;
    } catch (err) {
      return defaults();
    }
  }

  function saveAll(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function ensureSeed() {
    if (seeded) return;
    seeded = true;
    getAll();
  }

  function findByEmailRole(email, role) {
    var e = String(email || "").trim().toLowerCase();
    var r = String(role || "").trim();
    var list = getAll();
    for (var i = 0; i < list.length; i++) {
      if (list[i].role === r && String(list[i].email || "").toLowerCase() === e) {
        return list[i];
      }
    }
    return null;
  }

  global.HCStaffStore = {
    getAll: function () {
      ensureSeed();
      return getAll();
    },

    listDoctors: function () {
      ensureSeed();
      return getAll().filter(function (x) {
        return x.role === "doctor";
      });
    },

    findByEmailRole: function (email, role) {
      ensureSeed();
      return findByEmailRole(email, role);
    },

    createDoctor: function (payload) {
      ensureSeed();
      var email = String(payload.email || "").trim().toLowerCase();
      var password = String(payload.password || "");
      var displayName = String(payload.displayName || "").trim();
      var specialty = String(payload.specialty || "").trim();

      if (!displayName) return { ok: false, error: "اسم الطبيب مطلوب." };
      if (!email || email.indexOf("@") < 1) return { ok: false, error: "البريد الإلكتروني غير صالح." };
      if (password.length < 6) return { ok: false, error: "كلمة المرور يجب ألا تقل عن 6 أحرف." };
      if (findByEmailRole(email, "doctor") || findByEmailRole(email, "admin")) {
        return { ok: false, error: "هذا البريد مستخدم بالفعل." };
      }

      var list = getAll();
      var account = {
        id: "doctor-" + Date.now(),
        role: "doctor",
        email: email,
        password: password,
        displayName: displayName.indexOf("د.") === 0 ? displayName : "د. " + displayName,
        specialty: specialty || "عام",
        createdAt: Date.now(),
      };
      list.push(account);
      saveAll(list);
      return { ok: true, account: account };
    },
  };
})(window);
