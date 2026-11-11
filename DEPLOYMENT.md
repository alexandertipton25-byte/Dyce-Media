# Dyce Media preview

Repository: https://github.com/alexandertipton25-byte/Dyce-Media
Existing Netlify project: dycemedia (ee0e5d3d-5e95-4cc2-bef3-09b1ad684a88)
URL: https://dycemedia.netlify.app
Production branch: main. Publish directory: . No build step required.
Reuse this project. Do not modify Pocket Media or attach dycemedia.com.

## November 2026 revision

- Procedural, volumetric log cabin and original green mascot in src/scenes.js.
- Three.js WebGL renderer, lit materials and shadows. SVG projection of the same mesh geometry is used if WebGL is unavailable; this fallback has simpler shading and depth sorting.
- Cabin horizontal drag and 360-degree button, reduced-motion support, offscreen rendering suspension, and hideable mascot.
- Bundled Three.js 0.180.0, built with esbuild 0.25.12. THREE-LICENSE.txt accompanies the bundle. Rebuild: install these packages, then `esbuild src/scenes.js --bundle --minify --format=esm --outfile=assets/scenes.js`.
- SVG interface icons; seven photo-led sprint projects with original destinations; Nashville News and Nick Beres brand tabs; source-based Nashville News team and copy; photography and contact film-slate image.
- CONTENT_SOURCES.json records image sources. Site copy and project destinations were checked against the current original site.

## Verification and remaining operational settings

Local links and assets checked. Brand tabs, phone-width layouts and software-rendered 3D checked in browser. The review browser has WebGL disabled, so hardware lighting/shadows require a GPU-enabled browser to visually verify.
Netlify Forms processing enabled. No test enquiries sent; email notifications are not configured by HTML alone.
Existing Netlify SSO site protection was left unchanged. The noindex header discourages search indexing and is not an access control.
