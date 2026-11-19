/**
 * Twin Towers by Defoy — booking form receiver (Google Apps Script)
 * =============================================================
 *
 * The website posts booking enquiries from /contact to this script. The script
 * emails the resort team, optionally sends the guest a short acknowledgement,
 * optionally logs the request to a Google Sheet, and answers with JSON.
 *
 * SETUP — one time, about ten minutes
 * -----------------------------------
 * Recommended (script lives inside the bookings spreadsheet, so there is no
 * spreadsheet ID to copy):
 * 1. Create a Google Sheet, e.g. "Twin Towers — Bookings".
 * 2. In that sheet open Extensions → Apps Script.
 * 3. Delete the placeholder Code.gs and paste this whole file in.
 * 4. Edit NOTIFY_EMAIL, BOOKING_SECRET and GUEST_ACK below.
 *    BOOKING_SECRET must be the same value as BOOKING_WEBHOOK_SECRET in the
 *    website environment. Leave both empty to disable the check.
 * 5. Optional: run setupBookingSheet once and authorise. It creates the
 *    "Bookings" (contact form) and "Popup" (homepage Reserve popup) tabs
 *    with their header rows. If you skip this, the tabs and headers are
 *    created automatically on the first booking for each form.
 * 6. Click Deploy → New deployment → select type "Web app".
 *      Description:      Booking form
 *      Execute as:       Me
 *      Who has access:   Anyone
 *    Click Deploy, authorise the script, then copy the Web app URL.
 *    It looks like https://script.google.com/macros/s/AKfy…/exec
 * 7. In the website environment (.env.local locally, and the production
 *    environment) add:
 *      GOOGLE_APPS_SCRIPT_BOOKING_URL=https://script.google.com/macros/s/…/exec
 *      BOOKING_WEBHOOK_SECRET=<the same secret as BOOKING_SECRET below>
 * 8. Redeploy the website. Submit one test booking and confirm the email
 *    arrives, the guest acknowledgement lands in the guest inbox, and the row
 *    appears in the "Bookings" tab.
 *
 * Alternative (standalone script at https://script.google.com):
 * Create a new project, paste this file, then copy the spreadsheet ID from the
 * sheet URL (https://docs.google.com/spreadsheets/d/<THIS PART>/edit) into
 * SHEET_ID below. Everything else is the same.
 *
 * AFTER EDITING THIS FILE
 * -----------------------
 * Deploy → Manage deployments → pencil icon → Version: "New version" → Deploy.
 * The /exec URL stays the same; only the code changes.
 *
 * THE SHEET LOG
 * -------------
 * The website has two booking forms with different fields:
 *   • /contact ("Bookings" tab) — name, email, phone, CMS room + rate,
 *     check-in / check-out, guest count.
 *   • homepage "Reserve" popup ("Popup" tab) — phone-only, no email, plus
 *     meal plan (EP / CP / MAP) and adults / children steppers.
 * Each accepted request is logged to the tab for the form it came from, with
 * headers matching what that form actually collects. Tabs and header rows are
 * created automatically on the first booking — or run setupBookingSheet()
 * once. Set LOG_TO_SHEET to false to stop logging. A sheet failure never
 * blocks a booking — the team email has already been sent at that point, so
 * the request is never lost.
 *
 * NOTES
 * -----
 * • MailApp sends from the Google account that owns the script. Consumers have
 *   a daily quota (about 100 recipients); a Workspace account has more.
 * • The script never exposes the guest's contact details to the browser.
 * • All fields are escaped before being placed into the HTML email.
 * • Booking rows contain personal data. Share the spreadsheet only with people
 *   who need it, and do not publish it.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Where booking enquiries are sent. Comma-separate several addresses. */
var NOTIFY_EMAIL = "twintowers@defoy.in";

/** Shared secret. Must match BOOKING_WEBHOOK_SECRET on the website. */
var BOOKING_SECRET = "";

/** Send the guest a short "we have your request" email? */
var GUEST_ACK = true;

/** Append every request to a Google Sheet? */
var LOG_TO_SHEET = true;

/**
 * Spreadsheet to log into. Leave empty when the script is bound to the
 * spreadsheet (Extensions → Apps Script); it then uses that spreadsheet.
 */
var SHEET_ID = "";

/** Tab for the /contact form (email included, CMS room + rate). */
var TAB_CONTACT = "Bookings";

/** Tab for the homepage "Reserve" popup (phone-only, meal plan, steppers). */
var TAB_POPUP = "Popup";

/** Header rows — one per tab. Must match the row order built in doPost(). */
var HEADERS_CONTACT = [
  "Received",
  "Name",
  "Email",
  "Phone",
  "Room",
  "Rate",
  "Check-in",
  "Check-out",
  "Guests",
  "Page",
  "Notes",
];

var HEADERS_POPUP = [
  "Received",
  "Name",
  "Phone",
  "Room",
  "Meal plan",
  "Adults",
  "Children",
  "Check-in",
  "Check-out",
  "Guests",
  "Page",
  "Notes",
];

// ---------------------------------------------------------------------------
// Web app handlers
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    var data = parseBody_(e);
    if (!data) {
      return json_({ ok: false, error: "Could not read the request." });
    }

    if (BOOKING_SECRET && String(data.secret || "") !== BOOKING_SECRET) {
      return json_({ ok: false, error: "Unauthorised." });
    }

    var name = clean_(data.name, 80);
    var email = clean_(data.email, 160);
    var phone = clean_(data.phone, 40);
    var room = clean_(data.room, 96);
    var checkin = clean_(data.checkin, 10);
    var checkout = clean_(data.checkout, 10);
    var guests = clean_(data.guests, 40);
    var notes = clean_(data.notes, 1500);
    var rate = clean_(data.nightlyRate, 40);
    var mealPlan = clean_(data.mealPlan, 8);
    var adults = clean_(data.adults, 4);
    var children = clean_(data.children, 4);
    var submittedAt = clean_(data.submittedAt, 40) || new Date().toISOString();
    var source = clean_(data.source, 200);
    var form = clean_(data.form, 16);
    var isPopup = /^popup$/i.test(form) || /popup/i.test(source);

    if (name.length < 2 || room.length < 1) {
      return json_({ ok: false, error: "Name and room are required." });
    }
    if (!email && !phone) {
      return json_({ ok: false, error: "Add an email address or phone number." });
    }

    var received = new Date(submittedAt);
    var receivedLabel = isNaN(received.getTime())
      ? submittedAt
      : Utilities.formatDate(received, "Asia/Kolkata", "d MMM yyyy, HH:mm 'IST'");

    var subject = "Booking request — " + name + " · " + room;
    var plainBody = [
      "New booking request from " + source,
      "",
      "Received:  " + receivedLabel,
      "Name:      " + name,
      "Email:     " + (email || "—"),
      "Phone:     " + (phone || "—"),
      "Room:      " + room + (rate ? " (" + rate + " / night)" : ""),
      mealPlan ? "Meal plan: " + mealPlan : "",
      adults ? "Adults:    " + adults : "",
      children ? "Children:  " + children : "",
      "Check-in:  " + (checkin || "—"),
      "Check-out: " + (checkout || "—"),
      "Guests:    " + (guests || "—"),
      "",
      "Notes:",
      notes || "—",
      "",
      "Reply directly to this email to answer the guest.",
    ].join("\n");

    var options = {
      to: NOTIFY_EMAIL,
      subject: subject,
      body: plainBody,
      htmlBody: emailHtml_(receivedLabel, name, email, phone, room, rate, mealPlan, checkin, checkout, guests, notes, source, adults, children, isPopup),
    };
    if (email) options.replyTo = email;

    MailApp.sendEmail(options);

    if (GUEST_ACK && email) {
      try {
        MailApp.sendEmail({
          to: email,
          subject: "We have your request — Twin Towers by Defoy",
          body: [
            "Hello " + name + ",",
            "",
            "Thank you — your request for the " + room + " has reached the Twin Towers by Defoy team.",
            checkin ? "Check-in:  " + checkin : "",
            checkout ? "Check-out: " + checkout : "",
            guests ? "Guests:    " + guests : "",
            "",
            "A person from the resort will reply with availability and the final rate, usually within the hour on working days. If you would like to speak now, call or message +91 95418 98817.",
            "",
            "Twin Towers by Defoy",
            "Pahalgam, Jammu & Kashmir",
            "twintowers@defoy.in",
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch (ackError) {
        // The team email already went out; never fail the request for this.
        console.warn("Guest acknowledgement failed: " + ackError);
      }
    }

    var sheetRow = isPopup
      ? [receivedLabel, name, phone, room, mealPlan, adults, children, checkin, checkout, guests, source, notes]
      : [receivedLabel, name, email, phone, room, rate, checkin, checkout, guests, source, notes];
    logToSheet_(sheetRow, isPopup);

    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: "The resort inbox could not be reached." });
  }
}

function doGet() {
  return ContentService.createTextOutput(
    "Twin Towers by Defoy booking endpoint is running. " +
      (LOG_TO_SHEET ? "Sheet log: enabled." : "Sheet log: disabled.")
  ).setMimeType(ContentService.MimeType.TEXT);
}

// ---------------------------------------------------------------------------
// Sheet setup helpers — run these once from the Apps Script editor
// ---------------------------------------------------------------------------

/**
 * Creates the log tab and header row, and returns the spreadsheet URL.
 * Safe to run repeatedly.
 */
function setupBookingSheet() {
  var spreadsheet = getLogSpreadsheet_();
  if (!spreadsheet) {
    throw new Error(
      "No spreadsheet found. Open this script from the sheet " +
        "(Extensions → Apps Script), or set SHEET_ID below."
    );
  }
  getLogSheet_(spreadsheet, TAB_CONTACT, HEADERS_CONTACT);
  getLogSheet_(spreadsheet, TAB_POPUP, HEADERS_POPUP);
  return "Contact form logs to '" + TAB_CONTACT + "', Reserve popup logs to '" + TAB_POPUP + "': " + spreadsheet.getUrl();
}

/** Appends a clearly-marked sample row so you can confirm the log works. */
function testSheetLog() {
  var stamp = "TEST — " + Utilities.formatDate(new Date(), "Asia/Kolkata", "d MMM yyyy, HH:mm 'IST'");
  var contact = logToSheet_(
    [stamp, "Test Guest", "test@example.com", "+91 90000 00000", "Test Room", "₹1,000 / night", "2026-01-01", "2026-01-02", "2", "manual test", "Created by testSheetLog(). Delete this row."],
    false
  );
  var popup = logToSheet_(
    [stamp, "Test Guest", "+91 90000 00000", "Test Room", "MAP", "2", "1", "2026-01-01", "2026-01-02", "2 adults · 1 child", "manual test", "Created by testSheetLog(). Delete this row."],
    true
  );
  return "Contact form test row: " + (contact ? "added to '" + TAB_CONTACT + "'." : "FAILED — check the execution log")
    + "  Popup test row: " + (popup ? "added to '" + TAB_POPUP + "'." : "FAILED — check the execution log");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return null;
  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    // Some clients send form-encoded data (e.g. `?name=…`).
    if (e.parameter && Object.keys(e.parameter).length) return e.parameter;
    return null;
  }
}

function clean_(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

function escape_(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function emailHtml_(receivedLabel, name, email, phone, room, rate, mealPlan, checkin, checkout, guests, notes, source, adults, children, isPopup) {
  var rows = [
    ["Form", isPopup ? "Reserve popup (homepage)" : "Contact form (/contact)"],
    ["Received", receivedLabel],
    ["Name", name],
    ["Email", email || "—"],
    ["Phone", phone || "—"],
    ["Room", rate ? room + " · " + rate + " / night" : room],
    ...(mealPlan ? [["Meal plan", mealPlan]] : []),
    ...(adults ? [["Adults", adults]] : []),
    ...(children ? [["Children", children]] : []),
    ["Check-in", checkin || "—"],
    ["Check-out", checkout || "—"],
    ["Guests", guests || "—"],
    ["Page", source || "—"],
  ];

  var table = rows
    .map(function (row) {
      return (
        '<tr><td style="padding:6px 14px 6px 0;color:#6b6459;font:12px/1.5 Arial,sans-serif;vertical-align:top">' +
        escape_(row[0]) +
        '</td><td style="padding:6px 0;color:#1f1d1a;font:14px/1.5 Arial,sans-serif">' +
        escape_(row[1]) +
        "</td></tr>"
      );
    })
    .join("");

  return (
    '<div style="max-width:620px;font-family:Arial,Helvetica,sans-serif">' +
    '<p style="font:11px/1.6 Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#8a6a4f;margin:0 0 6px">Twin Towers by Defoy</p>' +
    '<h1 style="font:600 26px/1.2 Georgia,serif;color:#1f1d1a;margin:0 0 18px">New booking request</h1>' +
    '<table style="border-collapse:collapse;margin:0 0 20px">' +
    table +
    "</table>" +
    '<p style="font:12px/1.6 Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6b6459;margin:0 0 6px">Notes</p>' +
    '<p style="font:15px/1.7 Arial,sans-serif;color:#1f1d1a;white-space:pre-wrap;margin:0 0 22px">' +
    escape_(notes || "—") +
    "</p>" +
    '<p style="font:13px/1.6 Arial,sans-serif;color:#6b6459;margin:0">Reply to this email to answer the guest directly.</p>' +
    "</div>"
  );
}

function logToSheet_(row, isPopup) {
  if (!LOG_TO_SHEET) return false;

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockError) {
    console.warn("Sheet log busy, writing without the lock: " + lockError);
    lock = null;
  }

  try {
    var spreadsheet = getLogSpreadsheet_();
    if (!spreadsheet) {
      console.warn("Sheet log skipped: no spreadsheet available.");
      return false;
    }
    var tab = isPopup ? TAB_POPUP : TAB_CONTACT;
    var headers = isPopup ? HEADERS_POPUP : HEADERS_CONTACT;
    var sheet = getLogSheet_(spreadsheet, tab, headers);
    sheet.appendRow(row);
    return true;
  } catch (error) {
    console.warn("Could not log to the sheet: " + error);
    return false;
  } finally {
    if (lock) {
      try {
        lock.releaseLock();
      } catch (releaseError) {
        // Nothing useful to do here.
      }
    }
  }
}

/** The bound spreadsheet when the script is inside a sheet, else SHEET_ID. */
function getLogSpreadsheet_() {
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID);
  try {
    return SpreadsheetApp.getActiveSpreadsheet() || null;
  } catch (error) {
    return null;
  }
}

/** Finds a tab, creating it with a bold header row when it is missing. */
function getLogSheet_(spreadsheet, tab, headers) {
  var sheet = spreadsheet.getSheetByName(tab);
  if (!sheet) sheet = spreadsheet.insertSheet(tab);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var header = sheet.getRange(1, 1, 1, headers.length);
    header
      .setFontWeight("bold")
      .setBackground("#f0ece4")
      .setVerticalAlignment("middle");
    sheet.setFrozenRows(1);
  }

  return sheet;
}
