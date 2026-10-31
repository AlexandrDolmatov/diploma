# Real screenshot checklist

Use a valid public Last.fm key and an accessible API. Capture actual results at the same desktop viewport (for example, 1440 × 900):

1. `docs/screenshots/home.png`: loaded artist and track charts.
2. `docs/screenshots/search.png`: a real search query with both result groups visible.
3. `docs/screenshots/artist.png`: a loaded artist page with name and top tracks; optionally capture biography/similar artists separately.
4. Optional `track.png`: an opened track details modal with returned metadata.

Record the capture date and query/artist, because API data changes. Do not expose the API key in a URL bar, devtools or screenshots. Do not replace unavailable results with mocked API responses or designed mockups. Add README image links only after actual image files exist.

During the cloud review, the proxy rejected `ws.audioscrobbler.com` with HTTP 403. These successful API screenshots could not be produced here.
