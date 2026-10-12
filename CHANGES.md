# What changed in this polish pass

## Bugs fixed
- Home: benefit text was lime/bold (CSS rule matched a wrapper I'd added earlier) and one closing tag was wrong.
- Trainers: faces were cropped out of every portrait; the "approach" list text was squeezed into a 45px column;
  content width did not line up with the navbar.
- Lime-on-lime invisible labels ("START TODAY", "FIRST SESSION") now dark.
- Classes: the schedule hid Time and Book on phones behind a hidden sideways scroll; now restacked. Hover no longer shifts layout.
- Narrow phones (320px): hero (home/programs), featured program and membership headings/prices overflowed.
- Contact/Membership/Trainers/Free Trial text sizes were in rem and still under 12px.
- No-JS fallback for the mobile menu (noscript styles were being overridden).
- Class "Level" labels now match their badges; Ryan Cole -> Ryan Brooks to match the Trainers page.

## Consistency
- One footer (links to every page) and one navbar on all 7 pages; real active-page state; sticky header with anchor offset.
- One gutter variable shared by navbar, sections and containers; one eyebrow style; shared form styles (were duplicated).
- Brand identity unchanged: black, neon lime, Inter, sharp borders.

## Functionality
- Programs goal cards, schedule "Book" buttons and membership plan buttons now lead somewhere meaningful and
  pre-fill the trial / contact form (goal, class + time, plan).
- Forms: accessible validation (labelled errors, aria-invalid/describedby, focus first error), honest preview mode,
  real submission path via data-endpoint. Mobile menu: Esc, outside click, focus return. Filter announces results.

## Content / trust
- "BEST VALUE" on Quarterly was false (Annual is cheaper per month) -> "BALANCED"; "MOST POPULAR" (unsupported) -> "RECOMMENDED".
- Membership buttons said "Choose Annual" but opened a free-trial form -> "Ask About Annual" opening a pre-filled enquiry.
- Removed unsupported claims ("plenty of parking", "heart of the city"); schedule copy no longer promises reservations.
- Dead footer social links removed (owner to add real URLs). Favicon, theme-color and basic social meta added.
