# North Wind Capital

A very serious unserious public site: https://north-wind-capital.github.io

Static HTML, CSS, and JavaScript. No framework, tracking, backend, or live financial data. The outlook generator is satire.

## Local preview

```sh
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000. The generated logo is `site/assets/north-wind-logo.png`.

## Publication

GitHub Actions validates the static files and deploys only `site/` to GitHub Pages on pushes to `main`. Changes to hosting are run through Actions.

For the first deployment, the manually triggered bootstrap workflow enables Pages using a temporary `PAGES_SETUP_TOKEN` repository secret with repository administration access. Remove the secret once bootstrap completes. Subsequent deployments use the built-in `GITHUB_TOKEN` only.

To roll back, revert the relevant source commit and push to `main`; the deployment workflow republishes the previous site.

## Brand

Forest green, warm ivory, and rust. A north-pointing compass mark with windswept strokes, generated with the built-in image generation tool. The original generated PNG is included without modification.

Prompt: “Create one finished logo symbol for North Wind Capital, a playful pretend financial research institution with a dry sense of humor. A striking minimalist abstract north-pointing compass arrow combined with three windswept flowing parallel strokes, subtly suggesting an N. Crisp flat deep forest green (#143e32) symbol on a solid warm ivory (#f3f0e5) square background. A sophisticated Swiss modernist financial institution mark, elegant confident geometry, thick enough to read at favicon sizes. Only a single centered symbol occupying 75 percent of canvas, no text, no letters as typography, no mockup, no gradients, no shadows, no texture, no border. Square image.”
