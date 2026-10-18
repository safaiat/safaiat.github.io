# Md Safaiat Hossain — academic website

Open **index.html** directly in your browser. The site has seven separate pages:

- `index.html` — overview and professional portrait
- `about.html` — biography and research interests
- `research.html` — current research and earlier projects
- `publications.html` — searchable scholarly records and category filters
- `experience.html` — appointments, education, and technical focus
- `cv.html` — borderless CV preview with a download control; replace `assets/Safaiat_cv.pdf` to update
- `contact.html` — professional contact destinations

All pages work through `file://` using an embedded content snapshot. No installation, build, development server, or internet connection is required for that offline view. When hosted on GitHub Pages, the site automatically reads `data/publications.csv` and `data/images.csv`, so you can update records and image paths without editing HTML or running a build. External scholarly links require internet access. Every page embeds its own CSS and JavaScript, using system fonts and local imagery.

## Design and photograph

The site uses white backgrounds, near-black typography, quiet gray secondary text, restrained blue links, and spacious layouts. Your supplied photograph is copied to `assets/profile.png` and appears on Home and About. Desktop and mobile crops use the original photo without editing its content. No dark mode is used in this white-focused design.

## Content updates

The visual system now has one authoring source, `site.css`, with a shared neutral hover rule for boxed controls. The builder embeds it into each standalone HTML page to preserve direct-file use. Home and About templates remain in `home-template.cjs` and `redesign.cjs`; earlier projects are stored once in `data/projects.json` and rendered as static HTML rather than shipping duplicate publication datasets to the browser. Experience and Contact no longer include the unused CSV content runtime.

Start with [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for step-by-step CSV editing and image upload instructions. Upload images to `assets`, reference them in the appropriate CSV, and commit both to GitHub. The hosted site loads the new values after GitHub Pages publishes. The CSVs are the editable source of truth for publication records and configured images. If you choose to run `node redesign.cjs`, it also refreshes the offline snapshot from those CSVs.

Edit the relevant HTML file directly. Publication data is embedded in `publications.html`; project data is embedded in `research.html`. The four research cards cover SPECT, CT, high-performance computing, and image priors / Plug-and-Play. Their descriptions deliberately remain at the level of research goals and broad themes; unpublished implementation details are omitted.

The SPECT card uses an image rendered directly from the Siemens Lu-177 NEMA vendor reconstruction in the original public Zenodo dataset. It links to that dataset, with full CC BY 4.0 attribution in the credits file; it does not imply use of PyTomography by the researcher. CT uses a locally generated modified Shepp–Logan phantom and analytic sinogram. The GPU graphic assigns four different image regions to four GPU workers. The prior illustration combines blurred and reference views with a magnified region; it is not an algorithm result. See `assets/IMAGE-CREDITS.md` for provenance and official institutional logo sources.

The local homepage copy about imaging's role in disease evaluation and treatment assessment is grounded in the [NIH NIBIB nuclear medicine overview](https://www.nibib.nih.gov/science-education/science-topics/nuclear-medicine). It does not claim that this research has already delivered clinical outcomes or universal early cancer detection.

Optional asset-generation source is in `generate-research-images.py` (NumPy and Pillow); these tools are not required to view the website. The phantom and parallel-beam projection presentation follows the standard concepts illustrated in the [scikit-image Radon transform example](https://scikit-image.org/docs/0.23.x/auto_examples/transform/plot_radon_transform.html). Images are calculated locally rather than copied from that documentation. `research-figures.cjs` supplies captions when rebuilding with `node redesign.cjs`.

The contact page includes the supplied ORNL email, hossainm2@ornl.gov, and the public university email from the existing portfolio, mhossa47@tennessee.edu. A CV PDF has not been supplied, so no broken download is displayed; the legacy cv.html address leads to Experience and Education.

Biographical and publication metadata follow the supplied brief. The official UT profile and 2026 arXiv record were independently readable during initial construction. DOI and Scholar records were inaccessible through the browsing service; those supplied links still need independent external validation.

## Verification

`verify.cjs` and `verify-content.cjs` are optional developer checks, runnable with Node when already installed. They are not needed to open or update the hosted website. They check script execution using a minimal DOM harness, internal links and resources, metadata, search/filter behavior, CSV parsing and validation, hosted content updates, and offline/error fallbacks. They do not simulate browser layout. Automated visual verification at 375, 768, and 1440 pixels remains outstanding because the in-app browser blocks file URLs.

To publish later, upload the six HTML files and `assets` folder together to a static host. This source is prepared for the safaiat/safaiat.github.io GitHub Pages repository.

The CV page uses locally bundled PDF.js (Apache-2.0; license in `assets/pdfjs/LICENSE`) to render the current PDF on the hosted site without browser viewer chrome. Bundled page images support direct-file viewing.
