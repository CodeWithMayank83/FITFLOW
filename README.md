# FITFLOW website

Static site: HTML, CSS and vanilla JavaScript. No build step, no dependencies. Open `index.html`.

## Pages
index, programs, classes, trainers, membership, contact, free-trial.
Shared styles/components are in `style.css`; each page adds only page-specific rules in its own CSS file.

## Forms: IMPORTANT
Both forms (`free-trial.html`, `contact.html`) validate in the browser, but **do not deliver anything yet**.
Until a destination is configured they tell the visitor honestly that nothing was sent and show call/email links.

To go live, set `data-endpoint` on the `<form>` to a form-handling URL (e.g. a Formspree endpoint that accepts
a POST with `Accept: application/json`). The script then sends the data and only shows "sent" if the server says OK.
Also replace the placeholder `data-fallback-tel` / `data-fallback-email` on both forms.

## Owner must supply (placeholders currently in the site)
- Phone `+91 98765 43210` (Contact page, tel link, WhatsApp `wa.me` link, form fallbacks)
- Email `hello@fitflow.com`
- Address `123 Fitness Avenue, New Delhi, India` and opening hours (Contact page; the Get Directions link searches this address)
- Social profile URLs (Instagram, Facebook, WhatsApp): removed from the footer because they were dead `#` links; see the comment in the footer
- Hero stats on the home page (1.5K+ members, 12+ trainers, 20+ weekly classes): not supported elsewhere on the site
  (Trainers page lists 4 coaches, schedule lists 6 weekly classes)
- Coaches named in Classes (Emma, Mike, Sam) who are not on the Trainers page; confirm names and whether they need profiles
- Membership: what differs between "Access to group classes" (Monthly) and "All group classes" (Quarterly/Annual);
  whether the "Recommended" plan label is the owner's intended emphasis; any taxes/fees/terms
- Class schedule days/times and class levels
