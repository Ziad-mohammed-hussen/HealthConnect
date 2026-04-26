/**
 * يحمّل قائمة الأطباء من data/doctors.json ويعرضها في لوحة المريض.
 * يفضّل فتح الموقع عبر خادم محلي (مثل Live Server) حتى يعمل fetch بشكل صحيح.
 */
(function () {
  var container = document.getElementById("doctors-grid");
  var errEl = document.getElementById("doctors-load-error");
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
        alert("حجز موعد مع " + (d.name || "") + " — (واجهة تجريبية)");
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

  fetch("../../data/doctors.json")
    .then(function (res) {
      if (!res.ok) throw new Error("bad status");
      return res.json();
    })
    .then(function (data) {
      var list = data.doctors != null ? data.doctors : data;
      if (!Array.isArray(list)) list = [];
      render(list);
    })
    .catch(function () {
      if (errEl) {
        errEl.textContent =
          "تعذر تحميل قائمة الأطباء. افتح الموقع عبر خادم محلي (مثلاً Live Server في VS Code) حتى يعمل تحميل ملف JSON.";
      }
    });
})();
