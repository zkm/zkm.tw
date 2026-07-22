# Content data schema (`public/data/{profile,resume}.json`)

These are the two files editors touch to change site copy — see the `ProfileData` /
`ResumeData` interfaces in `src/hooks/useProfileData.ts` / `useResumeData.ts` for the
authoritative TypeScript shape. This doc is the "what's actually in them + who reads
them" map, since the two hooks, `Portfolio.tsx`/`Resume.tsx`, and the chat worker each
read an overlapping-but-different subset.

## `profile.json` → `useProfileData` → `Portfolio.tsx`

```
profile: { name, title, tagline, about?, image, location?, email?, phone? }
socialLinks: [{ platform, url, icon, display, rel? }]   # icon must match a key
                                                          # handled in Portfolio.tsx's
                                                          # icon map (src/components/icons/*.svg)
resume: { enabled, pdfUrl?, dataUrl?, lastUpdated? }     # dataUrl isn't in ProfileData's
                                                          # TS interface but is present in
                                                          # the JSON — Resume.tsx fetches
                                                          # resume.json directly instead
contact: { cta, message }
```

`email`/`phone` are normally absent here — the real values live obfuscated inline in
`Portfolio.tsx`/`Resume.tsx` (base64 → reversed-string scheme, see CLAUDE.md). If
`profile.email` is present in the JSON it wins over the obfuscated fallback
(`profile.email || decodeObfuscatedEmail(...)` in `Portfolio.tsx`).

`socialLinks[].icon` is a string key, not a URL — adding a new platform means adding
both the JSON entry and a matching SVG under `src/components/icons/` plus a case in
`Portfolio.tsx`'s icon lookup, or it silently renders nothing.

## `resume.json` → `useResumeData` → `Resume.tsx` (lazy-loaded)

```
personalInfo: { name, title, phone, email?, website, portfolio }
experienceStartYear: number        # used to compute "N years experience" at render time
                                    # against summary's "{experienceYears}" placeholder
summary: string                    # contains a literal "{experienceYears}" token,
                                    # interpolated client-side — don't hardcode a number here
technicalSkills: {
  languages: { [category: string]: string[] }   # nested one level deeper than the rest
  frontend?, backend?, infrastructure?, security?: string[]
  frameworks, cms, cloud, tools, testing, methodologies: string[]
}
workExperience: [{
  company, companyUrl?,
  # single-position entry (most companies):
  position?, period?, responsibilities?: string[],
  # OR multiple titles at the same company (e.g. promotions), newest first —
  # takes precedence over the single-position fields above when present:
  positions?: [{ position, period, responsibilities: string[] }],
  notableProjects?: [{ name, period?, description, technologies: string[] }]
}]
education: [{ institution, degree, field, period, description }]
activitiesAndVolunteer: [...]      # present in JSON, exact shape not enumerated in
                                    # ResumeData — check Resume.tsx before assuming fields
```

`technicalSkills.languages` is a map of category → array (e.g. `"JavaScript": ["ES2024",
"TypeScript", ...]`), while every sibling key under `technicalSkills` is a flat array.
This asymmetry is intentional (languages needs sub-grouping in the UI) but is easy to
get wrong when adding a new top-level skills category — flat array, not a nested map,
unless you also update the rendering code.

## Also consumed by `workers/chat/src/index.ts`

The Worker fetches both files fresh from `https://zkm.tw/data/*.json` (production,
regardless of environment — see [chat-worker.md](chat-worker.md)) to build its system
prompt. It only reads: `profile.profile.{name,about,location}` and
`resume.{summary,technicalSkills,workExperience,education}`. Renaming/removing any of
those specific fields changes what the AI chat widget knows about you, with up to 1h of
cache staleness after a prod deploy (`SYSTEM_PROMPT_TTL_SECONDS`).

`workExperience`'s grouped `positions` shape is handled explicitly in
`workers/chat/src/index.ts` (flattened into one prompt line per position) — it has its
own copy of the type, kept in sync manually with `useResumeData.ts` since the worker is
a separate project (no shared types package).
