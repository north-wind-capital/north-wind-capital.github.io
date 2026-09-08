# North Wind Capital

A very serious unserious public site: https://northwindcapital.co.nz

Static HTML, CSS, and JavaScript. No framework, tracking, backend, or live financial data. The outlook generator is satire.

## Local preview

```sh
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000. The generated logo is `site/assets/north-wind-logo.png`.

## Publication

GitHub Actions validates the static files and deploys only `site/` to GitHub Pages on pushes to `main`. Site deployments and hosting infrastructure changes run through GitHub Actions. The hosting workflow reconciles versioned configuration through the GitHub and Cloudflare APIs.

For the first deployment, the manually triggered bootstrap workflow enables Pages using a temporary `PAGES_SETUP_TOKEN` repository secret with repository administration access. Remove the secret once bootstrap completes. Subsequent deployments use the built-in `GITHUB_TOKEN` only.

To roll back, revert the relevant source commit and push to `main`; the deployment workflow republishes the previous site.

## Domain and repository

Repository: https://github.com/north-wind-capital/northwindcapital

GitHub Pages uses `northwindcapital.co.nz` as its custom domain. Cloudflare DNS has four DNS-only apex A records (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a DNS-only `www` CNAME pointing to `north-wind-capital.github.io`. GitHub redirects `www` to the apex and provides the HTTPS certificate. Existing email records are independent of the website records.

Cloudflare credentials and the zone ID are in Doppler project `northwindcapital`, config `admin`. Never commit credentials. This Actions-based Pages deployment uses the repository's custom-domain setting; it does not require a CNAME file.

`infra/hosting.json` adopts the five existing website DNS record IDs and declares the Pages domain and HTTPS setting. The manually dispatched `Reconcile hosting infrastructure` workflow plans first, then applies only when its `apply` input is true. The reconciler refuses local applies and never deletes records. Missing adopted records fail for review; email records are outside its scope.

Before dispatch, provision temporary repository secrets `PAGES_SETUP_TOKEN` (GitHub repository administration access) and `HOSTING_CLOUDFLARE_API_TOKEN` from the existing authorized credentials. Remove both after the run, including failed runs. Credentials are never committed. Future runs require reprovisioning these secrets; the ordinary site deployment needs neither.

For configuration rollback, revert `infra/hosting.json` and dispatch the hosting workflow with apply enabled. If GitHub reports that the certificate does not exist after DNS has propagated, dispatch with `refresh_certificate=true` to rebind the domain and retry HTTPS for up to five minutes. This briefly interrupts custom-domain routing.

Moving away from the domain or removing adopted records requires an explicit versioned migration workflow; do not delete email records. The repository rename and DNS creation were initially performed locally, then the existing DNS records and Pages settings were adopted into this Actions-managed configuration.

## Brand

Forest green, warm ivory, and rust. A north-pointing compass mark with windswept strokes, generated with the built-in image generation tool. The original generated PNG is included without modification.

Prompt: “Create one finished logo symbol for North Wind Capital, a playful pretend financial research institution with a dry sense of humor. A striking minimalist abstract north-pointing compass arrow combined with three windswept flowing parallel strokes, subtly suggesting an N. Crisp flat deep forest green (#143e32) symbol on a solid warm ivory (#f3f0e5) square background. A sophisticated Swiss modernist financial institution mark, elegant confident geometry, thick enough to read at favicon sizes. Only a single centered symbol occupying 75 percent of canvas, no text, no letters as typography, no mockup, no gradients, no shadows, no texture, no border. Square image.”

## Scroll experience

The coastal opening zooms and recedes with scroll. The statement changes emphasis word by word; the desktop approach section pins three successive principles; directors reveal on entry; the outlook background wipes across; the footer wordmark rises into view. Native scrolling is retained. A passive scroll listener schedules a single scene update. The compass uses additional animation frames only while settling.

The header's motion control disables the sequences and restores normal document flow. Reduced-motion preferences start in that mode, and pages without JavaScript show all content. On phones the principles remain stacked instead of pinned. Functional text remains at least 16px.

The additional original image, `site/assets/north-wind-coast.png`, was generated with the built-in image generation tool. Prompt: “Create a cinematic ultra wide landscape photograph to fill the masthead of an extremely premium financial research website named North Wind Capital. No text or branding in the image. Drone aerial view along a monumental remote New Zealand coastal cliff with dark forest green land on the RIGHT THIRD of frame and powerful deep emerald ocean covering the LEFT TWO THIRDS. Long graceful white sea foam streaks trace currents around the cliffs, wind-driven ocean, misty distant headlands receding into the top right. Refined natural dark teal and muted jade palette, overcast silver light, rich photographic detail, atmospheric depth, understated dramatic luxury editorial photography, not fantasy. Composition leaves dark quiet ocean in the left half for a large cream headline overlaid by the website. Horizon near top, view downward, no buildings no people no boats no symbols no typography. Landscape 16:9.”

A small, low-contrast SVG compass follows a continuous path in the outside margin and rotates only its needle slowly with scroll distance; the marked dial and outer housing keep a fixed orientation. Frame-rate-independent easing lets it settle gently after scrolling stops; its animation loop then stops. There are no collision-driven position changes or CSS transform transitions. Phones reserve a narrow right gutter. The guide cannot intercept pointer input, is decorative to assistive technology, and parks when motion is disabled.


The approach chapter controls navigate the pinned sequence directly (or scroll to a principle in the stacked layout). Navigation tracks the active section. Wind paths and director dividers draw into view. Generated outlooks animate on replacement and can be shared using a URL that restores the selected text and confidence. Clipboard denial exposes an ordinary link instead; invalid URL values are ignored or normalised. No personal information is stored or sent.

## Products

The Products section lists North Wind projects, starting with [TenderScout](https://tenderscout.northwindcapital.co.nz/), a daily email of New Zealand government tenders. Each product is an article in `site/index.html`; the Products navigation link participates in the existing active-section tracking.
