# Research image credits

## PyTomography SPECT example

`pytomography-spect-example.png` is reproduced unchanged from the official PyTomography documentation:

- Tutorial: https://pytomography.readthedocs.io/en/latest/notebooks/t_dicomdata.html#reconstruct-the-object
- Image: https://pytomography.readthedocs.io/en/latest/_images/notebooks_t_dicomdata_47_0.png
- Copyright (c) 2023 Luke Polson, MIT license. Full license: `PyTomography-LICENSE.txt`.
- The source is a Lu-177 NEMA phantom SPECT reconstruction example, comparing PyTomography with Siemens software. This is an external tutorial figure, not a result of Md Safaiat Hossain's research.

## Original illustrative figures

`research-phantom-projection.png`: modified Shepp–Logan CT test phantom and analytic parallel-beam sinogram.

`research-gpu-regions.png`: four distinct regions of a synthetic image assigned to four GPU workers. Conceptual illustration, not a description of the researcher's implementation.

`research-priors-detail.png`: artificially blurred phantom, reference phantom, and a magnified region. No reconstruction algorithm, trained model output, or measured improvement is represented.

These three images are generated locally with `generate-research-images.py` using standard mathematical phantom geometry. They contain no patient data or unpublished experimental results.
