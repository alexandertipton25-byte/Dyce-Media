# Dyce Media development preview

Source: Dyce_Media_Revision_2_Netlify_Preview.zip. The original 15 files are preserved for the initial preview deployment.

Dedicated repository: https://github.com/alexandertipton25-byte/Dyce-Media

## Initial Netlify import

Import this existing GitHub repository as a NEW Netlify project. Use main as the production branch, leave the build command empty, and use . as the publish directory (also specified in netlify.toml). Suggested project name: dyce-media-preview.

Do not attach dycemedia.com or modify Pocket Media. Reuse this repository and the same preview project for subsequent changes. Netlify's local state directory is ignored by Git.

## Verification after deployment

- Open all seven primary pages and thanks.html.
- Check mobile navigation, overflow, cabin artwork, mascot, and reduced motion.
- Test the three YouTube modal embeds and their YouTube links.
- Verify externally hosted photography.
- Enable Netlify Forms detection and confirm dyce-contact registration before testing submissions. Email notifications to James@Dycemedia.com are not configured by the HTML alone; delivery must be configured and verified separately.

## Remaining work from Revision 2

- Add Documentary to the primary navigation consistently.
- Replace sprint project text tiles with verified original project imagery and destinations.
- Audit copy and media against the current original Dyce Media website.
- Verify accurate video titles and thumbnail-to-video mapping.
- Cabin rotation is a flat-image CSS prototype; genuine 360-degree rotation needs a 3D model.

The preview sends a noindex response header. This discourages search indexing but does not make a publicly accessible preview private.
