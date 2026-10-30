# Illustrated Third-Person Cruise Implementation Plan

**Goal:** Deliver an original illustrated 3D cruise with a visible period-appropriate protagonist, seven NPCs with consequential conversation choices, and material-specific footsteps plus optional original ambient music.

**Architecture:** Keep the story engine pure and migrate existing version-1 saves additively. A story module defines NPC choices, prerequisites, temporary assistance and enduring relationships. Navigation classifies the visible floor material. Audio synthesis uses distance actually travelled. The third-person camera clips against world geometry; an articulated original actor walks with movement.

**Tech Stack:** Existing pinned Three.js, Web Audio, procedural illustration textures and meshes, static GitHub Pages, Node tests.

## Work
1. Add three NPCs and conversation rules. Verify alternate medical access, temporary bridge access, cooperative power, a maintenance-evidence alternative and remote informed consent. Choices bind per topic per loop. Knowledge and relationships persist; physical help resets. Existing core endings remain reachable.
2. Add distance-driven wood, carpet, metal and tile footsteps; generate distinct non-clipping waveforms and original ambient notes. Start audio only after a gesture. Stop movement sounds when stationary, reading, paused or hidden. Add volume/mute and sample controls.
3. Add a third-person follow camera with obstacle checks, an animated passenger in a long coat and boots, and matching original crew models.
4. Change scenery to a muted paper-and-ink illustrated palette, toon lighting, original wall portraits and distinct floor textures that agree with audio classification.
5. Validate rules, old saves, routes, sound signals, camera movement and actual browser scenes. Package, update the existing public repository and verify Pages before delivery.

## Branch consequences
- Qin Wu: honesty grants a medical pass; bluffing grants bridge entry but requires evidence to gain the signal operator's trust.
- Su He: trust grants access to patient records; later validated rescue evidence permits remote consent.
- Ji Chuan: a complete risk broadcast gains remote power assistance; a partial broadcast or silence changes his response and the epilogue.
- Captain: cooperation grants access and help; invoking old authority grants access without cooperation.
- Louis: once freed, he can provide a maintenance paper trail as an alternative to the timed camera evidence, or leave for evacuation and stop assisting with power.
- Eileen and the doctor: attitudes affect trust and later nursing cooperation.
