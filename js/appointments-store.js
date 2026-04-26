/**
 * تخزين مواعيد الحجز محلياً في المتصفح.
 */
(function (global) {
  var KEY = "hc_appointments";

  function getAll() {
    try {
      var raw = localStorage.getItem(KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return [];
    }
  }

  function saveAll(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function toDateText(ts) {
    var d = new Date(ts);
    if (isNaN(d.getTime())) return "غير محدد";
    return d.toLocaleString("ar-EG", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  global.HCAppointmentsStore = {
    getAll: getAll,

    getByPatientEmail: function (email) {
      var e = String(email || "").trim().toLowerCase();
      return getAll().filter(function (item) {
        return String(item.patientEmail || "").toLowerCase() === e;
      });
    },

    getByDoctorName: function (doctorName) {
      var n = String(doctorName || "").trim();
      return getAll().filter(function (item) {
        return item.doctorName === n;
      });
    },

    getByDoctorEmail: function (doctorEmail) {
      var e = String(doctorEmail || "").trim().toLowerCase();
      return getAll().filter(function (item) {
        return String(item.doctorEmail || "").toLowerCase() === e;
      });
    },

    create: function (payload) {
      var all = getAll();
      var ts = Date.now();
      var appointment = {
        id: ts + "-" + Math.floor(Math.random() * 10000),
        patientName: String(payload.patientName || "").trim(),
        patientEmail: String(payload.patientEmail || "").trim().toLowerCase(),
        doctorId: payload.doctorId,
        doctorEmail: String(payload.doctorEmail || "").trim().toLowerCase(),
        doctorName: String(payload.doctorName || "").trim(),
        doctorSpecialty: String(payload.doctorSpecialty || "").trim(),
        clinic: String(payload.clinic || "").trim(),
        status: "pending",
        createdAt: ts,
      };
      all.unshift(appointment);
      saveAll(all);
      return appointment;
    },

    markDone: function (id) {
      var all = getAll();
      var changed = false;
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) {
          all[i].status = "done";
          changed = true;
          break;
        }
      }
      if (changed) saveAll(all);
      return changed;
    },

    approve: function (id) {
      var all = getAll();
      var changed = false;
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) {
          all[i].status = "approved";
          changed = true;
          break;
        }
      }
      if (changed) saveAll(all);
      return changed;
    },

    reject: function (id) {
      var all = getAll();
      var changed = false;
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) {
          all[i].status = "rejected";
          changed = true;
          break;
        }
      }
      if (changed) saveAll(all);
      return changed;
    },

    cancel: function (id) {
      var all = getAll();
      var changed = false;
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) {
          all[i].status = "cancelled";
          changed = true;
          break;
        }
      }
      if (changed) saveAll(all);
      return changed;
    },

    toDateText: toDateText,
  };
})(window);
