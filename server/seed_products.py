from database import SessionLocal
import models

db = SessionLocal()

products = [
    {"name": "Bride & Groom Split Cake", "price": 5500, "category": "Wedding", "image": "/static/products/W1.jpeg", "description": "Ivory bridal lace meets black tuxedo on this stunning 3 tier wedding centrepiece with peach rose crown.", "stock_status": "In Stock", "sold": 14},
    {"name": "Red Rose Wedding Cake", "price": 4800, "category": "Wedding", "image": "/static/products/W2.jpeg", "description": "White fondant with cascading crimson roses and a red ombre watercolour base.", "stock_status": "Low Stock", "sold": 9},
    {"name": "Pearl & Gold Wedding Cake", "price": 6200, "category": "Wedding", "image": "/static/products/W3.jpeg", "description": "Buttercream with white pearls, real gold leaf, fresh red roses and a personalised gold heart topper.", "stock_status": "In Stock", "sold": 6},
    {"name": "Classic Crimson Wedding Cake", "price": 5000, "category": "Wedding", "image": "/static/products/W4.jpeg", "description": "White fondant with swag piping, quilted base, crimson ribbons and a couple figurine topper.", "stock_status": "Out of Stock", "sold": 11},

    {"name": "Mom To Be Cake", "price": 2800, "category": "Baby Shower", "image": "/static/products/K1.jpeg", "description": "White fondant with pink & blue baby shoes, hearts and colourful Mom To Be lettering.", "stock_status": "In Stock", "sold": 18},
    {"name": "Coming Soon Bottle Cake", "price": 3200, "category": "Baby Shower", "image": "/static/products/K2.jpeg", "description": "Light blue fondant sculpted as a baby feeding bottle with pastel Coming Soon lettering.", "stock_status": "In Stock", "sold": 15},
    {"name": "He or She Reveal Cake", "price": 3500, "category": "Baby Shower", "image": "/static/products/K3.jpeg", "description": "Blue & pink split cake with matching crown toppers, drip finish and a He or She plaque.", "stock_status": "Low Stock", "sold": 21},
    {"name": "Boy or Girl Polka Dot Cake", "price": 2600, "category": "Baby Shower", "image": "/static/products/K4.jpeg", "description": "White fondant with pink & blue polka dots, fondant baby shoes and sleeping baby topper.", "stock_status": "In Stock", "sold": 13},

    {"name": "Lavender Graduation Cake", "price": 2400, "category": "Graduation", "image": "/static/products/G1.jpeg", "description": "Lavender buttercream with white pearls, fondant mortarboard, diploma and gold Congratulations topper.", "stock_status": "In Stock", "sold": 10},
    {"name": "Stacked Books Graduation Cake", "price": 4500, "category": "Graduation", "image": "/static/products/G2.jpeg", "description": "3-tier sculpted academic book-stack with gold lettering, mortarboard and diploma scroll.", "stock_status": "In Stock", "sold": 7},
    {"name": "Class of 2025 Heart Cake", "price": 3200, "category": "Graduation", "image": "/static/products/G3.jpeg", "description": "Heart shaped ivory buttercream with Class of 2025, black ribbons and vintage shell piping.", "stock_status": "Out of Stock", "sold": 16},
    {"name": "Black & Gold Grad Cake", "price": 2800, "category": "Graduation", "image": "/static/products/G4.jpeg", "description": "Matte black with gold leaf band, mortarboard, diploma and Congratulations 2025 topper.", "stock_status": "In Stock", "sold": 12},

    {"name": "Dark Chocolate Fudge Cake", "price": 2200, "category": "Chocolate", "image": "/static/products/C1.jpeg", "description": "Dark chocolate sponge under a flawless glossy ganache coat with rosette crown and sprinkles.", "stock_status": "In Stock", "sold": 31},
    {"name": "Chocolate Overload Drip Cake", "price": 2800, "category": "Chocolate", "image": "/static/products/C2.jpeg", "description": "Chocolate drip with cream swirls, truffle balls, wafer pieces and chocolate shavings piled high.", "stock_status": "Low Stock", "sold": 27},
    {"name": "Strawberry Choco Drip Cake", "price": 2600, "category": "Chocolate", "image": "/static/products/C3.jpeg", "description": "Ivory buttercream with milk chocolate drip, fresh strawberries, chocolate bar shards and pearls.", "stock_status": "In Stock", "sold": 22},
    {"name": "Mocha Ombre Drip Cake", "price": 2400, "category": "Chocolate", "image": "/static/products/C4.jpeg", "description": "Chocolate ombre buttercream from dark to light, with ganache drip and mocha rosettes on top.", "stock_status": "In Stock", "sold": 19},

    {"name": "Gold Stars Birthday Cake", "price": 4200, "category": "Birthday", "image": "/static/products/B1.jpeg", "description": "2-tier cake with chocolate drip, gold sphere balls, gold star decorations and a glittering topper.", "stock_status": "In Stock", "sold": 24},
    {"name": "Truffle Overload Birthday Cake", "price": 3800, "category": "Birthday", "image": "/static/products/B2.jpeg", "description": "Loaded with Oreos, chocolate truffles, gold candles, cream swirls and a rich chocolate drip.", "stock_status": "In Stock", "sold": 20},
    {"name": "Purple Rosette Birthday Cake", "price": 2600, "category": "Birthday", "image": "/static/products/B3.jpeg", "description": "Full rosette ombre in lavender and cream with Happy Birthday script and warm gold candles.", "stock_status": "Low Stock", "sold": 17},
    {"name": "Mercedes Theme Birthday Cake", "price": 3500, "category": "Birthday", "image": "/static/products/B4.jpeg", "description": "Matte black fondant with Mercedes star emblem, chrome spheres and model car topper.", "stock_status": "In Stock", "sold": 8},
]

for p in products:
    db.add(models.Product(**p))

db.commit()
print(f"Seeded {len(products)} products.")
db.close()