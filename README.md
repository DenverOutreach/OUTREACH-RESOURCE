# Denver Resource Directory

A mobile-friendly resource directory for Denver-area homeless outreach and case management. Built with plain HTML, CSS, and JavaScript for GitHub Pages.

## First version

- Search resource names, services, eligibility, and notes.
- Filter by service category, with six quick buttons for overnight shelter, day shelter, substance use treatment, mental health, food, and medical care.
- Open phone, website, and map links when the source provides usable details.
- Expand intake, eligibility, and source notes.

## Data

`data/resources.json` contains 209 source entries from OUTREACH RESOURCE GUIDE - CURRENT.ods: 201 from Resource Guide and 8 from OCC Monthly Resource Connection. Entries remain separate, including overlapping providers. Each retains its original worksheet and row. Staff names from the monthly worksheet are excluded. Category names are preserved as supplied. Quick filters include related source categories: food includes Food and Food Resources; mental health includes its youth category; medical care includes Medical and Respite.

The muted mountain theme uses six distinct quick-button colors and tinted resource cards. Transgender Center of the Rockies has a pink-and-blue card; other LGBTQ+ Community Services cards have a muted rainbow theme.

Provider details are imported as supplied and have not been independently verified. Confirm hours, availability, eligibility, and crisis-service details before referrals. There are no client records, accounts, or analytics.

## Run locally

Serve this directory with any static web server, then open its local address. Opening index.html directly may prevent the browser from loading JSON.

## GitHub Pages

Put `index.html`, `styles.css`, `mountains.css`, `app.js`, and `data/resources.json` in the repository root, preserving the data folder. GitHub Pages deploys from the main branch, root directory.

Update resource records in `data/resources.json`. The optional local importer requires Python and openpyxl and reads the original spreadsheet; it is not required for the website.
