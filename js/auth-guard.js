/**
 * يحمي صفحات اللوحة: يتحقق من الجلسة ونوع المستخدم حسب المسار.
 */
(function () {
  var path = window.location.pathname.replace(/\\/g, "/");
  var needAdmin = path.indexOf("/admin/") !== -1;
  var needDoctor = path.indexOf("/doctor/") !== -1;
  var needPatient = path.indexOf("/patient/") !== -1;

  var raw = null;
  try {
    raw = localStorage.getItem("hc_session");
  } catch (e) {
    raw = null;
  }

  function goLogin() {
    window.location.href = "../../login.html";
  }

  if (!raw) {
    goLogin();
    return;
  }

  var session;
  try {
    session = JSON.parse(raw);
  } catch (e) {
    goLogin();
    return;
  }

  if (!session || !session.role) {
    goLogin();
    return;
  }

  if (needAdmin && session.role !== "admin") {
    goLogin();
    return;
  }
  if (needDoctor && session.role !== "doctor") {
    goLogin();
    return;
  }
  if (needPatient && session.role !== "patient") {
    goLogin();
    return;
  }

  window.__hcSession = session;
})();
