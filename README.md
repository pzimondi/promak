# PROMAK Travel and Tours — Website

A modern, mobile-first, static website for PROMAK Travel and Tours. No backend, no third-party form services, no setup required — it just works.

## File Structure

```
promak-website/
├── index.html         (Homepage)
├── services.html      (Services overview)
├── tours.html         (Tour listings)
├── about.html         (About page)
├── contact.html       (Contact page)
├── book.html          (Booking form)
├── css/
│   └── styles.css     (Single shared stylesheet)
├── js/
│   └── main.js        (Menu, animations, form handling)
├── images/
│   ├── logo.svg, logo-white.svg     (Original PROMAK logo)
│   ├── favicon.svg, favicon.ico     (Browser tab icon)
│   ├── apple-touch-icon.png         (iOS home-screen icon)
│   ├── og-mark.png                  (Social share image)
│   ├── hero-bg.svg                  (Homepage hero background)
│   └── tour-*.svg                   (Tour illustrations)
└── README.md
```

## How the Forms Work

The contact and booking forms work in a simple, reliable way — **no backend, no setup, no third-party services**.

When a visitor fills in a form and clicks submit, they get two buttons:

1. **Send via Email** — opens the visitor's default email app (Gmail, Outlook, Apple Mail, etc.) with everything pre-filled, addressed to `jarsonemakond@gmail.com`. They just hit send.
2. **Send via WhatsApp** — opens WhatsApp with everything pre-filled (sends to `+27 73 129 6245`). They hit send in WhatsApp.

The visitor just hits send. The message arrives in your Gmail or WhatsApp directly.

**Why this works well for a tour business:**
- Zero monthly cost or signup
- Works offline-friendly (no API calls)
- WhatsApp is already how most travellers like to communicate
- You can reply from your phone instantly

**One thing to know:** the "Send via Email" button needs the visitor to have an email app set up on their device (Gmail, Outlook, Apple Mail, etc.). Most people do — but for those who don't, the WhatsApp button is always available as a backup.

## Running Locally

The site is plain HTML/CSS/JS — no build step.

**Easiest way:** double-click `index.html` to open in your browser.

**Better way for testing** (some features need a server):

```bash
# If you have Python:
python3 -m http.server 8000
# Then open: http://localhost:8000
```

## Deploying

### Option 1: Netlify (Free, easiest)
1. Go to https://app.netlify.com/drop
2. Drag the entire `promak-website` folder onto the page
3. Done — you'll get a free URL like `your-site.netlify.app`
4. (Optional) Connect a custom domain in Netlify settings

### Option 2: GitHub Pages (Free)
1. Create a free account at https://github.com
2. Create a new repo, upload all files, enable GitHub Pages in settings

### Option 3: Any web host
Upload all files via FTP to your hosting provider's `public_html` folder.

## Customising

- **Phone / email / WhatsApp** — search the project for `27731296245` and `jarsonemakond` and find/replace.
- **Tour prices** — edit prices in `tours.html`, `index.html`, and `book.html`.
- **Brand colours** — modify CSS variables at the top of `css/styles.css` (look for `:root`).
- **Logo** — replace `images/logo.svg` and `images/logo-white.svg` if you commission a designer.
- **Add or remove tours** — duplicate a tour block in `tours.html` and update the booking radio cards in `book.html`.

## Tech Notes

- **Mobile-first** responsive design (looks great on phones, tablets, desktops).
- **No frameworks** — plain HTML/CSS/JS for fast loading and easy maintenance.
- **No third-party services** — no API keys, no monthly fees, no broken integrations.
- **Accessible** — keyboard navigation, skip-link, focus-visible states, ARIA labels.
- **SEO-ready** — meta tags, semantic HTML, Open Graph for social sharing.
- **Fonts** loaded from Google Fonts (Fraunces + Outfit), cached automatically.

---
© PROMAK Travel and Tours
