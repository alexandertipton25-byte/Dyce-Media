# Dyce Media preview

Repository: https://github.com/alexandertipton25-byte/Dyce-Media
Existing Netlify project: dycemedia (ee0e5d3d-5e95-4cc2-bef3-09b1ad684a88)
URL: https://dycemedia.netlify.app
Production branch: main. Publish directory: . No build step required.
Reuse this project. Do not modify Pocket Media or attach dycemedia.com.

## November 2026 revision

- Procedural, volumetric log cabin and original rust-furred yeti-like mascot in src/scenes.js.
- Three.js WebGL renderer, lit materials and shadows. A depth-buffered software 3D renderer projects the same animated meshes if WebGL is unavailable, with interpolated lighting and per-pixel depth.
- Volumetric animated flame with a warm point light; slow automatic cabin rotation, pause control, horizontal drag and 360-degree button, reduced-motion support, offscreen rendering suspension, and hideable mascot.
- Bundled Three.js 0.180.0, built with esbuild 0.25.12. THREE-LICENSE.txt accompanies the bundle. Rebuild: install these packages, then `esbuild src/scenes.js --bundle --minify --format=esm --outfile=assets/scenes.js`.
- SVG interface icons; seven photo-led sprint projects with original destinations; Nashville News and Nick Beres brand tabs; source-based Nashville News team and copy; photography and contact film-slate image.
- CONTENT_SOURCES.json records image sources. Site copy and project destinations were checked against the current original site.

## Verification and remaining operational settings

Local links and assets checked. Brand tabs, phone-width layouts and software-rendered 3D checked in browser. The review browser has WebGL disabled, so hardware lighting/shadows require a GPU-enabled browser to visually verify.
Netlify Forms processing enabled. No test enquiries sent; email notifications are not configured by HTML alone.
Existing Netlify SSO site protection was left unchanged. The noindex header discourages search indexing and is not an access control.

## Final batch

Contextual treadmill and director-chair mascot scenes. Twelve visually checked official gallery images in phone frames, seven business descriptions, owner and Nashville social links, full Nashville portraits, collaborator portraits, and verified YouTube titles/thumbnails. Mobile preview at 375px: no horizontal overflow or broken images on Services, Sprints, or News. Phone frames, captions and descriptions checked visually. See CHANGE_LIST.md and CONTENT_SOURCES.json.

November 11 correction: mascot geometry in src/mascot.js uses smooth-unioned sculpted volumes and surface-rooted fur. Gallery now contains six images without captions or phone frames; the three user-selected images lead. Services header uses three original transparent phone mockups. Sprint card titles use DM Sans. Previous phone-gallery design is superseded.

Latest revision: terracotta sasquatch sculpt follows user-supplied November 11 reference; previous cream/rust plush design superseded. Cabin now has a porch, shingled roof and masonry chimney. photography.html contains all 38 official Services gallery photographs; gallery.js provides an accessible native-dialog enlarged viewer.
