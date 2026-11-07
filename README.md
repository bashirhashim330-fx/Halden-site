# Halden watches (front-end demo store)

Theme: Champagne #F8E7C9 and Emerald Ink #064E3B (variables at the top of css/style.css).

Cinematic watch site plus a complete front-end shopping journey. Plain HTML, CSS and JavaScript. No build step, no libraries, no backend.

## Run it
- Double-click `index.html`, or serve the folder (`python3 -m http.server`, `npx serve`).
- Upload the whole folder to GitHub Pages, Netlify or any static host.

## Folder structure
```
index.html          home (cinematic page) and the container for shop views
css/style.css       cinematic page styles
css/shop.css        shop styles (collection, product, bag, checkout, orders, dialogs)
js/data.js          single source of truth: products, shipping options, countries
js/store.js         cart, wishlist, recently viewed, demo orders, checkout draft (localStorage)
js/main.js          cinematic timeline, carousel, inspect zoom, packaging animation
js/ui.js            router, glass sidebar, views, bag drawer and fly-to-bag, checkout, packing scene, dialogs, toasts
assets/img/         product photos (webp; "-m" files are lighter copies for phones)
```

## Pages (hash routes)
`#/` home, `#/collection`, `#/watch/azure`, `#/wishlist`, `#/checkout`, `#/orders`, `#/order/REF`, `#/story`, `#/care`, `#/faq`, `#/contact`, `#/policies`.

## The shopping journey
Collection (search, filters, sort) -> Product details -> Bag -> Checkout (details, shipping) -> Review -> Place demo order -> packaging animation -> confirmation -> order history.
After the order is validated and saved, a packing scene plays with the real box photos: one open box per watch (with that watch inside) slides in, the lid comes down, a champagne band wraps the box and an emerald seal goes on the seam, then the confirmation appears. Several watches in one order show several boxes (up to 8; more are counted with a "+N" chip). It can be skipped, always finishes within a few seconds, and only plays after the order is saved. If saving fails, the bag is kept and an error is shown.

## Where to change things
- Products, prices, images, specs: `js/data.js` (used everywhere).
- Sample shipping options and countries: `js/data.js`.
- Alignment numbers for the animation (`anim` in each product): `js/data.js`.
- Info pages (story, care, FAQ, policies, contact): `js/ui.js`. Every sample text is marked "to configure" or "sample".

## Limits of this front end (needs a backend or a service for a real store)
- Real payments (a payment provider).
- Real orders, stock levels, order numbers and order emails (server and database).
- Accounts and sign-in, so orders follow a customer across devices.
- Real shipping rates, tracking and couriers.
- A real newsletter and a real contact form (email service).
- Tax rules, receipts and invoices, legal policies, warranty terms.
Demo orders live only in this browser (localStorage). Clearing browser data removes them.

## Notes
- Fonts (Anton, Manrope) load from Google Fonts; without internet the site uses system fonts.
- Slow phones: the site lightens itself when the frame rate is low. Add `?lite` to the address to force it.

## Product photos and inspect sequences
- Gallery photos (side view and case back for all five watches) are in `assets/img/gallery/` and listed in `js/data.js` (`gallery`). Add more by adding a file and one line there. Files ending in `-m.webp` are lighter copies for phones.
- Inspect only opens when someone taps the Inspect button (scrolling the page or tapping the watch does not open it). The player does not play by itself: scrolling (wheel, swipe, arrow keys, or dragging the bar) moves through the 72 frames, and the label changes as you go. Close with the Close button or Esc. The player sits on top of the whole page (it is moved out of the scrolling section when the page loads), so it always fills the screen, even on a phone.
- Label wording uses plain watchmaking terms (sunburst dial, case profile, caseback, mechanical movement, exploded view, reassembly). Only describe what the frames really show.
- Decorative labels over the dock (`#labs`, `.co`) have `pointer-events:none`, so they can never swallow taps on the dock. Switching watches can be interrupted safely (see `flight` in `go()` in `js/main.js`).
- Watches on the home page change only when someone taps a watch in the dock or an arrow (or uses the arrow keys). There is no swipe or timer switching.
- Stage labels are written per watch in `HAL.inspectLabelsBy` in `js/data.js` (`from` and `to` are positions 0 to 1 along the frames; keep them following each other with no gaps). `HAL.inspectLabels` is the fallback for a watch with no own list.
- To replace a video: put the new frames in the same folder as `f_001.webp, f_002.webp ...`, set `inspect.count` to the number of frames, and check that the labels still match the new frames. Frames are loaded only when someone taps Inspect.

## Adding a watch (what Ivory, H-05, needed)
Files per watch (id in lowercase, e.g. `ivory`): `assets/img/watch-ID.webp` (1000x1250, transparent), `box-ID.webp` (1000x1250, transparent, open box with the watch), `dial-ID.webp` (1672x941), `gallery/ID-side.webp`, `gallery/ID-back.webp` (1000x1250), a `-m.webp` phone copy of each (640x800, dial 1100x618), and `assets/inspect/ID/f_001.webp ...` (the frames).
Then: add the product in `js/data.js` (with `anim` numbers), add its labels to `HAL.inspectLabelsBy`, and add its box size to `BXO` near the top of the packing code in `js/ui.js`.
`anim` numbers: `pv` and `r` are the dial centre and case radius in the watch photo (measured on a 1122x1402 frame); `mc` and `mr` are the same in the dial close-up (1672x941); `bp` and `br` are the same in the box photo (1122x1402 frame). The home tiles use a wide fifth tile (see `.bento` in `css/shop.css`).
