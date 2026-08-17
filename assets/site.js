/*!
 * site.js — shared interactivity for Stitch business-center concept pages.
 * Adds: mobile nav drawer, working anchor navigation, mailto-powered
 * contact forms, and light tel:/wa.me wiring where a phone number exists.
 *
 * Written defensively: every feature is optional per page. If a page is
 * missing the expected structure (no nav, no form, etc.) that feature is
 * simply skipped — nothing throws, nothing is force-added.
 */
(function () {
  "use strict";

  var MAILTO_ADDRESS = "info@businesscenter.uz";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function ensureSmoothScroll() {
    if (document.getElementById("site-js-smooth-scroll")) return;
    var style = document.createElement("style");
    style.id = "site-js-smooth-scroll";
    style.textContent = "html{scroll-behavior:smooth;}";
    document.head.appendChild(style);
  }

  // ---------------------------------------------------------------------
  // Mobile navigation: find the desktop nav (hidden below lg breakpoint),
  // clone its links into an injected slide-down drawer, add a hamburger
  // button that toggles it. Also rewrites dead href="#" links so they
  // point at real section ids (see wireAnchors below) once those exist.
  // ---------------------------------------------------------------------
  function setupMobileNav() {
    var nav = document.querySelector("header nav.hidden.lg\\:flex") ||
      document.querySelector("nav.hidden.lg\\:flex");
    if (!nav) return null;

    var links = nav.querySelectorAll("a");
    if (!links.length) return null;

    var header = nav.closest("header") || document.body;

    // Try to match the nav's own text color / accent so the button doesn't
    // look bolted on. Fall back to currentColor-friendly classes.
    var sampleLink = links[0];
    var iconColorClass = "text-on-surface";
    var candidateClasses = ["text-on-surface", "text-on-background", "text-secondary"];
    for (var i = 0; i < candidateClasses.length; i++) {
      if (document.querySelector("." + candidateClasses[i])) {
        iconColorClass = candidateClasses[i];
        break;
      }
    }

    var btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle navigation menu");
    btn.setAttribute("aria-expanded", "false");
    btn.className = "lg:hidden inline-flex items-center justify-center w-10 h-10 " + iconColorClass;
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" class="site-js-icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>' +
      '<svg xmlns="http://www.w3.org/2000/svg" class="site-js-icon-close hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    // Insert the button right after the nav within the header row, so it
    // sits where the desktop nav would be, on the same flex row.
    if (nav.parentNode) {
      nav.parentNode.insertBefore(btn, nav.nextSibling);
    } else {
      header.appendChild(btn);
    }

    // Build the drawer, cloning the nav's links (keeping their classes/text).
    var drawerBg = "bg-background";
    if (document.querySelector(".bg-surface")) drawerBg = "bg-surface";

    var drawer = document.createElement("div");
    drawer.className = "site-js-mobile-drawer lg:hidden hidden " + drawerBg;
    drawer.setAttribute("data-state", "closed");
    drawer.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:60;padding-top:5rem;" +
      "max-height:100vh;overflow-y:auto;box-shadow:0 10px 30px rgba(0,0,0,0.25);";

    var list = document.createElement("nav");
    list.className = "flex flex-col";
    links.forEach(function (link) {
      var clone = link.cloneNode(true);
      clone.className = (link.className || "") + " block w-full px-6 py-4 border-b border-current/10";
      list.appendChild(clone);
    });
    drawer.appendChild(list);
    document.body.appendChild(drawer);

    function openDrawer() {
      drawer.classList.remove("hidden");
      requestAnimationFrame(function () {
        drawer.setAttribute("data-state", "open");
      });
      btn.setAttribute("aria-expanded", "true");
      btn.querySelector(".site-js-icon-open").classList.add("hidden");
      btn.querySelector(".site-js-icon-close").classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      drawer.setAttribute("data-state", "closed");
      drawer.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      btn.querySelector(".site-js-icon-open").classList.remove("hidden");
      btn.querySelector(".site-js-icon-close").classList.add("hidden");
      document.body.style.overflow = "";
    }

    btn.addEventListener("click", function () {
      if (drawer.classList.contains("hidden")) {
        openDrawer();
      } else {
        closeDrawer();
      }
    });

    list.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeDrawer);
    });

    return { desktopLinks: links, drawerLinks: list.querySelectorAll("a") };
  }

  // ---------------------------------------------------------------------
  // Anchor navigation: pick major section-like blocks in document order
  // and assign them ids, then point nav links (desktop + mobile clones)
  // at those ids positionally. Skips if no nav links exist.
  // ---------------------------------------------------------------------
  function wireAnchors(navRefs) {
    if (!navRefs || !navRefs.desktopLinks || !navRefs.desktopLinks.length) return;

    var desktopLinks = Array.prototype.slice.call(navRefs.desktopLinks);
    var drawerLinks = navRefs.drawerLinks ? Array.prototype.slice.call(navRefs.drawerLinks) : [];

    // Candidate blocks: <section> elements anywhere in the document are
    // the primary signal (querySelectorAll is deep, so nested sections
    // inside a <main><div> wrapper are still found). If there still
    // aren't enough to give every nav link a distinct target, widen the
    // search to direct children of <main> (or its wrapper div) and any
    // large content blocks, then fall back to <main> itself.
    var sections = Array.prototype.slice.call(document.querySelectorAll("section"));

    if (sections.length < desktopLinks.length) {
      var main = document.querySelector("main");
      var containers = main ? [main].concat(Array.prototype.slice.call(main.children)) : [];
      containers.forEach(function (container) {
        Array.prototype.slice.call(container.children).forEach(function (el) {
          if (sections.indexOf(el) === -1 && el.tagName !== "SECTION" &&
            ["SCRIPT", "STYLE"].indexOf(el.tagName) === -1) {
            sections.push(el);
          }
        });
      });
    }

    if (!sections.length) {
      var fallback = document.querySelector("main") || document.body;
      sections = [fallback];
    }

    var count = Math.min(desktopLinks.length, sections.length);
    var ids = [];
    for (var i = 0; i < count; i++) {
      var el = sections[i];
      if (!el.id) {
        el.id = "section-" + (i + 1);
      }
      ids.push("#" + el.id);
    }
    // If there are still more nav links than distinct sections, point the
    // remaining links at the last available section rather than leaving
    // a dead href="#" — clicking still scrolls somewhere sensible.
    while (ids.length < desktopLinks.length) {
      ids.push(ids[ids.length - 1]);
    }

    // Footer/contact heuristic: if a link's text suggests contact/footer
    // and a <footer> or form exists, prefer pointing it there.
    var footer = document.querySelector("footer");
    var form = document.querySelector("form");

    for (var j = 0; j < desktopLinks.length; j++) {
      var linkText = (desktopLinks[j].textContent || "").trim().toLowerCase();
      var targetId = ids[j];
      if (/contact|inquiry|book|apply|footer/.test(linkText)) {
        if (form) {
          var formSection = form.closest("section");
          if (formSection) {
            if (!formSection.id) formSection.id = "section-contact";
            targetId = "#" + formSection.id;
          }
        } else if (footer) {
          if (!footer.id) footer.id = "section-footer";
          targetId = "#" + footer.id;
        }
      }
      desktopLinks[j].setAttribute("href", targetId);
      if (drawerLinks[j]) drawerLinks[j].setAttribute("href", targetId);
    }

    // Smooth-scroll on click (CSS already handles it, but guard against
    // pages where scroll-behavior might be overridden, and stop default
    // jump if for some reason CSS smooth-scroll isn't honored).
    desktopLinks.concat(drawerLinks).forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href.charAt(0) !== "#" || href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // ---------------------------------------------------------------------
  // Forms: assign name attributes based on placeholder/label/id text,
  // then wire submit -> mailto:. Required on email (and name if present)
  // fields via native HTML5 validation.
  // ---------------------------------------------------------------------
  function slugify(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "field";
  }

  function inferFieldName(field, index) {
    if (field.name) return field.name;

    // The field's own type/tag is the strongest signal (labels in Stitch
    // markup are often just visually-adjacent, not for-associated).
    if (field.type === "email") return "email";
    if (field.type === "tel") return "phone";
    if (field.tagName === "TEXTAREA") return "message";

    var label = null;
    if (field.id) {
      label = document.querySelector('label[for="' + field.id + '"]');
    }
    if (!label) {
      label = field.closest("div") ? field.closest("div").querySelector("label") : null;
    }
    var labelText = label ? label.textContent.trim() : "";
    var placeholder = field.getAttribute("placeholder") || "";
    var base = labelText || placeholder || field.id || (field.tagName.toLowerCase() + "_" + (index + 1));

    var slug = slugify(base);

    // Normalize a few common concepts to friendlier keys.
    if (/email/.test(slug)) return "email";
    if (/(full_?name|your_?name|name)$/.test(slug) || slug === "name") return "name";
    if (/phone|tel|contact_number/.test(slug)) return "phone";
    if (/company|entity|organization|corporate_entity/.test(slug)) return "company";
    if (/service|interest/.test(slug)) return "service";
    if (/message|inquiry|purpose|nature|note/.test(slug)) return "message";

    return slug;
  }

  function labelForField(field) {
    if (field.id) {
      var l = document.querySelector('label[for="' + field.id + '"]');
      if (l && l.textContent.trim()) return l.textContent.trim();
    }
    var closestDiv = field.closest("div");
    if (closestDiv) {
      var innerLabel = closestDiv.querySelector("label");
      if (innerLabel && innerLabel.textContent.trim()) return innerLabel.textContent.trim();
    }
    var ph = field.getAttribute("placeholder");
    if (ph && ph.trim()) return ph.trim();
    return field.name || "Field";
  }

  function setupForm(form) {
    var fields = Array.prototype.slice.call(
      form.querySelectorAll("input, textarea, select")
    ).filter(function (f) {
      return f.type !== "hidden" && f.type !== "submit" && f.type !== "button";
    });
    if (!fields.length) return;

    fields.forEach(function (field, idx) {
      if (!field.name) {
        field.name = inferFieldName(field, idx);
      }
      // Ensure at least the email field is required; also require an
      // explicit "name"-like text field if present. Non-disruptive:
      // relies on native HTML5 validation only.
      if (field.type === "email" || field.name === "email") {
        field.required = true;
      } else if (field.name === "name" && (field.tagName === "INPUT")) {
        field.required = true;
      }
    });

    function buildMailto() {
      var subjectSource = document.title || document.querySelector("h1");
      var subjectText = document.title && document.title.trim()
        ? document.title.trim()
        : (document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : "Website Inquiry");
      var subject = "Website Inquiry — " + subjectText.replace(/\s+/g, " ").slice(0, 80);

      var lines = [];
      fields.forEach(function (field) {
        var val = (field.value || "").trim();
        if (!val) return;
        lines.push(labelForField(field) + ": " + val);
      });
      if (!lines.length) return null;

      var body = lines.join("\n");
      return "mailto:" + MAILTO_ADDRESS +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    }

    function trigger(e) {
      // Respect native validation (required fields etc.) without building
      // a custom UI: reportValidity() shows the browser's own bubble.
      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        if (e) e.preventDefault();
        return;
      }
      var mailto = buildMailto();
      if (!mailto) {
        if (e) e.preventDefault();
        return;
      }
      if (e) e.preventDefault();
      window.location.href = mailto;
    }

    var submitBtn = form.querySelector('button[type="submit"], button[type="button"], input[type="submit"], button:not([type])');

    if (submitBtn && submitBtn.getAttribute("type") === "button") {
      // Less invasive: keep it a plain button, just listen for clicks.
      submitBtn.addEventListener("click", trigger);
    } else {
      // type="submit" (or no explicit type, which defaults to submit
      // inside a form) — intercept the form's submit event instead.
      form.addEventListener("submit", trigger);
    }
  }

  function setupForms() {
    document.querySelectorAll("form").forEach(setupForm);
  }

  // ---------------------------------------------------------------------
  // Optional polish: wire up tel: links for phone numbers already present
  // as plain text (never invent numbers). Matches Uzbek-style +998 numbers.
  // ---------------------------------------------------------------------
  function linkifyPhoneNumbers() {
    var phoneRe = /\+998[\d\s()-]{7,}\d/;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (phoneRe.test(node.nodeValue) && node.parentElement && node.parentElement.tagName !== "A") {
        textNodes.push(node);
      }
    }
    textNodes.forEach(function (textNode) {
      var match = textNode.nodeValue.match(phoneRe);
      if (!match) return;
      var raw = match[0];
      var digits = raw.replace(/[^\d+]/g, "");
      var a = document.createElement("a");
      a.href = "tel:" + digits;
      a.className = "hover:underline";
      a.textContent = raw;

      var idx = textNode.nodeValue.indexOf(raw);
      var before = textNode.nodeValue.slice(0, idx);
      var after = textNode.nodeValue.slice(idx + raw.length);

      var parent = textNode.parentNode;
      if (!parent) return;
      var frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));
      frag.appendChild(a);
      if (after) frag.appendChild(document.createTextNode(after));
      parent.replaceChild(frag, textNode);
    });
  }

  ready(function () {
    try { ensureSmoothScroll(); } catch (e) {}
    var navRefs = null;
    try { navRefs = setupMobileNav(); } catch (e) {}
    try { wireAnchors(navRefs); } catch (e) {}
    try { setupForms(); } catch (e) {}
    try { linkifyPhoneNumbers(); } catch (e) {}
  });
})();
