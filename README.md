# FoodieHub — Nigerian Food Ordering App

FoodieHub is a responsive food-ordering experience for discovering Nigerian favourites and building a delivery cart. The menu showcases dishes such as jollof rice, egusi soup, suya, puff puff, Chapman, and zobo, with category browsing, search, naira pricing, and a cart that persists in the browser.

This repository includes a lightweight HTML/CSS/JavaScript storefront and a separate Express/MongoDB API. The current storefront uses menu data defined in `app.js` and browser `localStorage`; its demo checkout displays a confirmation in the browser. The API provides persistent menu and order endpoints, but the storefront is not yet wired to submit orders to that API.

## Features

- Browse Nigerian dishes grouped into Rice, Soup, Grills, Snacks, and Drinks.
- Search the menu by dish name, category, or description.
- Add items to the cart, adjust quantities, and see subtotal plus a fixed ₦500 delivery fee.
- Keep the cart between browser visits with `localStorage`.
- Use a responsive, mobile-oriented layout with a cart drawer and order confirmation demo.
- Run an optional Express API backed by MongoDB for menu and order data.

## Screenshots

Screenshot files are not currently included in this repository. Add genuine captures of the menu and cart under `docs/screenshots/` and embed them here once available; no placeholder imagery is used as a substitute for application screenshots.

## Tech stack

- **Storefront:** HTML, CSS, vanilla JavaScript
- **API:** Node.js, Express 5
- **Database:** MongoDB with Mongoose

## Run the storefront

The frontend is static and has no root-level package setup. Open `index.html` in a browser, or serve the repository root with a local static server. For example:

```bash
npx serve .
```

Then open the local URL printed by the server. Menu data, categories, and prices are currently defined in `app.js`.

## Run the API (optional)

Requirements: Node.js 18 or newer and a MongoDB instance.

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/foodiehub
PORT=5000
```

Start the API:

```bash
npm start
```

The API health check is available at `http://localhost:5000/` when the server is running and connected to MongoDB.

## API overview

The API is mounted at `/api`:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/menu` | List available menu items; optionally filter with `?category=Rice` |
| `GET` | `/api/menu/:id` | Get a menu item |
| `POST` | `/api/menu` | Create a menu item |
| `PUT` | `/api/menu/:id` | Update a menu item |
| `DELETE` | `/api/menu/:id` | Delete a menu item |
| `POST` | `/api/orders` | Create an order from customer details and items |
| `GET` | `/api/orders` | List orders |
| `GET` | `/api/orders/:id` | Get an order |
| `PATCH` | `/api/orders/:id/status` | Update an order status |

Order creation expects `customerName`, `customerPhone`, `deliveryAddress`, and a non-empty `items` array. The backend calculates the subtotal and adds a ₦500 delivery fee.

> **Demo note:** The API currently has no authentication or authorization. Do not expose its order-management routes publicly with real customer data until access controls are added.

## Project structure

```text
.
├── index.html              # Storefront markup
├── style.css               # Storefront styling
├── app.js                  # Menu data, search, cart, and demo checkout
└── backend/
    ├── server.js           # Express app and MongoDB connection
    ├── models/             # Menu item and order schemas
    └── routes/             # Menu and order endpoints
```

## Current limitations

- The storefront menu is currently hard-coded in `app.js`; it does not fetch menu items from the API.
- The storefront checkout is a client-side demo and does not create an API order.
- The cart is stored per browser and is not synced between devices.
- The order API needs authentication and authorization before production use.

## License

The backend package declares the ISC license. Refer to the repository files for applicable licensing details.
