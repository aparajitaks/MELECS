# MELECS Technologies — Website Redesign

Modern, responsive, professional corporate website for **MELECS Technologies Pvt Ltd** (`www.melecstech.com`).

Designed and built in accordance with the **Melecs Technologies – Website Redesign Brief** for engineering, automotive, aerospace, electrical, oil & gas, and manufacturing clients.

---

## 🚀 How to Run Locally

This is a pure static website requiring no server-side runtimes, databases, or build steps.

### Option 1: Direct File Opening
Double-click `index.html` or open any `.html` file directly in your web browser (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).

### Option 2: Local HTTP Server (Recommended)
Using Python (built into macOS and Linux):
```bash
cd /path/to/melecs
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

Using Node.js (`serve` or `http-server`):
```bash
npx serve .
```

---

## 📁 Project Structure

```
melecs/
├── index.html                   # Homepage (Hero, Services, Industries, Capabilities, Process, Why Choose, Contact)
├── services.html                # Services Overview Directory
├── mechanical-design.html       # Mechanical Design & BIW Fixtures
├── electrical-design.html       # Electrical Design & Control Panels
├── manufacturing.html           # Precision Tooling, Jigs & Machining
├── oil-and-gas.html             # Upstream/Downstream Equipment & Plant Layout
├── software.html                # Custom Software & Digital Engineering
├── about.html                   # About Melecs, Vision, Mission, Culture
├── careers.html                 # Careers Culture, Open Positions, Application Form
├── contact.html                 # Direct Contact, Map Info, Full RFP Form
├── robots.txt                   # Search Engine Crawler Directives
├── sitemap.xml                  # XML Sitemap for Search Indexing
├── README.md                    # Project Documentation & Client Handoff Guide
└── assets/
    ├── css/
    │   └── style.css            # Unified Design System Stylesheet
    ├── js/
    │   └── main.js              # Sticky Header, Eased Counters, Tab Controls, Form Feedback
    └── images/                  # High-resolution photographic and component assets
        ├── logo.png             # Official Melecs Wordmark Logo
        ├── favicon.png          # Browser Favicon
        ├── slide_automotive.jpg # Hero Carousel Slide 1: Automotive Manufacturing & Precision Tooling
        ├── slide_aerospace.jpg  # Hero Carousel Slide 2: Aerospace & Aerodynamic CFD Simulation
        ├── slide_digital_engineering.jpg # Hero Carousel Slide 3: Digital Engineering & EV Powertrain Wireframe
        ├── biw_cutaway.jpg      # Technical Vehicle Cutaway
        ├── boeing_aerospace.jpg # Aerospace Engineering Photo
        ├── audi_car.jpg         # Automotive Engineering Visual
        ├── about_multidiscipline.jpg # Multi-Disciplinary Engineering (CAD, CNC, Robotic Assembly, Clean Energy)
        ├── manufacturing_advanced.jpg # CNC Machining, Milling & Tooling Visual
        ├── oilgas_energy.jpg    # Refinery, Pumps, Vessels & Storage Visual
        ├── smart_factory.gif    # Robotics Animation (Archived)
        ├── oilgas.gif           # Pipeline Processing (Archived)
        ├── electrical_power.jpg # Power Plants, Substation, Panels & Wire Harness Visual
        ├── software_transformation.jpg # IDE Code, Cloud, AI & App Development Visual
        ├── software_sup.png     # Software Architecture (Archived)
        ├── parts.png            # Electrical Components (Archived)
        ├── about_banner.jpg     # About Page Banner
        ├── career_banner.jpg    # Careers Page Banner
        └── melecs_location_map.jpg # Google Maps Satellite View - Sahakar Nagar Office
```

---

## 🎨 Brand Design System

| Role | Color Name | Hex Code |
| :--- | :--- | :--- |
| **Main Headings & Dark Sections** | Primary Navy Blue | `#102A43` |
| **Buttons & Interactive Links** | Technology Blue | `#1769AA` |
| **Accents & Focus Indicators** | Electric Blue | `#36A3F7` |
| **Brand Accent Highlights** | Brand Pink / Magenta | `#E83E8C` |
| **Card & Page Backgrounds** | Pure White | `#FFFFFF` |
| **Alternate Sections** | Industrial Grey | `#E9EEF2` |
| **Body Typography & Footer** | Charcoal | `#202B36` |

### Typography
- **Headings**: `Montserrat` (Weights: 600, 700, 800)
- **Body**: `Inter` (Weights: 400, 500)
- **Technical Badges**: `Roboto Mono`
- **Navigation**: `Inter SemiBold` (Weight: 600)

---

## ✏️ How to Edit Content & Images

### Updating Text & Headings
1. Open the relevant `.html` file in any text editor (VS Code, Sublime Text, Notepad).
2. Locate the text between standard HTML tags (`<p>`, `<h2>`, `<li>`).
3. Save the file and refresh your browser.

### Replacing Images
1. Save your new image into the `assets/images/` directory.
2. In the target HTML file, find the `<img>` tag and update the `src` attribute:
   ```html
   <img src="assets/images/your-new-image.jpg" alt="Descriptive text" class="img-fluid" loading="lazy">
   ```
3. Recommended image dimensions:
   - Hero images: 1920×1080px (JPG/WebP, 150–300 KB)
   - Service cards & banners: 1200×800px (JPG/WebP, 100–250 KB)
   - Component cutaways: PNG or JPG with transparent or dark background

### Configuring Form Endpoints
Forms currently include client-side interactive feedback (loading spinner, success confirmation alert, reset). To connect to a live email endpoint:
- **Formspree**: Set `action="https://formspree.io/f/YOUR_FORM_ID"` on `<form class="ajax-contact-form">`
- **Web3Forms**: Add `<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">`
- **Custom PHP/Node backend**: Set `action="backend/contact.php"`

---

## 🌐 Deployment Options

### Netlify / Vercel (Instant 1-Click Drag & Drop)
1. Drag the entire project folder into [app.netlify.com/drop](https://app.netlify.com/drop) or import from GitHub on [Vercel](https://vercel.com).
2. Connect your custom domain `www.melecstech.com` with automated SSL/HTTPS.

### Traditional cPanel / Apache / Nginx
1. Upload all files and folders to your web root (`public_html/` or `/var/www/html/`).
2. Ensure HTTPS certificate is active.

---

## 📋 Client Placeholders Checklist (Per Brief §11)

The following items should be confirmed with Melecs Technologies leadership prior to commercial publication:

| # | Item to Confirm | Current Placeholder Status |
| :---: | :--- | :--- |
| 1 | **High-Resolution Logo** | `logo.png` included; SVG format recommended if available. |
| 2 | **Office Contact Details** | #1884, C block, Sahakar Nagar, Bangalore - 560092; +91 7899128234. |
| 3 | **Official Social Media URLs** | Profile links to official Melecs LinkedIn, Twitter/X, Facebook. |
| 4 | **Client Logos & Testimonials** | Ready to insert into `index.html` upon receiving written permissions. |
| 5 | **Certifications (e.g., ISO 9001)** | To be added to header/footer badges when documentation provided. |
| 6 | **Exact Statistics** | 10+ Years, 40+ Clients, 150+ Projects, 100% Quality (placeholders). |
| 7 | **CAD/EDA Tools List** | CATIA, NX, SolidWorks, EPLAN, ANSYS, PDMS included; verify internal licensing. |
| 8 | **Careers Open Roles** | 4 sample openings included; replace with active HR recruitment roles. |
| 9 | **Proprietary Media** | Replace stock photos with authentic Melecs shopfloor & lab photos when available. |
| 10 | **Oil & Gas / Software Scope** | Detailed scope aligned with Melecs current client offerings. |

---

## 🛡️ Accessibility & SEO Compliance

- **Semantic HTML5**: Full landmark hierarchy (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- **WCAG 2.1 AA**: Keyboard navigation with `:focus-visible` outlines, `skip-to-content` links, and linked form labels (`for` → `id`).
- **SEO Ready**: Canonical URLs, Open Graph tags, Twitter Cards, Schema.org Organization structured data, `robots.txt`, and `sitemap.xml`.
- **Fast Loading**: Zero render-blocking script dependencies, native image `loading="lazy"`, optimized Bootstrap & Font Awesome CDN delivery.

