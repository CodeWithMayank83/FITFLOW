/* =========================================================
   FITFLOW: site behaviour (vanilla JS, no dependencies)
   1. Mobile menu
   2. Class filter
   3. Forms: validation, prefill, submission
========================================================= */
(() => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------------------------------------------------------
       1. MOBILE MENU
    --------------------------------------------------------- */
    const navbar = document.getElementById("navbar");
    const menuBtn = document.getElementById("menuBtn");

    function setMenu(open, returnFocus) {
        if (!navbar || !menuBtn) return;
        navbar.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        if (!open && returnFocus) menuBtn.focus();
    }

    if (navbar && menuBtn) {
        menuBtn.addEventListener("click", () => setMenu(!navbar.classList.contains("open")));

        navbar.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => setMenu(false));
        });

        document.addEventListener("keydown", e => {
            if (e.key === "Escape" && navbar.classList.contains("open")) setMenu(false, true);
        });

        document.addEventListener("click", e => {
            if (navbar.classList.contains("open") && !navbar.contains(e.target)) setMenu(false);
        });

        window.matchMedia("(min-width: 1001px)").addEventListener("change", e => {
            if (e.matches) setMenu(false);
        });
    }

    /* ---------------------------------------------------------
       2. CLASS FILTER
    --------------------------------------------------------- */
    const filterButtons = document.querySelectorAll(".category-btn");
    const classCards = document.querySelectorAll(".class-card");
    const classStatus = document.getElementById("classStatus");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
                btn.setAttribute("aria-pressed", "false");
            });
            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            const filter = button.dataset.filter;
            let shown = 0;
            classCards.forEach(card => {
                const match = filter === "all" || card.dataset.category === filter;
                card.classList.toggle("hidden", !match);
                if (match) shown++;
            });

            if (classStatus) {
                classStatus.textContent = `Showing ${shown} ${shown === 1 ? "class" : "classes"}`
                    + (filter === "all" ? "." : ` in ${button.textContent.trim()}.`);
            }
        });
    });

    /* ---------------------------------------------------------
       3. FORMS
       Both forms are validated in the browser. They are only SENT
       if the form has a data-endpoint URL (e.g. a Formspree URL).
       With no endpoint the form says clearly that nothing was sent.
    --------------------------------------------------------- */
    const MESSAGES = {
        name:    { empty: "Please enter your full name.",
                   invalid: "Please enter your full name (at least 2 characters)." },
        phone:   { empty: "Please enter your phone number so we can reach you.",
                   invalid: "Please enter a valid phone number (7 to 15 digits)." },
        email:   { empty: "Please enter your email address.",
                   invalid: "Please enter a valid email address, like name@example.com." },
        message: { empty: "Please tell us how we can help.",
                   invalid: "Please add a little more detail (at least 10 characters)." }
    };

    function validateValue(name, value) {
        const v = value.trim();
        if (name === "name")  return v.length >= 2;
        if (name === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        if (name === "phone") {
            const digits = v.replace(/\D/g, "");
            return /^[+\d\s().-]+$/.test(v) && digits.length >= 7 && digits.length <= 15;
        }
        if (name === "message") return v.length >= 10;
        return true;
    }

    function errorFor(field) {
        const name = field.name;
        const value = field.value;
        const required = field.required;
        const msgs = MESSAGES[name];
        if (!msgs) return "";
        if (value.trim() === "") return required ? msgs.empty : "";
        return validateValue(name, value) ? "" : msgs.invalid;
    }

    function showError(field, message) {
        const group = field.closest(".form-group");
        let box = document.getElementById(`${field.id}-error`);
        if (message) {
            if (!box) {
                box = document.createElement("p");
                box.id = `${field.id}-error`;
                box.className = "field-error";
                group.appendChild(box);
            }
            box.textContent = message;
            box.hidden = false;
            field.setAttribute("aria-invalid", "true");
            field.setAttribute("aria-describedby", box.id);
            group.classList.add("has-error");
        } else {
            if (box) box.hidden = true;
            field.removeAttribute("aria-invalid");
            field.removeAttribute("aria-describedby");
            group.classList.remove("has-error");
        }
    }

    function selectValueIfExists(select, value) {
        if ([...select.options].some(o => o.value === value)) select.value = value;
    }

    // Short, safe text taken from the URL (only ever inserted with textContent / .value)
    function param(params, key, max = 60) {
        const v = (params.get(key) || "").replace(/[\u0000-\u001f<>]/g, "").trim();
        return v.slice(0, max);
    }

    function contextNote(form, html) {
        const note = document.createElement("p");
        note.className = "form-context";
        note.append(...html);
        const header = form.querySelector(".form-header") || form.firstElementChild;
        header.insertAdjacentElement("afterend", note);
    }

    function strong(text) {
        const el = document.createElement("strong");
        el.textContent = text;
        return el;
    }

    // Pre-fill from links such as free-trial.html?goal=strength or ?class=HIIT%20Blast&when=Tuesday%2006%3A00%20PM
    function prefillTrial(form) {
        const params = new URLSearchParams(window.location.search);
        const goal = param(params, "goal");
        const cls = param(params, "class");
        const when = param(params, "when");
        const goalSelect = form.querySelector("#goal");
        const message = form.querySelector("#message");

        if (goal && goalSelect) selectValueIfExists(goalSelect, goal);

        if (cls) {
            const parts = ["Requesting a free trial of ", strong(cls)];
            if (when) parts.push(` (${when})`);
            parts.push(".");
            contextNote(form, parts);
            if (message && !message.value) {
                message.value = `I'd like to try ${cls}${when ? ` (${when})` : ""}.`;
            }
        }
    }

    // Pre-fill from membership links such as contact.html?subject=membership&plan=Quarterly
    function prefillContact(form) {
        const params = new URLSearchParams(window.location.search);
        const subject = param(params, "subject");
        const plan = param(params, "plan");
        const subjectSelect = form.querySelector("#contact-subject");
        const message = form.querySelector("#contact-message");

        if (subject && subjectSelect) selectValueIfExists(subjectSelect, subject);

        if (plan) {
            contextNote(form, ["Enquiring about the ", strong(`${plan} plan`), "."]);
            if (message && !message.value) {
                message.value = `I'd like to know more about the ${plan} membership plan.`;
            }
        }
    }

    function setStatus(status, type, nodes) {
        status.className = `form-status is-${type}`;
        status.replaceChildren(...nodes);
        status.hidden = false;
    }

    function fallbackNodes(form) {
        const tel = form.dataset.fallbackTel;
        const email = form.dataset.fallbackEmail;
        const nodes = [];
        if (tel) {
            const a = document.createElement("a");
            a.href = `tel:${tel}`;
            a.textContent = "call";
            nodes.push(a);
        }
        if (email) {
            const a = document.createElement("a");
            a.href = `mailto:${email}`;
            a.textContent = "email";
            if (nodes.length) nodes.push(" or ");
            nodes.push(a);
        }
        return nodes;
    }

    function initForm(form) {
        const isTrial = form.classList.contains("trial-form");
        const success = isTrial
            ? "Thank you. Your free trial request has been sent. Our team will contact you to confirm your session."
            : "Thank you. Your message has been sent. We'll get back to you soon.";

        const status = document.createElement("div");
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        status.hidden = true;
        form.appendChild(status);

        (isTrial ? prefillTrial : prefillContact)(form);

        const fields = [...form.querySelectorAll("input, select, textarea")];
        fields.forEach(field => {
            field.addEventListener("blur", () => { if (field.value.trim() !== "") showError(field, errorFor(field)); });
            field.addEventListener("input", () => { if (field.getAttribute("aria-invalid")) showError(field, errorFor(field)); });
        });

        form.addEventListener("submit", async e => {
            e.preventDefault();

            let firstInvalid = null;
            let count = 0;
            fields.forEach(field => {
                const message = errorFor(field);
                showError(field, message);
                if (message) { count++; if (!firstInvalid) firstInvalid = field; }
            });

            if (firstInvalid) {
                setStatus(status, "error", [`Please check ${count === 1 ? "the highlighted field" : `the ${count} highlighted fields`} and try again.`]);
                firstInvalid.focus();
                return;
            }

            const endpoint = (form.dataset.endpoint || "").trim();
            const button = form.querySelector('button[type="submit"]');

            // No endpoint configured: be honest. Nothing is sent anywhere.
            if (!endpoint) {
                const how = fallbackNodes(form);
                setStatus(status, "info", [
                    "Your details look good, but this form is not connected to a server yet, so nothing has been sent."
                    + (how.length ? " Please " : ""), ...how, how.length ? " the gym directly." : ""
                ]);
                return;
            }

            // Endpoint configured (e.g. Formspree): send for real and only report success if it worked.
            const originalLabel = button ? button.textContent : "";
            if (button) { button.disabled = true; button.textContent = "Sending…"; }
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    body: new FormData(form),
                    headers: { Accept: "application/json" }
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                setStatus(status, "success", [success]);
                form.reset();
            } catch (err) {
                const how = fallbackNodes(form);
                setStatus(status, "error", [
                    "Sorry, we couldn't send that just now."
                    + (how.length ? " Please try again, or " : " Please try again."), ...how, how.length ? " us directly." : ""
                ]);
            } finally {
                if (button) { button.disabled = false; button.textContent = originalLabel; }
            }
        });
    }

    document.querySelectorAll("form.trial-form, form.contact-form").forEach(initForm);

    // "Book Free Trial" button at the bottom of the trial page: jump to the form and focus the first field
    document.querySelectorAll('a[href="#trial-form"]').forEach(link => {
        link.addEventListener("click", e => {
            const form = document.getElementById("trial-form");
            const first = document.getElementById("name");
            if (!form || !first) return;
            e.preventDefault();
            form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            window.setTimeout(() => first.focus({ preventScroll: true }), reduceMotion ? 0 : 450);
        });
    });
})();
