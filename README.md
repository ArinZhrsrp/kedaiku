# KedaiKu — Mini Kedai

A pastel isometric supermarket game with nine sequential sublevels across Levels 1–3. Order goods, collect supplier boxes, fill shelves, serve customers, check out, build new furniture, and clean the shop. Progress is saved in browser localStorage under `kedaiku-save-v1`; the earlier ShopKu save remains untouched.

## Run

`index.html` is self-contained. Open it in a browser, or from this directory run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` on the **same computer** that runs the server. A cloud workspace's localhost does not map to your computer. To rebuild after editing source:

```sh
npm ci
npm run build
```

The build embeds `missions.js`, `app.js`, and the bundled Three.js scene into `index.html`.

## Play

Open a shift, order two boxes at the Order button or terminal, receive them at the rear dock after the timer, then fill the matching shelves. Customers take items and queue at the checkout. Walk to the cashier or tap its scene marker, then choose the correct total. Tap a station to walk there automatically; WASD, arrows, and touch controls also work. Drag the scene to rotate. The game falls back to a 2D map when WebGL is unavailable.

Use **Misi** to see objectives, **Stok** to check shelf, storage and incoming quantities, and **Bina** to buy the third shelf at Level 2 and refrigerator at Level 3. Storage expands when the third shelf is installed. Clean two actual spills during Level 3-2. Close the store after meeting all objectives to unlock the next sublevel. If a shift fails, retry; money, furniture, and inventory persist. Pause stops time.

## Scope and layout

The current scene uses the existing 9×8-ish world coordinates and clay assets, with entrance and cashier near the front, supplier dock at the rear, and fixed shelf positions. The two initial shelves stay in place as the third shelf and refrigerator appear. Level 4+ content is unavailable in this release. The store is not yet an exact 12×10 tile grid; customers use timed shopping and queue phases, while the player uses grid route finding. This is a known limitation of the existing scene implementation.

## Interface

The main play screen follows the KedaiKu reference: a large isometric store, compact level/coins/rating/time HUD, current mission card, and four primary actions (Order Stock, Inventory, Build, Missions). On phones the action rail moves below the store. The eight-step loop and the three level/sublevel cards are in **Cara Main** so they do not crowd the mobile play screen; online orders and delivery are shown as future locked steps.
