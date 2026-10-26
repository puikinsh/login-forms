# Design research: twenty additional authentication studies

Research reviewed on 2026-10-25. The goal is distinct composition and identity,
with the same tested authentication behavior and offline packaging.

## References reviewed

- [Studio B by ena supply, Framer](https://www.framer.com/marketplace/templates/studio-b/)
  and its [live preview](https://studio-b.framer.website/): modular panels, spare
  navigation, contrast between typography and large visual surfaces.
- [Wynn by Bryn Taylor, Framer](https://www.framer.com/marketplace/templates/noa/):
  oversized typographic identity and deliberate spacing.
- [ARCFORM by Clariv Studio, Framer](https://www.framer.com/marketplace/templates/arcform/):
  architectural clarity and measured grid-based composition.
- [DatumArc by Ajoy, Framer](https://www.framer.com/marketplace/templates/datumarc/):
  drawing-sheet numbering and architectural presentation as a coherent system.
- [Geometric Monochrome Authentication Flow by Jordan Philips, Dribbble](https://dribbble.com/shots/26437583-Minimal-Login-UI-Geometric-Monochrome-Authentication-Flow):
  a memorable geometric brand surface alongside focused authentication controls.
- [SaaSFrame login](https://www.saasframe.io/auth/login): plain labeled fields and
  direct account/recovery navigation. Search-index content was available; the
  direct page returned 403, so it was not used as a visual reference.

These are references for general visual principles, not templates included in
this repository. No third-party code, photos, logos, or artwork were copied.
All decorative scenes here are original CSS and inline SVG. Typography uses
system sans, serif, and monospace stacks to keep every package offline capable.

## Composition map

| Template | Main composition | Distinctive visual element |
| --- | --- | --- |
| Folio Editorial | Magazine cover and thin ruled form | Ink rail, serif masthead, rotated issue stamp |
| Swiss Grid | Red poster with open account column | Numbered grid rules and compressed typography |
| Architecture Blueprint | Technical drawing sheet | Cobalt graph paper and building section |
| Ceramic Studio | Object still life | Three sculpted vessels and rounded fields |
| Film Darkroom | Contact sheet and dark access panel | Perforated film, three original abstract exposures |
| Botanical Index | Specimen catalogue | Botanical line drawing and inventory typography |
| Audio Console | Recording desk | Meters, faders, and inset studio control panel |
| Museum Ticket | Perforated admission ticket | Exhibition print and dashed ticket seam |
| Atelier Fashion | Fashion invitation | Folded garment silhouette and plum paper |
| Cobalt Orbit | Circular identity and floating panel | Three intersecting orbital rings |
| Terrace Travel | Landscape and passport frame | Stepped hills, sun, arch, and coordinate caption |
| Terminal Cloud | Developer workbench | Static terminal transcript and deployment status |
| Paper Notes | Ruled desk and writing pad | Layered note, hand-drawn loop, yellow paper form |
| Racing Paddock | Timing board | Giant racing number, italic type, checkered band |
| Bauhaus Workshop | Primary geometric tiles | Quarter circle, stripes, triangle, and disc |
| Mono Journal | Newspaper spread | Masthead, edition typography, double rules |
| Gallery Frame | Exhibition wall | Framed color study and work caption |
| Terra Maps | Expedition journal | Contour rings, dashed route, and waypoint |
| Citrus Market | Neighborhood shop and receipt | Checkered cloth, citrus cross-section, torn-rule edges |
| Kinetic Type | Expressive type specimen | Oversized rotated letterforms and a red margin |

## Behavior and responsive decisions

Every design has sign-in, sign-up, reset-request, and new-password screens using
`FormUtils.LoginFormBase`. The shared DOM contract, password-manager hints,
keyboard behavior, errors in normal flow, explicit demo text, and reduced motion
remain consistent. The mobile layout retains a compact brand/color/type band;
large decorative art is hidden to put usable fields before decorative content.
All 160 screens participate in behavior, geometry, accessibility, and visual
checks. The gallery's original twenty designs remain available with the new
Design Studies category in every selector, favorite list, and comparison.
