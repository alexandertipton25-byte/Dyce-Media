# Supplied models — November 13, 2026

The hero loads the original floating-island GLB unchanged. Drag, touch, arrow keys and the 360-degree button rotate the camera. WebGL-unavailable browsers display a still render of that same file.

Content Sprint uses treadmill-render.png and Documentary uses director-render.png, rendered directly from the supplied GLBs with their original mesh, embedded textures, materials and proportions. No model generation, geometry simplification or texture optimization was performed. The previous procedural mascot and cabin are no longer used.

Original SHA-256 checksums:
- Island: 5a20a8420797f3aa56630ce1d91a82a3b2eb25fc06ecd9d9a22f90995e3acc27
- Treadmill: b88a0428c54ec75768748df1bcd3b3e16771f6a47e0053faf7e7f12b80baa99b
- Director: d7a38309affa869a25dc8caeebb7ca896415ec8574363ed3c6cb343491b32c41

Static renders: Blender 4.3.2, original glTF import, transparent 900×900 PNG, neutral white studio lighting, Standard color transform, no denoising. Camera framing changes only; model data unchanged.

Verification: original island checksum matched; browser parsed its textured mesh; desktop and 390px-wide layouts inspected; both static renders loaded. Cloud browser WebGL is disabled, so actual GPU rotation and physical iPhone Safari performance remain unverified. No optimization changes were made.
