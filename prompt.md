```
# MASTER BUILD PROMPT — TESLA-INSPIRED ROOFTOP DRIVING GAME WEBSITE
```

# `## 1. YOUR ROLE AND MISSION` 

```
You are my autonomous senior game developer, full-stack engineer, Three.js/WebGL
specialist, UI/UX designer, performance engineer, SEO specialist, accessibility
tester, and QA lead.
```

```
Your mission is to **build a complete, functional, production-oriented rooftop
driving game website** inside the currently open repository.
```

```
The website must combine:
```

- `A genuinely playable 3D or 2.5D rooftop driving game.` 

- `A premium futuristic automotive website experience.` 

- `Responsive desktop and mobile gameplay.` 

- `A polished game menu, HUD, pause system, scoring, and restart functionality.` 

- `SEO and AI-search-friendly informational content.` 

- `AdSense-conscious advertising placements and supporting policy pages.` 

- `A deployment-ready configuration for Vercel.` 

```
Do not merely create a design concept, landing page, static dashboard,
prototype, or implementation plan.
```

```
**Inspect the existing repository, implement the complete experience, run the
application, test the actual gameplay, fix defects, and document the final
result.**
```

```
Make sensible engineering decisions independently. Do not stop after producing a
plan. Continue through implementation, verification, and documentation unless a
genuine blocker requires my input.
```

# `## 2. GAME CONCEPT` 

```
Create an original, futuristic rooftop driving game inspired by the visual
atmosphere of premium electric vehicles and cinematic urban environments.
```

```
Working title: **ROOFTOP DRIVE: ELECTRIC ESCAPE**
```

```
This is an independent, Tesla-inspired fan game concept. Do not claim that the
game is official, endorsed by Tesla, or affiliated with Tesla, Inc. Avoid
unauthorized Tesla logos, copyrighted game assets, and copied branding. Use an
original electric sports car design with a sleek silhouette, panoramic glass
roof, aerodynamic bodywork, futuristic lighting, and realistic materials.
```

# `### Core gameplay` 

```
The player drives an electric performance car across elevated rooftops,
suspended roads, and futuristic city platforms.
```

```
The objective is to travel as far as possible, avoid obstacles, collect energy
orbs, maintain speed, and beat the previous high score without falling off the
road or crashing.
```

```
The experience should feel fast, satisfying, atmospheric, and immediately
understandable.
```

```
Gameplay should include:
```

- `Continuous forward movement.` 

- `Left and right steering.` 

- `Multiple lanes or lateral movement across the rooftop.` 

- `Jumping or controlled vehicle boosts, if compatible with the selected physics model.` 

- `Rooftop gaps, barriers, traffic objects, road hazards, and other obstacles.` 

- `Collectible energy orbs.` 

- `Distance-based scoring.` 

- `Bonus points for collectibles and successful maneuvers.` 

- `Increasing difficulty over time.` 

- `Collision detection and game-over handling.` 

- `Restart and return-to-menu options.` 

- `Local high-score persistence where browser storage is available.` 

- `Optional sound effects with a mute toggle.` 

```
Choose mechanics that are enjoyable and reliable, rather than adding complex
features that cannot be implemented properly.
```

```
The game must be genuinely interactive and playable, not a prerecorded video or
an animated image pretending to be gameplay.
```

# `## 3. TECHNOLOGY STACK` 

```
Inspect the existing project before choosing or changing dependencies.
```

```
Preferred implementation:
```

- `React with TypeScript.` 

- `Vite for the frontend build.` 

- `Three.js, preferably through React Three Fiber where appropriate, for 3D rendering.` 

- `Drei for useful 3D helpers if needed.` 

- `A lightweight physics or collision system suited to the gameplay.` 

- `CSS Modules, Tailwind CSS, or the existing styling system.` 

- `Lucide icons or another lightweight, consistent icon library.` 

- `Browser localStorage for local preferences and high scores.` 

```
Use the existing framework if the repository already has a suitable, functional
setup. Avoid unnecessary rewrites.
```

# `### Technical priorities` 

`1. Reliable gameplay.` 

`2. Smooth performance.` 

`3. Responsive controls.` 

`4. Maintainable code.` 

`5. Visual quality.` 

`6. SEO and accessibility.` 

`7. Deployment reliability.` 

```
Do not add a database, authentication, paid APIs, or backend infrastructure
unless a real requirement justifies it.
```

```
The website should work without mandatory API keys, external accounts, or paid
services.
```

```
If WebGL or 3D rendering is unavailable, provide a functional fallback game
using Canvas 2D or another appropriate rendering method. The fallback must still
support real movement, collisions, scoring, and restarting.
```

# `## 4. ART DIRECTION AND VISUAL DESIGN` 

```
Create a premium, cinematic, futuristic automotive experience.
```

```
The design should feel like a polished indie game combined with a high-end
electric vehicle configurator.
```

# `### Visual identity` 

# `Use:` 

- `Deep black and graphite backgrounds.` 

- `Metallic silver and cool gray vehicle surfaces.` 

- `Electric cyan or icy blue accent lighting.` 

- `Restrained white typography.` 

- `Subtle glass effects.` 

- `Soft atmospheric fog.` 

- `Reflections and realistic lighting where performance allows.` 

- `Carefully controlled glow and bloom effects.` 

- `Clean spacing and high-quality typography.` 

```
Avoid excessive neon, excessive gradients, generic AI-generated dashboard
aesthetics, oversized rounded cards everywhere, and unnecessary visual clutter.
```

```
The interface should have a clear hierarchy and feel intentionally art-directed.
```

# `### Game environment` 

```
Build a recognizable 3D rooftop environment with:
```

- `Elevated asphalt roads.` 

- `Rooftop edges and safety barriers where appropriate.` 

- `Distant futuristic city buildings.` 

- `Atmospheric depth and skyline silhouettes.` 

- `Dynamic road markings.` 

- `Neon guide lights.` 

- `Collectible energy objects.` 

- `Obstacles with clear silhouettes.` 

- `A skybox, gradient sky, or procedural atmospheric background.` 

- `A sense of height, speed, and forward momentum.` 

```
Use procedural geometry and original materials whenever possible to reduce asset
costs and loading time.
```

```
The road must have a clearly readable driving surface, and the player must be
able to distinguish safe driving areas from hazards.
```

# `### Vehicle design` 

```
Create an original futuristic electric sports car with:
```

- `Sleek aerodynamic proportions.` 

- `Metallic body paint.` 

- `Glass windows.` 

- `Wheels and visible wheel rotation where practical.` 

- `Headlights and rear lights.` 

- `Reflective highlights.` 

- `Subtle suspension or chassis movement.` 

- `Steering animation.` 

- `Speed-sensitive visual feedback.` 

```
A low-poly or stylized-realistic model is acceptable if it looks polished. A
coherent art style is more important than unnecessarily detailed geometry.
```

```
Do not depend on remote 3D models that might disappear or fail to load. Prefer
locally available, licensed assets or procedural models.
```

# `### Camera` 

```
Use a third-person follow camera positioned behind and slightly above the car.
```

```
Implement:
```

- `Smooth camera following.` 

- `Subtle steering response.` 

- `Small camera shake on impact.` 

- `Speed-sensitive camera movement.` 

- `A clear view of upcoming obstacles.` 

- `A cinematic introductory camera transition.` 

```
Camera motion must remain comfortable and must respect reduced-motion
accessibility preferences where practical.
```

```
## 5. COMPLETE GAME FLOW
```

```
Implement the following states with working transitions.
```

# `### A. Loading screen` 

```
Display a polished loading screen with:
```

- `Game title.` 

- `A minimal animated electric-energy indicator.` 

- `Loading progress when measurable.` 

- `Clear handling for WebGL initialization failures.` 

- `A usable retry option if initialization fails.` 

```
Do not display fake progress indefinitely.
```

# `### B. Main menu` 

```
Create a premium full-screen introduction with:
```

- `Original game logo or wordmark.` 

- `A visually compelling vehicle and rooftop scene.` 

- `A prominent PLAY NOW button.` 

- `A short game description.` 

- `BEST DISTANCE or HIGH SCORE.` 

- `A sound toggle.` 

- `A control guide.` 

- `A settings entry point if settings are implemented.` 

```
The primary play action must start the actual game.
```

# `### C. Countdown` 

```
Before the game begins:
```

- `Show a short 3–2–1 countdown.` 

- `Prepare the camera and gameplay state.` 

- `Start movement only when the countdown finishes.` 

- `Ensure input handling is reliable throughout the transition.` 

# `### D. Active gameplay` 

```
The game HUD should show:
```

- `Current distance.` 

- `Current score.` 

- `Current speed or a clearly labeled speed indicator.` 

- `Collected energy.` 

- `Pause button.` 

- `Optional boost meter if boost mechanics exist.` 

```
HUD elements must remain legible against the game scene.
```

```
Keep the game view dominant. Controls and overlays should not obscure important
road areas.
```

# `### E. Pause menu` 

```
Allow the player to pause and resume.
```

```
Display:
```

- `RESUME.` 

- `RESTART.` 

- `SOUND ON/OFF.` 

- `MAIN MENU.` 

```
Pausing must actually stop gameplay simulation, obstacle movement, collision
processing, and score progression. The game should not continue secretly in the
background.
```

# `### F. Game-over screen` 

```
When the player crashes or falls off the rooftop:
```

- `Stop active gameplay.` 

- `Show a polished crash or game-over transition.` 

- `Display final score and distance.` 

- `Display energy collected.` 

- `Show the previous best score and whether a new record was achieved.` 

- `Offer PLAY AGAIN.` 

- `Offer MAIN MENU.` 

```
Restarting must reset all relevant gameplay variables, positions, timers,
obstacles, collectibles, effects, and input states.
```

```
Prevent multiple simultaneous game loops or duplicated event listeners after
restarting.
```

# `## 6. CONTROLS AND INPUT SYSTEM` 

```
Implement controls for keyboard, mouse/touch interfaces where appropriate, and
mobile devices.
```

# `### Desktop controls` 

- `A / Left Arrow: steer left.` 

- `D / Right Arrow: steer right.` 

- `W / Up Arrow: accelerate or maintain forward movement, depending on the selected mechanics.` 

- `S / Down Arrow: brake or slow down if supported. - Space: jump or activate boost, depending on the implemented mechanics. - Escape: pause or resume.` 

- `R: restart when appropriate.` 

```
Show the actual implemented controls in the interface. Never advertise a control
that does nothing.
```

# `### Mobile controls` 

```
Create large, comfortable touch controls:
```

- `Left steering button.` 

- `Right steering button.` 

- `Jump or boost button if implemented.` 

- `Pause control.` 

# `Support:` 

- `Touchstart and touchend.` 

- `Pointer events where suitable.` 

- `Multi-touch steering and boosting.` 

- `Reliable release of held inputs.` 

- `Prevention of accidental page scrolling while interacting with the game.` 

- `Safe-area insets on modern phones.` 

```
Also support swipe steering if it improves usability, but do not make swiping
the only control method.
```

```
Controls must work on portrait and landscape screens.
```

```
Provide a clear recommendation to rotate the phone if landscape mode materially
improves gameplay. Do not block portrait users from playing if a functional
```

```
portrait layout is possible.
```

# `## 7. GAME ENGINE AND MECHANICS` 

```
Implement the game as a structured simulation rather than a collection of
unrelated animation callbacks.
```

# `### Player state` 

```
Track:
```

- `Position and lateral movement.` 

- `Current speed.` 

- `Steering direction.` 

- `Jump or boost state if applicable.` 

- `Collision state.` 

- `Invulnerability or recovery state if deliberately implemented.` 

- `Collected energy.` 

- `Current score.` 

- `Distance traveled.` 

# `### Road and world` 

```
Create a continuous rooftop road using a segment-based or procedural world
system.
```

```
As the player progresses:
```

- `Generate new road segments or obstacles ahead.` 

- `Recycle or remove objects behind the camera.` 

- `Maintain stable memory usage.` 

- `Keep the horizon and road visually continuous.` 

- `Avoid gaps in procedural geometry that cause unintended falls.` 

```
If curved roads or lane changes are introduced, ensure collision boundaries
remain aligned with the visible road.
```

# `### Obstacles` 

```
Create multiple hazard types, such as:
```

- `Stationary barriers.` 

- `Traffic cones.` 

- `Rooftop maintenance objects.` 

- `Broken road sections.` 

- `Gaps that require jumping if jumping is supported.` 

```
Obstacle placement must be fair and avoid unavoidable collisions.
```

```
Use a difficulty curve based on distance, elapsed gameplay time, or another
explicit metric.
```

# `### Collectibles` 

```
Add glowing energy orbs or similar original collectibles.
```

```
On collection:
```

- `Increase the energy counter.` 

- `Award points.` 

- `Trigger a subtle visual effect.` 

- `Play a sound if enabled.` 

- `Update the HUD immediately.` 

# `### Scoring` 

```
Use a documented scoring formula that rewards distance and collectibles.
```

```
For example:
```

- `Distance contributes steadily to the score.` 

- `Each energy collectible grants a fixed bonus.` 

- `Optional successful jumps or near misses grant limited bonuses only if those mechanics work reliably.` 

```
Keep score values consistent across the HUD, pause screen, and game-over screen.
```

# `### Difficulty and fairness` 

# `Progressively adjust:` 

- `Obstacle frequency.` 

- `Obstacle variety.` 

- `Speed within reasonable limits.` 

- `Collectible placement.` 

- `Spacing between hazards.` 

```
Avoid generating impossible obstacle sequences. Establish minimum safe reaction
distances and test them at maximum intended speed.
```

# `### Collision system` 

```
Use simple, stable collision volumes or bounding boxes.
```

# `Ensure:` 

- `The visual car and collision volume align closely.` 

- `Obstacles cannot repeatedly trigger the same collision.` 

- `Collectibles are consumed only once.` 

- `Falling from the rooftop ends the game predictably.` 

- `Collision response does not lock the game in a broken state.` 

# `### Simulation reliability` 

```
Use delta-time-based movement, capped frame deltas, and a suitable fixed
timestep for gameplay physics where appropriate.
```

```
Handle tab switching and browser visibility changes. Pause or safely suspend the
simulation when the player leaves the active game.
```

```
Clean up animation loops, timers, audio contexts, pointer handlers, and keyboard
listeners when components unmount.
```

# `## 8. AUDIO AND FEEDBACK` 

```
Provide an original, optional audio layer.
```

# `Possible sounds:` 

- `Electric motor hum.` 

- `Acceleration tone.` 

- `Collectible pickup.` 

- `Jump or boost.` 

- `Collision.` 

- `Game-over cue.` 

- `UI interaction feedback.` 

```
Use original generated sounds or properly licensed local assets.
```

```
Do not require audio to understand the game.
```

```
Start muted or initialize audio only after a user gesture, in accordance with
browser autoplay restrictions.
```

# `Include:` 

- `Sound toggle.` 

- `Sensible volume.` 

- `Immediate mute response.` 

- `Graceful fallback if audio cannot initialize.` 

```
Add tasteful visual feedback for steering, collisions, collecting energy,
boosting, and achieving a new high score.
```

# `## 9. WEBSITE LAYOUT AND RESPONSIVE EXPERIENCE` 

```
The game is the main product. Avoid turning the page into a generic marketing
site that hides gameplay below excessive promotional sections.
```

# `### Suggested page structure` 

`1. Compact navigation header.` 

`2. Game hero and main menu.` 

`3. Main playable game area.` 

`4. Controls and how-to-play section.` 

`5. Game features.` 

`6. Desktop and mobile compatibility information.` 

`7. SEO-focused original informational content.` 

`8. Frequently asked questions.` 

`9. Clearly labeled advertising slots.` 

`10. About, Privacy Policy, Terms of Use, and Contact links.` 

`11. Footer with independent-project attribution and appropriate trademark disclaimer.` 

```
Use in-page navigation and clean section IDs.
```

# `### Responsive behavior` 

# `Desktop:` 

- `Large, immersive game viewport.` 

- `Well-positioned HUD.` 

- `Keyboard instructions.` 

- `Balanced content width.` 

# `Tablet:` 

- `Adapt the game viewport and controls.` 

- `Preserve readable HUD labels.` 

- `Avoid horizontal overflow.` 

# `Mobile:` 

- `Touch-first controls.` 

- `Appropriately sized buttons.` 

- `Responsive typography.` 

- `No clipped menus or dialogs.` 

- `Safe-area support.` 

- `No accidental page scrolling during active gameplay.` 

- `Lightweight rendering defaults where needed.` 

```
Test at narrow phone widths, standard tablet widths, and large desktop sizes.
```

# `## 10. GOOGLE ADSENSE READINESS` 

```
Prepare the layout for possible AdSense integration without compromising the
game.
```

```
Implement clearly labeled advertising placeholders, for example:
```

- `A reserved banner area above or below the game.` 

- `A contextual content ad slot after the instructional content.` 

- `An optional responsive footer placement.` 

```
Requirements:
```

- `Use explicit ADVERTISEMENT labels for mock ad slots.` 

- `Do not disguise ads as game controls.` 

- `Do not position ads so that users can accidentally click them while steering.` 

- `Never create fake ad impressions, artificial clicks, or automatic click behavior.` 

- `Do not display ads over the active game.` 

- `Do not interrupt gameplay with deceptive interstitials.` 

- `Keep ad containers out of the critical gameplay area.` 

- `Avoid large layout shifts when ad content loads.` 

- `Ensure ad placeholders do not make the page appear broken or filled with empty boxes.` 

```
Build ad integration as an optional, isolated component that can later accept
legitimate publisher configuration.
```

```
Do not fabricate a publisher ID or pretend advertisements are live.
```

```
Add a clearly documented configuration process for the eventual AdSense
integration.
```

# `### Policy and trust pages` 

```
Implement meaningful content for:
```

- `Privacy Policy.` 

- `Terms of Use.` 

- `About Us.` 

- `Contact.` 

```
Keep these accessible through the footer or a lightweight modal/section system.
```

```
Privacy content must reflect the actual implementation. Document any real
analytics, cookies, storage, advertising integrations, or third-party services
that are present.
```

```
Do not claim that the website collects no data unless that is accurate.
```

```
For Contact, provide a configurable contact address or an actual working contact
method. Do not invent a real email address.
```

```
These pages should be indexable where appropriate, readable, and easy to
maintain.
```

```
AdSense approval is not guaranteed. Final compliance depends on the actual
published website, content quality, implementation, account eligibility, and
Google's current requirements.
```

# `## 11. SEO IMPLEMENTATION` 

```
Implement technical SEO directly in the project.
```

# `### Metadata` 

```
Provide:
```

- `A unique, descriptive title.` 

- `A concise meta description.` 

- `Canonical URL configuration using the actual deployment domain.` 

- `Appropriate Open Graph metadata.` 

- `Social-sharing image metadata only when a real image exists.` 

- `A favicon.` 

- `Correct viewport and character encoding declarations.` 

- `A robots directive that does not accidentally block the production website.` 

```
Use a configurable site URL instead of hardcoding a guessed production domain.
```

# `### Page content` 

```
Use one clear H1 and logical H2/H3 hierarchy.
```

```
Write original, useful content around:
```

- `Rooftop driving gameplay.` 

- `How to play.` 

- `Controls.` 

- `Obstacles and collectibles.` 

- `Supported browsers.` 

- `Mobile compatibility.` 

- `Frequently asked questions.` 

```
Avoid keyword stuffing, duplicate paragraphs, unsupported feature claims, and
generic filler.
```

```
Answer common questions directly and accurately.
```

# `### Structured data` 

```
Add JSON-LD only where it matches the visible, genuine page content.
```

```
Consider:
```

- `WebSite.` 

- `VideoGame, if the implemented game genuinely fits the schema.` 

- `Organization only when the publisher identity and information are accurate.` 

- `BreadcrumbList only if there is a real breadcrumb structure.` 

```
Validate schema properties against current Schema.org definitions. Do not add
fake ratings, reviews, prices, authors, awards, or download links.
```

# `### Supporting SEO files` 

# `Create:` 

- ``public/robots.txt`.` 

- ``public/sitemap.xml`, or a suitable build-time sitemap generator.` 

- `A custom 404 page only if the routing architecture supports it.` 

- `Appropriate favicon and social preview assets.` 

```
Ensure the sitemap uses the configured production origin and includes only
canonical, indexable URLs.
```

```
For a true single-page site, avoid generating artificial duplicate routes just
to increase sitemap entries.
```

```
Keep essential explanatory content accessible to search engines without
requiring the player to start the game.
```

# `## 12. GEO AND AI SEARCH VISIBILITY` 

```
Write content that helps search engines and AI assistants accurately understand
the game.
```

```
Include a concise, factual game description near the top of the page.
```

# `Clearly explain:` 

- `What the game is.` 

- `Whether it runs in the browser.` 

- `Whether an account is required.` 

- `The actual controls.` 

- `The supported device types.` 

- `The game objective.` 

- `Whether progress is saved locally.` 

- `The actual system and browser requirements.` 

- `Whether sound is optional.` 

- `The relationship, if any, between this independent game and Tesla.` 

```
Do not claim compatibility with every device or browser without testing.
```

```
Use descriptive headings, meaningful links, accessible text, and semantically
appropriate HTML.
```

```
Do not hide important information exclusively in canvas rendering or WebGL
scenes.
```

```
Do not create fake author biographies, fake company details, fake citations,
fabricated popularity claims, or manipulative AI-search content.
```

```
Focus on being useful, specific, transparent, and accurate.
```

```
## 13. PERFORMANCE AND CORE WEB VITALS
```

```
Optimize for fast loading and smooth gameplay on average consumer devices.
```

# `### Rendering` 

- `Use a sensible initial renderer resolution.` 

- `Respect device pixel ratio while capping it on high-density screens.` 

- `Limit expensive post-processing.` 

- `Avoid excessive real-time shadows.` 

- `Reuse geometries and materials where possible.` 

- `Pool or recycle obstacles and collectibles.` 

- `Remove unused objects and dispose of resources correctly.` 

- `Reduce particle counts on mobile.` 

- `Avoid unnecessary React state updates every animation frame.` 

- `Keep gameplay simulation separate from low-frequency UI updates.` 

- `Pause or reduce rendering work when the tab is hidden.` 

# `### Loading` 

- `Lazy-load nonessential components.` 

- `Load heavy 3D assets only when required.` 

- `Keep the initial menu lightweight.` 

- `Avoid large external dependencies.` 

- `Use optimized local assets.` 

- `Avoid unnecessary third-party scripts.` 

# `### Performance targets` 

```
Use these as engineering goals rather than guaranteed results:
```

- `Good Core Web Vitals on representative devices.` 

- `Stable frame pacing.` 

- `Responsive input with minimal perceived latency.` 

- `A lightweight initial page.` 

- `No persistent memory growth after repeated restarts.` 

- `No avoidable blocking operations in the main thread.` 

```
Aim for smooth 60 FPS on capable desktop hardware and a stable, comfortable
frame rate on supported mobile devices.
```

```
If performance drops, reduce optional effects and rendering quality before
compromising gameplay responsiveness.
```

```
Respect `prefers-reduced-motion` and provide an appropriate reduced-effects
mode.
```

```
## 14. ACCESSIBILITY
```

# `Implement:` 

- `Semantic HTML.` 

- `Keyboard-accessible menus.` 

- `Visible focus states.` 

- `Clear button labels.` 

- `Sufficient text contrast.` 

- `Readable instructions.` 

- `Touch targets of comfortable size.` 

- `Accessible dialogs with correct focus behavior.` 

- `Escape-key handling where appropriate.` 

- `Reduced-motion support.` 

- `Mute and pause controls.` 

- `Non-color-only indicators for hazards and game states.` 

```
Ensure the core website content remains usable even if the game fails to load.
```

```
Do not rely on color alone to distinguish obstacles, collectibles, or active
states.
```

```
## 15. ERROR HANDLING AND FALLBACKS
```

# `Handle:` 

- `WebGL initialization failure.` 

- `Unsupported browser capabilities.` 

- `Asset-loading errors.` 

- `Audio initialization failure.` 

- `Browser tab suspension.` 

- `Missing optional configuration.` 

- `Storage being unavailable.` 

- `Repeated restarts.` 

- `Invalid or unavailable environment variables.` 

```
If localStorage fails, continue gameplay using in-memory values.
```

```
If sound fails, continue silently.
```

```
If 3D rendering fails, show a useful message and launch the functional fallback
game when possible.
```

```
Never leave users trapped on a permanent loading screen.
```

```
Avoid exposing internal errors, secrets, environment variables, or stack traces
to public users.
```

```
## 16. PROJECT STRUCTURE AND CODE QUALITY
```

```
Keep the project modular and easy to maintain.
```

```
A suggested structure is:
```

```
src/
  app/
  components/
    Header/
    Footer/
    GameCanvas/
    GameHUD/
    GameMenu/
    PauseMenu/
    GameOver/
    TouchControls/
    AdSlot/
    SEO/
  game/
```

```
    engine/
    entities/
    environment/
    systems/
    physics/
    controls/
    audio/
    scoring/
    configuration/
  hooks/
  pages/
  styles/
  utils/
public/
  assets/
  robots.txt
  sitemap.xml
```

```
docs/
  PROJECT_STATUS.md
  GAME_DESIGN.md
  ARCHITECTURE.md
  TESTING.md
  DEPLOYMENT.md
  SEO_ADSENSE.md
  CHANGELOG.md
```

```
Adjust the structure to the existing project rather than creating unnecessary
files.
```

```
Use strict TypeScript where appropriate, meaningful naming, clear interfaces,
reusable components, and centralized gameplay configuration.
```

```
Do not place the entire application in one enormous component.
```

```
Avoid fake functionality, dead buttons, TODOs for essential features, hardcoded
secrets, and unhandled console errors.
```

```
## 17. TESTING AND QUALITY ASSURANCE
```

```
You are responsible for verifying that the project works.
```

```
### Functional testing
```

```
Verify:
```

- `The application starts successfully.` 

- `The loading screen resolves.` 

- `PLAY NOW starts the actual game.` 

- `Countdown transitions correctly.` 

- `Steering works.` 

- `Touch controls work.` 

- `Jumping or boosting works if implemented.` 

- `Collectibles update score and energy.` 

- `Obstacles cause the intended collision behavior.` 

- `Difficulty progresses fairly.` 

- `Pause stops simulation.` 

- `Resume restores gameplay.` 

- `Game over displays correct results.` 

- `Restart fully resets the session.` 

- `Main menu navigation works.` 

- `Sound toggle works.` 

- `High score persists where supported.` 

- `Storage failures do not crash the game.` 

```
- Keyboard listeners do not duplicate after restarting.
```

# `### Responsive testing` 

```
Check:
```

```
- Small mobile portrait.
- Mobile landscape.
```

- `Tablet.` 

- `Standard laptop.` 

- `Large desktop.` 

```
Verify no horizontal overflow, overlapping controls, unreadable HUD elements, or
inaccessible menus.
```

# `### SEO testing` 

# `Verify:` 

- `Title and description.` 

- `Canonical URL.` 

- `Open Graph metadata.` 

- `Heading hierarchy.` 

- `Structured data validity.` 

- `Robots directives.` 

- `Sitemap URLs.` 

- `Image alt text.` 

- `Internal navigation.` 

- `Production build output.` 

# `### Accessibility testing` 

```
Check keyboard navigation, focus visibility, contrast, semantic structure, touch
target sizes, reduced-motion handling, and accessible menu transitions.
```

# `### Performance testing` 

# `Inspect:` 

- `Browser console.` 

- `Failed network requests.` 

- `Memory usage after repeated restarts.` 

- `Rendering frame rate.` 

- `Initial bundle size.` 

- `Unnecessary dependencies.` 

- `Mobile rendering quality.` 

- `Core Web Vitals where measurement tools are available.` 

```
Use the repository's existing test framework or introduce a lightweight
appropriate setup.
```

```
Run linting, type checking, unit tests, and production builds where available.
Fix actual failures rather than merely documenting them.
```

```
Do not claim that a test passed unless you ran it and observed the result.
```

# `## 18. VERCEL DEPLOYMENT` 

```
Prepare the project for deployment to Vercel.
```

# `Requirements:` 

- `Correct package scripts.` 

- `Reproducible dependency installation.` 

- `A successful production build.` 

- `Correct Vite or framework configuration.` 

- `Correct public asset paths.` 

- `SPA routing fallback only if required.` 

- `Environment variables documented when genuinely necessary.` 

- `No secrets committed to source control.` 

- `Production canonical URL configured correctly.` 

- `Correct behavior when the application is opened directly at its root URL.` 

```
Create a clear deployment guide that covers:
```

`1. Installing the supported Node.js version.` 

`2. Installing dependencies.` 

`3. Starting the local development server.` 

`4. Running tests and the production build.` 

`5. Creating or selecting the Vercel project.` 

`6. Importing the Git repository, if applicable.` 

`7. Configuring environment variables, if required.` 

`8. Deploying to a preview environment.` 

`9. Testing the deployed website.` 

`10. Promoting the verified build to production.` 

`11. Connecting a custom domain.` 

`12. Updating canonical URLs, sitemap, and robots configuration.` 

`13. Configuring AdSense only after the site is genuinely ready.` 

```
Do not claim that a deployment succeeded unless you have actually deployed it
and verified the resulting URL.
```

# `## 19. DOCUMENTATION AND PROGRESS TRACKING` 

```
Maintain project documentation throughout implementation.
```

```
Before coding:
```

- `Inspect the current repository.` 

- `Identify the framework, dependencies, and existing functionality.` 

- `Record important findings.` 

- `Create or update the project status file.` 

```
During development:
```

- `Update `docs/PROJECT_STATUS.md`.` 

- `Record completed work and remaining tasks.` 

- `Document gameplay mechanics and scoring.` 

- `Record key architecture decisions.` 

- `Record known bugs and their resolutions.` 

- `Update deployment instructions when configuration changes.` 

```
After meaningful implementation milestones, update the documentation so the
project can be continued without re-reading the entire conversation or
reconstructing every previous decision.
```

```
Do not overwrite useful existing documentation without reviewing it.
```

# `## 20. IMPLEMENTATION WORKFLOW` 

```
Execute the project in these stages.
```

```
### Stage 1 — Repository inspection
```

```
Inspect all relevant source files, package configuration, existing assets, and
deployment settings. Identify what can be reused.
```

# `### Stage 2 — Game architecture` 

```
Define the gameplay state machine, rendering architecture, player controls,
collision approach, world generation, scoring, and fallback behavior. Record the
decisions in the documentation.
```

# `### Stage 3 — Core playable game` 

```
Implement the player vehicle, rooftop road, camera, controls, obstacles,
collectibles, collisions, scoring, difficulty progression, pause, game over, and
```

# `restart.` 

```
At the end of this stage, the game must be playable.
```

```
### Stage 4 — Visual polish
```

```
Implement the cinematic environment, premium menus, HUD, lighting, animations,
audio, and transitions.
```

```
### Stage 5 — Responsive experience
```

```
Implement mobile controls, adaptive layouts, accessible menus, and performance
adjustments.
```

```
### Stage 6 — Website content
```

```
Add useful informational content, instructions, features, FAQs, policy-
supporting pages, advertising placeholders, and footer navigation.
```

```
### Stage 7 — SEO and GEO
```

```
Implement metadata, structured data, canonical URL configuration, sitemap,
robots directives, semantic content, and social metadata.
```

```
### Stage 8 — QA and optimization
```

```
Run the actual application, test gameplay, inspect responsive layouts, fix
errors, and optimize performance.
```

```
### Stage 9 — Production preparation
```

```
Verify the production build, document Vercel deployment, review the security and
configuration, and update all project documentation.
```

```
Do not consider a stage complete just because files have been created.
Completion requires functional verification.
```

# `## 21. ACCEPTANCE CRITERIA` 

```
The project is complete only when:
```

- `The website runs locally.` 

- `The production build succeeds.` 

- `The game is genuinely playable.` 

- `The car responds to input.` 

- `Obstacles and collectibles function.` 

- `Collision and game-over logic work.` 

- `Scoring and high-score behavior work.` 

- `Pause, resume, restart, and menu transitions work.` 

- `Desktop and mobile controls work on supported devices.` 

- `The interface is visually polished and responsive.` 

- `Error and fallback states are implemented.` 

- `No essential button is decorative or nonfunctional.` 

- `SEO metadata and supporting files are configured.` 

- `The content is original and accurately describes the actual game.` 

- `Ad placements are clearly separated from gameplay.` 

- `Privacy and policy content reflects the actual implementation.` 

- `No fabricated business details, reviews, endorsements, or publisher IDs are present.` 

- `The Vercel deployment configuration is valid.` 

- `Documentation reflects the real implementation.` 

- `All executed tests and remaining limitations are reported honestly.` 

# `## 22. FINAL REPORT` 

```
When the implementation and verification are finished, provide a concise but
complete report containing:
```

`1. What was built.` 

`2. The actual gameplay mechanics.` 

`3. The controls for desktop and mobile.` 

`4. The main files and architecture.` 

`5. The features that were tested.` 

`6. The commands used to run and build the project.` 

`7. Test, lint, type-check, and build results.` 

`8. Performance or compatibility limitations.` 

`9. Vercel deployment instructions.` 

`10. Remaining tasks for real AdSense integration.` 

`11. Any known issues that still require attention.` 

```
Separate verified results from recommendations or untested assumptions.
```

```
Do not state that the game is production-ready merely because the development
server starts.
```

# `## FINAL INSTRUCTION` 

```
Start by inspecting the current repository and documenting the existing state.
```

```
Then implement the complete game, verify its functionality, polish the
experience, and prepare the project for deployment.
```

```
**Build the actual game first, not just the website around it.**
```

```
Prioritize enjoyable gameplay, reliable mechanics, distinctive visual design,
mobile usability, performance, and a maintainable codebase.
```

```
Make reasonable decisions without repeatedly asking me to approve routine
implementation details. If a technical limitation arises, implement the best
functional alternative and document the trade-off.
```

```
Do not stop after planning. Continue until the acceptance criteria have been
tested or a genuine blocker prevents further progress.
```

