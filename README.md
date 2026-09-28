# Gideon Peprah Ministries – Next.js Website

A full Next.js 14 website clone based on the EAM structure, rebranded for **Gideon Peprah Ministries**.

## Color Scheme
- **Primary (dominant):** Deep Green `#1a5c2a`
- **Accent:** Gold `#c9a227`
- **Background:** White / Off-white

## Pages
- `/` – Home (hero, welcome, help cards, resources, news, TV)
- `/about-us` – About (history, faith statements, pastor bio, leadership)
- `/what-we-do` – Ministry areas (evangelism, education, outreach, teaching)
- `/events` – Upcoming events list
- `/resources` – Books, audio sermons, Bible study guides
- `/media` – News articles + VALOR TV
- `/contact` – Contact form + info
- `/get-involved` – Partnership tiers + giving options

## Setup & Running

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
gideon-peprah-ministries/
├── app/
│   ├── layout.tsx          # Root layout with Navbar & Footer
│   ├── globals.css         # Global styles + CSS variables
│   ├── page.tsx            # Home page
│   ├── about-us/page.tsx
│   ├── what-we-do/page.tsx
│   ├── events/page.tsx
│   ├── resources/page.tsx
│   ├── media/page.tsx
│   ├── contact/page.tsx
│   └── get-involved/page.tsx
├── components/
│   ├── Navbar.tsx          # Sticky nav with dropdowns + mobile menu
│   └── Footer.tsx
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Customisation Notes

- Replace Unsplash placeholder images with real ministry photos
- Update contact details in `/app/contact/page.tsx`
- Update event dates/details in `/app/events/page.tsx`
- Add real giving/donation links in `/app/get-involved/page.tsx`
- Update social media links in `Footer.tsx`
- Add a real logo image and update `Navbar.tsx` / `Footer.tsx`
