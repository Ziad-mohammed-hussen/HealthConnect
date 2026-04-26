/**
 * تخزين بيانات المرضى المسجلين (تجريبي في المتصفح فقط).
 */
(function (global) {
  var KEY = "hc_patients";

  function getAll() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveAll(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  global.HCPatientStore = {
    getAll: getAll,

    findByEmail: function (email) {
      var e = String(email).trim().toLowerCase();
      var all = getAll();
      for (var i = 0; i < all.length; i++) {
        if (all[i].email.toLowerCase() === e) return all[i];
      }
      return null;
    },

    register: function (data) {
      if (this.findByEmail(data.email)) {
        return { ok: false, error: "هذا البريد مسجّل مسبقاً." };
      }
      var all = getAll();
      all.push({
        id: Date.now(),
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: (data.phone || "").trim(),
        password: data.password,
        createdAt: Date.now(),
      });
      saveAll(all);
      return { ok: true };
    },
  };
})(window);
