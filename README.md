# Denver Resource Directory

A mobile-friendly resource directory for Denver-area homeless outreach and case management. Built with plain HTML, CSS, and JavaScript for GitHub Pages.

## First version

- Search resource names, services, eligibility, and notes.
- Filter by service category, with two quick buttons: Shelter (Overnight) and Shelter (Day Center).
- Open phone, website, and map links when the source provides usable details.
- Expand intake, eligibility, and source notes.

## Data

`data/resources.json` contains 207 entries based on OUTREACH RESOURCE GUIDE - CURRENT.ods, with owner-requested category corrections and removals. The AID Center and duplicate Empowerment Program were removed; The Empowerment Program remains. Fitz Gateway Apartments is Housing Support; Youth Seen is Behavioral & Mental Health Services; Safehouse Denver is Domestic Violence Support; Entryway and DEDO Workforce are Employment & Workforce Development. Other overlapping entries remain separate. Each retains its original worksheet and row. Staff names from the monthly worksheet are excluded. The food quick filter includes Food and Food Resources. Source locators identify the original rows; categories may reflect subsequent owner corrections.

The mountain theme uses night-sky overnight shelter buttons/cards and sunny day-center buttons/cards. Other resource cards retain their category colors. Transgender Center of the Rockies has a muted pink-and-blue card; other LGBTQ+ Community Services cards have a bright rainbow theme.

Provider details are imported as supplied and have not been independently verified. Confirm hours, availability, eligibility, and crisis-service details before referrals. There are no client records, accounts, or analytics.

## Run locally

Serve this directory with any static web server, then open its local address. Opening index.html directly may prevent the browser from loading JSON.

## GitHub Pages

Put `index.html`, `styles.css`, `mountains.css`, `app.js`, and `data/resources.json` in the repository root, preserving the data folder. GitHub Pages deploys from the main branch, root directory.

Update resource records in `data/resources.json`. The optional local importer requires Python and openpyxl and reads the original spreadsheet; it is not required for the website.
