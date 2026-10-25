/* MeloTube — Account Deletion page logic.
 * Form submissions are delivered straight to the support inbox via
 * FormSubmit's AJAX endpoint (no backend needed). If online sending
 * fails, a pre-filled email (mailto) fallback is offered instead.
 */
"use strict";

var SUPPORT_EMAIL = "ffvspubg420@gmail.com"; // monitored support inbox
var FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/" + SUPPORT_EMAIL;

(function () {
  // Render the support email everywhere (single source of truth).
  var directLink = document.getElementById("directEmailLink");
  directLink.textContent = SUPPORT_EMAIL;
  directLink.href = "mailto:" + SUPPORT_EMAIL + "?subject=" +
    encodeURIComponent("MeloTube Account Deletion Request");

  var form = document.getElementById("deletionForm");
  var emailInput = document.getElementById("accountEmail");
  var extraInput = document.getElementById("extraInfo");
  var confirmBox = document.getElementById("confirmDelete");
  var submitBtn = document.getElementById("submitBtn");
  var emailError = document.getElementById("emailError");
  var confirmError = document.getElementById("confirmError");
  var formStatus = document.getElementById("formStatus");
  var mailtoFallback = document.getElementById("mailtoFallback");
  var fallbackMailto = document.getElementById("fallbackMailto");

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  }

  function setStatus(type, message) {
    formStatus.hidden = false;
    formStatus.className = "form-status show " + type;
    formStatus.textContent = message;
  }

  function buildMailto() {
    var subject = "MeloTube Account Deletion Request";
    var lines = [
      "Hello MeloTube Support,",
      "",
      "Please delete my MeloTube account and its associated cloud data.",
      "",
      "Account email (used to sign in to MeloTube): " + emailInput.value.trim(),
      "I understand deletion is permanent: yes"
    ];
    var extra = extraInput.value.trim();
    if (extra) lines.push("", "Additional info: " + extra);
    lines.push(
      "",
      "Notes:",
      "- This request was sent from my account email address for ownership verification.",
      "- I understand this does not automatically cancel any Google Play subscription."
    );
    return "mailto:" + SUPPORT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
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

    // Honeypot: bots fill it, humans don't.
    if (document.getElementById("honeypot").value) return;

    var payload = {
      _subject: "MeloTube Account Deletion Request",
      _template: "table",
      _captcha: "false",
      _replyto: emailInput.value.trim(),
      account_email: emailInput.value.trim(),
      understands_permanent: "yes",
      additional_info: extraInput.value.trim() || "(none)"
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    mailtoFallback.hidden = true;
    setStatus("sending", "Sending your request…");

    fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function () {
        setStatus("success",
          "Request sent! We've received your deletion request and will verify " +
          "ownership before deleting anything. Verified requests are processed " +
          "within 30 days — you'll get a confirmation email.");
        form.reset();
        submitBtn.textContent = "Send deletion request";
        submitBtn.disabled = false;
      })
      .catch(function () {
        setStatus("error",
          "Couldn't send online. Your request was NOT lost — use the button " +
          "below to send it from your email app instead.");
        fallbackMailto.href = buildMailto();
        mailtoFallback.hidden = false;
        submitBtn.textContent = "Send deletion request";
        submitBtn.disabled = false;
      });
  });
})();
