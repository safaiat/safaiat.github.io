# Research image credits

## Siemens Lu-177 NEMA phantom: rendered from the dataset

`siemens-lu177-nema.png` is rendered directly from the vendor reconstruction file `SPECT/Lu177-NEMA-SymT2/scanner_recon.dcm` in the original public dataset. It is not copied or cropped from the tutorial screenshot.

- Dataset: Polson, Lucas (2025). *PyTomography SPECT Tutorial data*. Zenodo. https://doi.org/10.5281/zenodo.15314460
- Dataset license: Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/
- Changes: selected axial frame 61 and an in-plane region, normalized the display by 96, applied a sequential display palette with a 0–27 window, interpolated for display, and placed it on a dark background. No reconstruction algorithm was run and no new experimental result is claimed.
- Preparation scripts: `extract-dataset-example.py` and `render-vendor-phantom.py`. Only the vendor phantom image is exported; DICOM metadata is not embedded in the PNG.
- This externally sourced Siemens reconstruction does not imply that Md Safaiat Hossain uses PyTomography.

The unused older `pytomography-spect-example.png` remains an MIT-licensed documentation image, copyright Luke Polson. Its original notice remains in `PyTomography-LICENSE.txt`.

## Institutional logos

- `utk-logo.svg`: official University of Tennessee, Knoxville web logo, from https://www.utk.edu/wp-content/themes/utkwds/assets/images/utk-logo-horizontal.svg
- `ornl-official-color.png`: original green ORNL logo downloaded unchanged from ORNL's own media library: https://www.ornl.gov/wp-content/uploads/2026/07/ORNL-logo.png . This is the logo currently displayed, with no recoloring, artificial background, or AI generation.
- `utorii-logo.png`: original UT–Oak Ridge Innovation Institute logo downloaded unchanged from its official website: https://utorii.com/wp-content/uploads/2022/11/long_logo_mobile.png .
- The older `ornl-logo.svg` and white `ornl-official.png` are unused alternatives; the homepage references only the original green PNG above.
- Logos identify the stated doctoral affiliation and research collaboration. All respective trademark rights remain with the institutions.
- Public material reviewed did not establish permission for a personal portfolio. Confirm the intended use with ORNL Communications before publishing these local logo changes. The OLCF's facility-specific guidance is https://www.olcf.ornl.gov/about-olcf/media-assets/ ; it is not treated as blanket authorization for the corporate ORNL mark.

## Original illustrative figures

`research-phantom-projection.png`: modified Shepp–Logan CT test phantom and analytic parallel-beam sinogram.

`research-gpu-regions.png`: four distinct regions of a synthetic image assigned to four GPU workers. Conceptual illustration, not a description of the researcher's implementation.

`research-priors-detail.png`: artificially blurred phantom, reference phantom, and a magnified region. No reconstruction algorithm, trained model output, or measured improvement is represented.

These three images are generated locally with `generate-research-images.py` using standard mathematical phantom geometry. They contain no patient data or unpublished experimental results.
