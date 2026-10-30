# Ankit Kumar | Mechanical Design Portfolio

A responsive, static portfolio for a Diploma Mechanical Engineering student interested in mechanical design, CAD, robotics, and engineering automation. Built with HTML, CSS, and vanilla JavaScript; no build step or package install is required.

## Run locally

Open `index.html` in a browser. If your browser blocks the Three.js CDN module when opened as a local file, serve this folder with a static server, for example:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`. The Three.js scene and Lucide icons are loaded from CDNs; the rest of the site remains dependency-free.

## Personalize before publishing

- Replace the generic LinkedIn and GitHub destinations in `index.html` with your profile URLs.
- Update the contact email in `index.html` and `resume.html` if it changes.
- Fill in your college, graduation year, internship availability, certification entries, and skill levels.
- Profile, proficiency, and certification fields save to local storage in the current browser. They do not update the source files or sync to other devices.
- Replace project concept prompts with your actual CAD images, circuit diagram, materials, fabrication methods, and verified test results. The illustrations are original schematic placeholders, not photographs or evidence of a finished build.
- Complete `resume.html` with accurate details, then use **Print / Save as PDF** to export a PDF. Remove all template prompts before sharing it.

## Files

- `index.html` — portfolio content and page structure
- `styles.css` — responsive visual system and layout
- `script.js` — mobile navigation, saved editable fields, and reveal behavior
- `scene.js` — lightweight Three.js gear-and-linkage hero illustration
- `resume.html` — editable print-ready resume template
