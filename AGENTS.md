# AGENTS.md

Wedding website for https://vavrovi.wedding.

## Stack

- Astro v6
- React
- Modern CSS with layers and nesting
- Deployed on Cloudflare

## Guidelines

- Keep changes minimal and consistent with existing design.
- Prefer Astro components and content collections before adding React.
- Use layered CSS files in `src/styles` and keep styles readable.
- Follow class naming conventions: `l-` for layout, `c-` for components, `p-` for pages, `is-` for states.
- Use Source Sans 3 for body text and Source Serif 4 for headings.
- Optimize for performance and accessibility.
- Do not add new dependencies unless required.
- Run `npm run format` after code changes.
- Run `npm run check` when type checking is needed.

## Testing Frontend

- Test following paths:
  - `/`
  - `/+/pacakovi`
  - `/misto`
