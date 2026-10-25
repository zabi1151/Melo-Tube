/* =========================================================
   MeloTube — Account Deletion Request
   FormSubmit Premium Presentation
   ========================================================= */

"use strict";

const SUPPORT_EMAIL = "ffvspubg420@gmail.com";
const FORMSUBMIT_ENDPOINT =
  "https://formsubmit.co/ajax/" + SUPPORT_EMAIL;

(function () {

  /* ---------------- DOM ---------------- */

  const form = document.getElementById("deletionForm");
  const emailInput = document.getElementById("accountEmail");
  const extraInput = document.getElementById("extraInfo");
  const confirmBox = document.getElementById("confirmDelete");
  const submitBtn = document.getElementById("submitBtn");

  const emailError = document.getElementById("emailError");
  const confirmError = document.getElementById("confirmError");

  const formStatus = document.getElementById("formStatus");

  const mailtoFallback =
    document.getElementById("mailtoFallback");

  const fallbackMailto =
    document.getElementById("fallbackMailto");

  const directEmailLink =
    document.getElementById("directEmailLink");


  /* ---------------- Direct Email ---------------- */

  if (directEmailLink) {

    directEmailLink.textContent = SUPPORT_EMAIL;

    directEmailLink.href =
      "mailto:" +
      SUPPORT_EMAIL +
      "?subject=" +
      encodeURIComponent(
        "🎵 MeloTube • Account Deletion Request"
      );
  }


  /* ---------------- Helpers ---------------- */

  function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      .test(email.trim());

  }


  function setStatus(type, text) {

    if (!formStatus) return;

    formStatus.hidden = false;

    formStatus.className =
      "form-status show " + type;

    formStatus.textContent = text;

  }


  /* ---------------- Request ID ---------------- */

  function createRequestId() {

    const date = new Date();

    const y = date.getUTCFullYear();

    const m = String(
      date.getUTCMonth() + 1
    ).padStart(2, "0");

    const d = String(
      date.getUTCDate()
    ).padStart(2, "0");

    const random =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `MT-${y}${m}${d}-${random}`;

  }


  /* ---------------- Timestamp ---------------- */

  function getTimestamp() {

    return new Date()
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d{3}Z$/, " UTC");

  }


  /* ---------------- Mailto fallback ---------------- */

  function createFallbackMail(
    requestId,
    timestamp
  ) {

    const email =
      emailInput.value.trim();

    const details =
      extraInput.value.trim() ||
      "No additional details provided";

    const subject =
      `🎵 MeloTube • Account Deletion • ${requestId}`;

    const message = [

      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "🎵 MELOTUBE",
      "ACCOUNT & DATA DELETION REQUEST",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",

      "",

      "✅ REQUEST RECEIVED",

      "",

      `🎫 Request ID: ${requestId}`,
      `📧 Account Email: ${email}`,

      "",

      "🛡️ Deletion Confirmation:",
      "Confirmed — I understand that account deletion is permanent.",

      "",

      "💬 Additional Details:",
      details,

      "",

      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "📱 APPLICATION INFORMATION",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",

      "",

      "🎵 App: MeloTube — Music for your vibe",
      "📦 Package: com.zabidev.melotube",
      `🕒 Submitted: ${timestamp}`,
      "🌐 Source: MeloTube Account Deletion Page",

      "",

      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "⚠️ IMPORTANT",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",

      "",

      "• Ownership will be verified before deletion.",
      "• Verified requests are processed within 30 days.",
      "• Google Play subscriptions are NOT automatically cancelled.",

      "",

      "Thank you for using MeloTube ❤️"

    ].join("\n");


    return (
      "mailto:" +
      SUPPORT_EMAIL +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(message)
    );

  }


  /* ---------------- Form ---------------- */

  if (!form) return;


  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      /* ========== Validation ========== */

      let valid = true;


      if (!validEmail(emailInput.value)) {

        emailError.hidden = false;

        emailInput.setAttribute(
          "aria-invalid",
          "true"
        );

        valid = false;

      } else {

        emailError.hidden = true;

        emailInput.removeAttribute(
          "aria-invalid"
        );

      }


      if (!confirmBox.checked) {

        confirmError.hidden = false;

        valid = false;

      } else {

        confirmError.hidden = true;

      }


      if (!valid) return;


      /* ========== Honeypot ========== */

      const honeypot =
        document.getElementById("honeypot");

      if (
        honeypot &&
        honeypot.value.trim() !== ""
      ) {

        return;

      }


      /* ========== Metadata ========== */

      const requestId =
        createRequestId();

      const timestamp =
        getTimestamp();

      const accountEmail =
        emailInput.value.trim();

      const additionalDetails =
        extraInput.value.trim() ||
        "No additional details provided";


      /* =====================================================
         FORMSUBMIT EMAIL PRESENTATION
         ===================================================== */

      const payload = {

        /* FormSubmit configuration */

        _subject:
          `🎵 MeloTube • Deletion Request • ${requestId}`,

        _template:
          "box",

        _captcha:
          "false",

        _replyto:
          accountEmail,


        /* ===============================================
           Email content
           =============================================== */


        "🎵 MELOTUBE":
          "Music for your vibe",


        "━━━━━━━━ REQUEST STATUS ━━━━━━━━":
          "✅ ACCOUNT DELETION REQUEST RECEIVED",


        "🎫 Request ID":
          requestId,


        "📧 Account Email":
          accountEmail,


        "🛡️ Deletion Confirmation":
          "✅ Confirmed — user understands deletion is permanent",


        "💬 Additional Details":
          additionalDetails,


        "━━━━━━━━ APP INFORMATION ━━━━━━━━":
          "MeloTube",


        "🎧 Application":
          "MeloTube — Music for your vibe",


        "📦 Package ID":
          "com.zabidev.melotube",


        "🕒 Submitted At":
          timestamp,


        "🌐 Request Source":
          "MeloTube Account Deletion Page",


        "━━━━━━━━ PROCESSING ━━━━━━━━":
          "Secure Account Deletion",


        "🔐 Verification":
          "Account ownership will be verified before processing",


        "⏳ Processing Time":
          "Verified deletion requests are processed within 30 days",


        "⚠️ Google Play Subscription":
          "This request does NOT automatically cancel an active Google Play subscription",


        "━━━━━━━━ MELOTUBE ━━━━━━━━":
          "❤️ Thank you for using MeloTube"

      };


      /* ========== Sending UI ========== */

      submitBtn.disabled = true;

      submitBtn.textContent =
        "Sending request…";


      if (mailtoFallback) {

        mailtoFallback.hidden = true;

      }


      setStatus(
        "sending",
        "🎵 Sending your MeloTube deletion request…"
      );


      /* ========== Request ========== */

      try {

        const response =
          await fetch(
            FORMSUBMIT_ENDPOINT,
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                "Accept":
                  "application/json"

              },

              body:
                JSON.stringify(payload)

            }
          );


        if (!response.ok) {

          throw new Error(
            `HTTP ${response.status}`
          );

        }


        await response.json();


        /* ========== Success ========== */

        setStatus(

          "success",

          `✓ Request sent successfully! ` +
          `Reference: ${requestId}. ` +
          `We'll verify account ownership before deletion. ` +
          `Verified requests are processed within 30 days.`

        );


        form.reset();


      } catch (error) {


        /* ========== Failure ========== */

        setStatus(

          "error",

          "Couldn't send the request online. " +
          "You can send the prepared request " +
          "using your email app instead."

        );


        if (fallbackMailto) {

          fallbackMailto.href =
            createFallbackMail(
              requestId,
              timestamp
            );

        }


        if (mailtoFallback) {

          mailtoFallback.hidden = false;

        }


      } finally {


        submitBtn.disabled = false;

        submitBtn.textContent =
          "Send deletion request";


      }

    }
  );

})();
