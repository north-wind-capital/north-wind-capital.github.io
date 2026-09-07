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

## Scroll experience

The coastal opening zooms and recedes with scroll. The statement changes emphasis word by word; the desktop approach section pins three successive principles; directors reveal on entry; the outlook background wipes across; the footer wordmark rises into view. Native scrolling is retained. A passive scroll listener schedules a single animation frame rather than running a continuous animation loop.

The header's motion control disables the sequences and restores normal document flow. Reduced-motion preferences start in that mode, and pages without JavaScript show all content. On phones the principles remain stacked instead of pinned. Functional text remains at least 16px.

The additional original image, `site/assets/north-wind-coast.png`, was generated with the built-in image generation tool. Prompt: “Create a cinematic ultra wide landscape photograph to fill the masthead of an extremely premium financial research website named North Wind Capital. No text or branding in the image. Drone aerial view along a monumental remote New Zealand coastal cliff with dark forest green land on the RIGHT THIRD of frame and powerful deep emerald ocean covering the LEFT TWO THIRDS. Long graceful white sea foam streaks trace currents around the cliffs, wind-driven ocean, misty distant headlands receding into the top right. Refined natural dark teal and muted jade palette, overcast silver light, rich photographic detail, atmospheric depth, understated dramatic luxury editorial photography, not fantasy. Composition leaves dark quiet ocean in the left half for a large cream headline overlaid by the website. Horizon near top, view downward, no buildings no people no boats no symbols no typography. Landscape 16:9.”
