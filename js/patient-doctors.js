/**
 * يحمّل قائمة الأطباء من data/doctors.json ويعرضها في لوحة المريض.
 * يفضّل فتح الموقع عبر خادم محلي (مثل Live Server) حتى يعمل fetch بشكل صحيح.
 */
(function () {
  var container = document.getElementById("doctors-grid");
  var errEl = document.getElementById("doctors-load-error");
  var appointmentsStore = window.HCAppointmentsStore;
  var session = window.__hcSession;
  var staffStore = window.HCStaffStore;
  var FALLBACK_DOCTORS = [
    {
      id: 1,
      name: "د. أحمد محمود السيد",
      specialty: "الباطنة والجهاز الهضمي",
      clinic: "القاهرة — المعادي",
      rating: 4.9,
      years: 12,
      image: "https://picsum.photos/seed/doctor-a/240/240",
    },
    {
      id: 2,
      name: "د. سارة أحمد حسن",
      specialty: "أمراض القلب والأوعية",
      clinic: "الجيزة — الدقي",
      rating: 4.8,
      years: 9,
      image: "https://picsum.photos/seed/doctor-b/240/240",
    },
    {
      id: 3,
      name: "د. كريم يوسف إبراهيم",
      specialty: "العظام والمفاصل",
      clinic: "القاهرة — مصر الجديدة",
      rating: 4.7,
      years: 15,
      image: "https://picsum.photos/seed/doctor-c/240/240",
    },
    {
      id: 4,
      name: "د. ليلى محمد فهمي",
      specialty: "الأطفال وحديثي الولادة",
      clinic: "القاهرة — مدينة نصر",
      rating: 5,
      years: 11,
      image: "https://picsum.photos/seed/doctor-d/240/240",
    },
  ];
  if (!container) return;

  function starRow(rating) {
    var n = Math.round(Number(rating) * 2) / 2;
    var html = '<span class="doctor-stars" aria-label="التقييم ' + rating + '">';
    for (var i = 1; i <= 5; i++) {
      if (n >= i) html += '<i class="fa-solid fa-star"></i>';
      else if (n >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
      else html += '<i class="fa-regular fa-star"></i>';
    }
    html += "</span>";
    return html;
  }

  function render(list) {
    container.innerHTML = "";
    list.forEach(function (d) {
      var card = document.createElement("article");
      card.className = "doctor-card";
      card.setAttribute("data-id", String(d.id));

      var img = document.createElement("img");
      img.src = d.image || "";
      img.alt = "";
      img.width = 240;
      img.height = 240;
      img.loading = "lazy";

      var body = document.createElement("div");
      body.className = "doctor-card-body";

      var nameEl = document.createElement("h4");
      nameEl.className = "doctor-name";
      nameEl.textContent = d.name || "";

      var spec = document.createElement("p");
      spec.className = "doctor-specialty";
      spec.textContent = d.specialty || "";

      var clinic = document.createElement("p");
      clinic.className = "doctor-clinic";
      clinic.innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + (d.clinic || "");

      var meta = document.createElement("div");
      meta.className = "doctor-meta";
      meta.innerHTML =
        starRow(d.rating || 0) +
        '<span class="doctor-exp">' +
        (d.years != null ? d.years + " سنة خبرة" : "") +
        "</span>";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "doctor-book-btn";
      btn.textContent = "حجز موعد";
      btn.addEventListener("click", function () {
        if (!appointmentsStore || !session) {
          alert("تعذر تنفيذ الحجز حالياً.");
          return;
        }
        var appt = appointmentsStore.create({
          patientName: session.displayName || "مريض",
          patientEmail: session.email || "",
          doctorId: d.id,
          doctorEmail: d.email || "",
          doctorName: d.name || "",
          doctorSpecialty: d.specialty || "",
          clinic: d.clinic || "",
        });
        alert("تم إرسال طلب الحجز مع " + (d.name || "") + " بنجاح.");
        var event;
        try {
          event = new CustomEvent("hc:appointment-created", { detail: appt });
        } catch (e) {
          event = null;
        }
        if (event) window.dispatchEvent(event);
      });

      body.appendChild(nameEl);
      body.appendChild(spec);
      body.appendChild(clinic);
      body.appendChild(meta);
      body.appendChild(btn);

      card.appendChild(img);
      card.appendChild(body);
      container.appendChild(card);
    });
  }

  function mergeDoctors(baseDoctors) {
    var merged = (Array.isArray(baseDoctors) ? baseDoctors.slice() : []).map(function (d) {
      return {
        id: d.id,
        name: d.name,
        specialty: d.specialty,
        clinic: d.clinic,
        rating: d.rating,
        years: d.years,
        image: d.image,
        email: d.email || "",
      };
    });
    if (!staffStore) return merged;
    var staffDoctors = staffStore.listDoctors().map(function (doc) {
      return {
        id: doc.id,
        name: doc.displayName,
        specialty: doc.specialty || "عام",
        clinic: "عيادة خاصة",
        rating: 4.8,
        years: 8,
        image: "https://picsum.photos/seed/" + encodeURIComponent(doc.email || doc.id) + "/240/240",
        email: doc.email,
      };
    });
    for (var i = 0; i < staffDoctors.length; i++) {
      var exists = false;
      for (var j = 0; j < merged.length; j++) {
        if (
          (staffDoctors[i].email && merged[j].email === staffDoctors[i].email) ||
          merged[j].name === staffDoctors[i].name
        ) {
          exists = true;
          break;
        }
      }
      if (!exists) merged.push(staffDoctors[i]);
    }
    return merged;
  }

  fetch("../../data/doctors.json")
    .then(function (res) {
      if (!res.ok) throw new Error("bad status");
      return res.json();
    })
    .then(function (data) {
      var list = data.doctors != null ? data.doctors : data;
      if (!Array.isArray(list)) list = [];
      render(mergeDoctors(list));
    })
    .catch(function () {
      render(mergeDoctors(FALLBACK_DOCTORS));
      if (errEl) {
        errEl.textContent =
          "تم تشغيل قائمة أطباء افتراضية لأن تحميل ملف JSON لم ينجح. للحصول على بيانات الملف الفعلية افتح المشروع عبر Live Server.";
      }
    });
})();
