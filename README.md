# 📦 ParcelKu

> A fast-paced, browser-based simulation game where you run a parcel hub: sort it, load it, deliver it, and survive peak season.

Inspired by the viral "life sim" games (housewife, nurse, hospital shift), **ParcelKu** puts you in the shoes of a delivery worker. It's simple to pick up and hard to put down, and it gives you a real taste of the pressure riders and hub staff face every day.

---

## 🎮 Concept

You start as a new staff member at a small delivery hub. Parcels keep coming in. Your job:

1. **Sort** incoming parcels into the right zone or route
2. **Load** them onto your bike or van before the cut-off
3. **Deliver** them before the deadline runs out
4. **Handle chaos**: wrong addresses, customers who don't pick up, COD, rain, traffic

Too slow → the parcel is **returned (RTS)**, your rating drops, and the boss isn't happy.

---

## 🔥 Core Gameplay Loop

```
Parcels arrive → Sort fast → Load smart → Deliver on time → Earn + rating ↑
         ↑                                                        ↓
         └──────────── More volume, harder rules, peak season ────┘
```

- **Short shifts (2–3 minutes)** so it's easy to say "one more round"
- **Combos & streaks** for correct sorts in a row
- **Timers everywhere**: every parcel has an SLA countdown
- **Score, coins & rating** at the end of every shift

---

## ⚡ What Makes It Addictive

| Mechanic | Feel |
|---|---|
| ⏱️ SLA countdown per parcel | Constant pressure, adrenaline |
| 🔁 Combo multiplier | Reward for staying in the zone |
| 📈 Volume ramp-up | It starts chill, then gets crazy |
| 🎲 Random events | Every shift feels different |
| 🏆 Daily challenge & leaderboard | Reason to come back |
| 🛵 Upgrades (bigger bike, scanner, helper) | Sense of progression |

---

## 🌪️ Random Events

- 🌧️ **Heavy rain**: delivery speed drops
- 📞 **Customer not answering**: retry or return?
- 🏠 **Wrong / incomplete address**: guess it, or call the customer
- 💵 **COD parcel**: need exact change
- 🚧 **Traffic jam / roadblock**: reroute
- 🐕 **Guard dog at the gate**: you know the one
- 📦 **Damaged parcel**: handle the complaint

---

## 🚨 Peak Season Mode

The highlight. Without warning, the hub switches into **PEAK SEASON**:

- 🛒 **11.11 / 12.12 Mega Sale**
- 🌙 **Raya rush**
- 🎄 **Year-end sale**

During peak season:
- Parcel volume **3–5x**
- Shorter SLAs
- More complaints and more random events
- Screen shake, alarm sounds, a counter of pending parcels piling up 😵

Survive peak season = big bonus + special badge.

---

## 🧠 Real Experience, Gamified

The goal isn't just fun. Players should come away **understanding** what delivery workers go through:

- The pressure of hitting daily targets
- Why parcels sometimes arrive late or get returned
- How heavy peak season really is
- Small things (picking up the phone, writing a complete address) that make a rider's day much easier

---

## 🛠️ Tech Stack (Plan)

- **HTML + CSS + Vanilla JavaScript** (or a light canvas setup)
- Runs fully in the browser, no install
- Mobile-friendly (tap / drag to sort)
- `localStorage` for high scores & progress

---

## 🗺️ Roadmap

- [ ] Basic sorting mechanic (drag parcel → zone)
- [ ] SLA timer + return system
- [ ] Scoring, combos & rating
- [ ] Delivery phase (route / map mini-game)
- [ ] Random events
- [ ] Peak Season mode
- [ ] Upgrades & progression
- [ ] Sound effects & juice (shake, particles)
- [ ] Daily challenge & leaderboard

---

## 🚀 Getting Started

> Coming soon. Once the game is built, just open `index.html` in a browser.

---

## 🙏 Dedication

To every rider and hub worker who's out in the rain and sun so our parcels arrive on time. Thank you. 🛵💨
