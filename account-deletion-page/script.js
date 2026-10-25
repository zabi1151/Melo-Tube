/* MeloTube — Account Deletion page logic.
 * Form submissions are delivered straight to the support inbox via
 * FormSubmit's AJAX endpoint. If online sending fails, a pre-filled
 * email (mailto) fallback is offered instead.
 */

"use strict";

var SUPPORT_EMAIL = "ffvspubg420@gmail.com";
var FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/" + SUPPORT_EMAIL;

(function () {
  // ------------------------------------------------------------
  // DOM
  // ------------------------------------------------------------

  var directLink = document.getElementById("directEmailLink");
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

  // ------------------------------------------------------------
  // Direct support email link
  // ------------------------------------------------------------

  if (directLink) {
    directLink.textContent = SUPPORT_EMAIL;

    directLink.href =
      "mailto:" +
      SUPPORT_EMAIL +
      "?subject=" +
      encodeURIComponent("MeloTube • Account Deletion Request");
  }

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  }

  function setStatus(type, message) {
    if (!formStatus) return;

    formStatus.hidden = false;
    formStatus.className = "form-status show " + type;
    formStatus.textContent = message;
  }

  function makeRequestId() {
    var now = new Date();

    var year = now.getUTCFullYear();
    var month = String(now.getUTCMonth() + 1).padStart(2, "0");
    var day = String(now.getUTCDate()).padStart(2, "0");

    var randomPart = Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();

    return "MT-" + year + month + day + "-" + randomPart;
  }

  function getUtcTimestamp() {
    return new Date()
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d{3}Z$/, " UTC");
  }

  // ------------------------------------------------------------
  // Mail app fallback
  // ------------------------------------------------------------

  function buildMailto(requestId, submittedAt) {
    var accountEmail = emailInput.value.trim();

    var additionalDetails =
      extraInput.value.trim() || "No additional details provided";

    var subject =
      "MeloTube • Account Deletion Request • " + requestId;

    var lines = [
      "MELOTUBE — ACCOUNT & DATA DELETION",
      "",
      "Request ID: " + requestId,
      "Request Type: Account & Data Deletion",
      "Account Email: " + accountEmail,
      "Deletion Confirmation: Confirmed — user understands deletion is permanent",
      "Additional Details: " + additionalDetails,
      "",
      "Application: MeloTube — Music for your vibe",
      "Package ID: com.zabidev.melotube",
      "Submitted At: " + submittedAt,
      "Request Source: MeloTube Account Deletion Page",
      "",
      "IMPORTANT",
      "This deletion request does not automatically cancel a Google Play subscription."
    ];

    return (
      "mailto:" +
      SUPPORT_EMAIL +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"))
    );
  }

  // ------------------------------------------------------------
  // Form submit
  // ------------------------------------------------------------

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var valid = true;

    // ----------------------------------------------------------
    // Email validation
    // ----------------------------------------------------------

    if (!isValidEmail(emailInput.value)) {
      emailError.hidden = false;
      emailInput.setAttribute("aria-invalid", "true");
      valid = false;
    } else {
      emailError.hidden = true;
      emailInput.removeAttribute("aria-invalid");
    }

    // ----------------------------------------------------------
    // Permanent deletion confirmation
    // ----------------------------------------------------------

    if (!confirmBox.checked) {
      confirmError.hidden = false;
      valid = false;
    } else {
      confirmError.hidden = true;
    }

    if (!valid) {
      return;
    }

    // ----------------------------------------------------------
    // Honeypot anti-spam protection
    // ----------------------------------------------------------

    var honeypot = document.getElementById("honeypot");

    if (honeypot && honeypot.value) {
      return;
    }

    // ----------------------------------------------------------
    // Request metadata
    // ----------------------------------------------------------

    var requestId = makeRequestId();
    var submittedAt = getUtcTimestamp();

    var accountEmail = emailInput.value.trim();

    var additionalDetails =
      extraInput.value.trim() || "No additional details provided";

    // ----------------------------------------------------------
    // FormSubmit payload
    // ----------------------------------------------------------

    var payload = {
      _subject:
        "MeloTube • Account Deletion Request • " + requestId,

      _template: "box",

      _captcha: "false",

      _replyto: accountEmail,

      "Request ID": requestId,

      "Request Type":
        "ACCOUNT & DATA DELETION",

      "Account Email":
        accountEmail,

      "Deletion Confirmation":
        "✓ Confirmed — user understands deletion is permanent",

      "Additional Details":
        additionalDetails,

      "Application":
        "MeloTube — Music for your vibe",

      "Package ID":
        "com.zabidev.melotube",

      "Submitted At":
        submittedAt,

      "Request Source":
        "MeloTube Account Deletion Page"
    };

    // ----------------------------------------------------------
    // Sending state
    // ----------------------------------------------------------

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    if (mailtoFallback) {
      mailtoFallback.hidden = true;
    }

    setStatus(
      "sending",
      "Sending your deletion request…"
    );

    // ----------------------------------------------------------
    // Send through FormSubmit
    // ----------------------------------------------------------

    fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },

      body: JSON.stringify(payload)
    })

      // --------------------------------------------------------
      // Response
      // --------------------------------------------------------

      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }

        return response.json();
      })

      // --------------------------------------------------------
      // Success
      // --------------------------------------------------------

      .then(function () {
        setStatus(
          "success",
          "Request sent successfully. Reference: " +
            requestId +
            ". We'll verify ownership before deleting anything. " +
            "Verified requests are processed within 30 days."
        );

        form.reset();

        submitBtn.textContent =
          "Send deletion request";

        submitBtn.disabled = false;
      })

      // --------------------------------------------------------
      // Failure / mail app fallback
      // --------------------------------------------------------

      .catch(function () {
        setStatus(
          "error",
          "Couldn't send online. Your request was NOT lost — " +
            "use the button below to send it from your email app instead."
        );

        if (fallbackMailto) {
          fallbackMailto.href =
            buildMailto(requestId, submittedAt);
        }

        if (mailtoFallback) {
          mailtoFallback.hidden = false;
        }

        submitBtn.textContent =
          "Send deletion request";

        submitBtn.disabled = false;
      });
  });
})();
