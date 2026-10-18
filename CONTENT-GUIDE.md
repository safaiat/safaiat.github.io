# Update publications and images

You can update the hosted website without editing HTML, JavaScript, or running a build.

## Add or edit a publication

1. Open `data/publications.csv` in Excel, a text editor, or GitHub's editor.
2. Add one row for each publication. Keep the header row unchanged.
3. Save as **CSV UTF-8**, then upload or commit it to the same path in your GitHub repository.
4. Wait for GitHub Pages to finish publishing, then refresh the Publications page.

Columns:

| Column | What to enter |
| --- | --- |
| id | Unique lowercase identifier, such as `imaging-2027`. Use letters, digits, and hyphens; begin with a letter. Keep existing IDs stable. |
| year | Four-digit publication year. Records sort newest first. |
| title | Exact publication title. |
| authors | Complete author list. Your name is highlighted automatically. |
| venue | Conference, book, journal, or preprint venue. |
| type | Display label, such as `Conference paper`, `Preprint`, or `Published book chapter`. |
| category | `conference`, `chapter` (book chapters and preprints), or `poster`. |
| url | Full `https://` DOI, publisher, or preprint URL. |
| pdf_url | Optional direct PDF URL or local PDF path such as `assets/paper.pdf`. Leave empty when no PDF is available; the PDF button stays hidden. |
| description | Optional short description. |
| image | Optional local image path, such as `assets/new-paper.png`. Leave empty for text-only entries. |
| image_alt | A short description of the image. |

Upload each new image to `assets` in the repository. The CSV points to the image file; it does not contain or upload the image itself. File paths and capitalization must match exactly.

The initial CSV contains your existing nine scholarly outputs, with no invented examples or publications.

Each record appears as a card with a **Publication website** button. A separate **PDF** button appears only when `pdf_url` is populated. The medical imaging preprint includes its official arXiv PDF link; other records await verified full-text links or PDFs you upload.

## Change a photo or research figure

Upload the image into `assets`, then update the matching row in `data/images.csv`:

| key | Image location on the website |
| --- | --- |
| profile | Home and About photograph |
| spect | Top-left research figure |
| ct | Top-right research figure |
| hpc | Bottom-left research figure |
| priors | Bottom-right research figure |

Edit `src` to the new relative path, such as `assets/my-spect.png`, and update `alt`. For research figures, edit `title` and `caption` as needed. Use `credit_text`, `credit_url`, and `license_url` to preserve attribution when required.

**Important:** the current SPECT row uses `crop=spect-panel` to show only one panel of the original tutorial comparison. When replacing it with your own single image, change `crop` to `none`. All other figures use `none`.

Leave a publication's optional image columns blank to hide its image. Keep the five image-setting rows; omit a row only if you want that location to retain its embedded fallback.

## CSV editing rules

- Excel handles commas and quotes when saving as CSV UTF-8. In a text editor, surround a value containing commas or line breaks with double quotes; represent a quote inside the value as two double quotes.
- Keep the exact column names and the same number of columns in every row.
- Keep IDs unique and categories spelled exactly as above.
- Images use local `assets/...` paths. Publication and credit destinations use full HTTP or HTTPS URLs.
- The site treats CSV values as text, not HTML. Invalid data keeps the embedded fallback and logs the error in the browser console.

## Hosted versus offline use

On **GitHub Pages**, each page reads the CSV files automatically. Commit the CSV and new image files, and the website updates after publishing. No Node.js, Python, or build is needed for this workflow.

When double-clicking **index.html** (`file://`), browsers block automatic CSV loading. The pages still work using an embedded snapshot. CSV-only changes appear automatically on the hosted site, but do not update that offline snapshot. A maintainer can refresh the snapshot with `node redesign.cjs`; this is optional and is not needed for the hosted workflow.

CSV files and uploaded images are public on GitHub Pages. Add only material intended for public display.
