/* MeloTube — Account Deletion page logic.
 * ------------------------------------------------------------------
 * BEFORE DEPLOYING: replace the placeholder below with your real
 * support email address. It is the ONLY place the address is stored —
 * every mailto link and visible email on this page is built from it.
 * ------------------------------------------------------------------
 */
"use strict";

var SUPPORT_EMAIL = "ffvspubg420@gmail.com"; // real monitored support email (set 2026-10-18)

(function () {
  // Render the support email everywhere (single source of truth).
  var emailLinks = document.querySelectorAll("#directEmailLink");
  emailLinks.forEach(function (a) {
    a.textContent = SUPPORT_EMAIL;
    a.href = "mailto:" + SUPPORT_EMAIL + "?subject=" +
      encodeURIComponent("MeloTube Account Deletion Request");
  });

  var form = document.getElementById("deletionForm");
  var emailInput = document.getElementById("accountEmail");
  var extraInput = document.getElementById("extraInfo");
  var confirmBox = document.getElementById("confirmDelete");
  var emailError = document.getElementById("emailError");
  var confirmError = document.getElementById("confirmError");

  function isValidEmail(v) {
    // Practical email check — the user's mail client does the final validation.
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;

    if (!isValidEmail(emailInput.value)) {
      emailError.hidden = false;
      emailInput.setAttribute("aria-invalid", "true");
      ok = false;
    } else {
      emailError.hidden = true;
      emailInput.removeAttribute("aria-invalid");
    }

    if (!confirmBox.checked) {
      confirmError.hidden = false;
      ok = false;
    } else {
      confirmError.hidden = true;
    }

    if (!ok) return;

    var subject = "MeloTube Account Deletion Request";
    var lines = [
      "Hello MeloTube Support,",
      "",
      "Please delete my MeloTube account and its associated cloud data.",
      "",
      "Account email (used to sign in to MeloTube): " + emailInput.value.trim(),
      "I understand deletion is permanent: yes",
    ];
    var extra = extraInput.value.trim();
    if (extra) {
      lines.push("", "Additional info: " + extra);
    }
    lines.push(
      "",
      "Notes:",
      "- This request was sent from my account email address for ownership verification.",
      "- I understand this does not automatically cancel any Google Play subscription."
    );

    var mailto = "mailto:" + SUPPORT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));

    window.location.href = mailto;
  });
})();
