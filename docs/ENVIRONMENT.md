# chipy-zodiac environment setup
The current session cannot inspect or change your separately created Claude environment. This file is a setup recipe, not proof that the environment is configured.

## Setup
Load environment-setup.sh into the environment's Setup script setting, then start a session using chipy-zodiac.
The standalone script does not assume a repository checkout exists. It installs the exact Playwright version and browser to /opt/chipy-zodiac-tools.
After extracting the package in the project, run bash scripts/setup.sh, npm run preflight and npm run doctor.
Setup failures are printed explicitly. The standalone environment script exits zero after an incomplete installation so a session can still start for diagnosis; a zero script exit alone does NOT mean tools are ready.
The repository setup script is strict and reports failures. Its doctor must pass before claiming browser readiness.

## Network and connected services
For development installation:
- registry.npmjs.org — npm package and tarball downloads.
- cdn.playwright.dev — primary Chromium downloads for the pinned Playwright version.
- Any browser-download redirect hostname actually reported by the installer (commonly storage.googleapis.com). Add only the exact required host if restricted access blocks it.
- Ubuntu package mirrors required by the environment image if OS browser libraries are missing.
Keep the environment's trusted package-registry defaults. No unrestricted network policy is required by this project.
For refreshing sources:
- Figma connector access to file mRGsMU76MmiKMnzQkwYKgG; www.figma.com for exports.
- Atlassian connector access to gtmarketing.atlassian.net and the cited Jira tasks.
- Google Drive/Sheets access to the SEO content spreadsheet linked in BFC-56617 if full lower copy is needed.
The package already includes Jira descriptions and local asset bytes; lack of live access does not prevent reading them.
A domain allowlist alone does not authenticate an account. Do not paste credentials in the repo or chat. Enable the relevant connector using the platform's account settings.
No required project API keys or secrets are specified for this offline mockup.
No font network requests should be needed in the final self-contained output. Export/embed licensed fonts if available, or document a temporary fallback.

## Browser troubleshooting
The preparation session installed Playwright but its browser download returned truncated/invalid ZIP data. No ready browser or successful visual test was established here.
If your environment has a similar failure, preserve the exact error. Check the reported CDN and redirect hosts, then retry the supported browser install. Do not disable TLS verification.
For missing Linux libraries, use npx playwright install --with-deps chromium in an environment that permits OS package installation.
Do not blindly rerun a failing download or claim a successful screenshot check without launching the browser.
Source and fixture work can continue while browser setup is blocked. Mark visual verification blocked until npm run doctor passes.
The initial-render smoke script exits with code 2 when the output HTML does not exist; that is expected before the build.

## Official references checked for this kit
- https://code.claude.com/docs/en/cloud-environments
- https://playwright.dev/docs/intro
- https://playwright.dev/docs/browsers
Node/Python may already be installed in the selected environment; run the checks instead of assuming availability.

