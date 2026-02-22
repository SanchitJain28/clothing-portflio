/* PRIMARY COLORS */
--primary-black: #1a1a1a;        /* Main text, headers */
--primary-white: #ffffff;         /* Background, clean space */
--accent-sage: #9caf88;          /* CTA buttons, links */
--accent-mauve: #c4a4a4;         /* Secondary CTAs, hover states */

/* SECONDARY COLORS */
--charcoal: #4a4a4a;             /* Secondary text, descriptions */
--light-gray: #f5f5f5;           /* Section backgrounds, cards */
--border-gray: #e0e0e0;          /* Borders, dividers */

/* ACCENT HIGHLIGHTS */
--coral: #e8927c;                /* Sale badges, urgency elements */
--navy: #2c3e50;                 /* Trust badges, footer */

/* UI STATES */
--success: #6fbf73;              /* In stock, free shipping bar */
--warning: #f4a261;              /* Low stock counter */
--error: #e76f51;                /* Out of stock */

/* TRANSPARENCY OVERLAYS */
--overlay-dark: rgba(26, 26, 26, 0.6);   /* Hero text backgrounds */
--overlay-light: rgba(255, 255, 255, 0.95); /* Popup modals */


## Instant Context

# FlexForm Athletics - Women's Activewear E-commerce Portfolio

## Brand: Premium women's activewear (leggings, sports bras, tops)
## Target: Women 25-40, fitness enthusiasts, $45-$115 price range
## Goal: Portfolio showcase of CRO-optimized Shopify store

## Product Structure:
- 26 total products (10 leggings, 8 sports bras, 8 tops)
- Each product has 3 variants (color or size)
- 4 collections: All Products, Leggings, Sports Bras, Tops
- Best Sellers collection (curated 8-10 items)

## Key Features:
- Hero video background with CTA
- Shop by Activity grid (Yoga, Running, Gym)
- CRO elements: sticky cart, upsells, urgency timers, stock counters, trust badges
- Quick-add buttons, size guides, bundle offers
- Photo reviews, Instagram UGC feed
- Exit-intent popup (10% off)
- Free shipping progress bar

## Tech Stack:
- Shopify Dawn theme 
- Apps: Rebuy (upsells), Judge.me (reviews), Klaviyo (email), Vitals (CRO)
- Liquid , CSS ,JS , GSAP for smooth animations

## Color Palette:
- Primary: Black (#1a1a1a), White (#ffffff)
- Accent: Sage (#9caf88), Mauve (#c4a4a4), Coral (#e8927c)
- UI: Charcoal (#4a4a4a), Light Gray (#f5f5f5), Navy (#2c3e50)

Design Style: Clean, minimal, modern (Lululemon/Alo aesthetic)
Typography: Inter/Montserrat

### Code generation details
1. Always make a seperate section file (.liquid) and seperate CSS file , if there is any interactivity in the section , make a seperate JS file
2. Always import CSS and JS like this in the section file (.liquid)
{{ 'CSS_FILE_NAME' | asset_url | stylesheet_tag }}
<script src="{{ 'JS_FILE_NAME' | asset_url }}" defer="defer"></script>

### Purpose: Demonstrate full-stack e-commerce + conversion optimization skills for portfolio/job applications


## Inspiration page 

1. Home
```https://www.figma.com/site/qqeFW1YsiKG5NIsM2FSDIP/Untitled?t=9BSnDavNRBsLpyUT-1``` 
2. Product 
```https://kicaactive.com/collections/jackets/products/kica-kic604-black-cropped-hoodie-in-cotton-terry-fabric``` 
3. Collection page
```https://www.clovia.com/product/medium-impact-padded-racerback-sports-bra-in-olive-green/``` 

## TODO LIST -16th Feb
1. Complete 80% of the home page , and start the product page
2. Improve the header and footer file

## Todo list - 17th Feb
1. Improve the home page , and make some sections
2. Complete the footer of the home page
3. Start the product page
4. Make some sections for the product page

# Todo list - 18th Feb 
1. Complete the half product page 
2. Start the cart drawer
3. Enchance the footer and the header
4. improve the home page

# Todo list - 19th Feb

1. Complete the full product page
2. Make all the images for the collection pages
3. add 5 more collection with each 4 products only , means more 20 products
4. Also improve the home page

# Todo list - 20th Feb
1. Start the collection page
2. Complete the cart drawer

# Todo list - 21th Feb
1. Enchance the product page more
2. Complete the collection page 
3. Complete the home page
