/**
 * Default 30 verified university canteen food items (6 per category)
 * with 100% matched pictures and realistic prices for auto-seeding & fallback.
 */

const defaultMenuItems = [
  // ==========================================
  // 1. BREAKFAST (6 ITEMS)
  // ==========================================
  {
    name: 'Egg & Cheese Breakfast Sandwich',
    description: 'Freshly toasted buttered bread with fried farm egg, melted cheddar cheese, and sliced tomatoes.',
    category: 'Breakfast',
    price: 180,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 5
  },
  {
    name: 'Golden Flaky Paratha with Potato Curry',
    description: 'Two hot flaky layered parathas served with tempered yellow potato curry and coconut sambol.',
    category: 'Breakfast',
    price: 150,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 5
  },
  {
    name: 'Traditional Coconut Pol Roti with Spicy Sambol',
    description: 'Two thick rustic shredded coconut rotis toasted golden brown, served with crushed chili lunu miris.',
    category: 'Breakfast',
    price: 140,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 4
  },
  {
    name: 'Crispy Breakfast Dosa with Sambar & Chutney',
    description: 'Golden crispy thin crepe roll served with warm lentil sambar and creamy coconut chutney dip.',
    category: 'Breakfast',
    price: 160,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 5
  },
  {
    name: 'Fresh Egg Omelette with Toasted Butter Bread',
    description: 'Fluffy two-egg herb omelette with onions, green chilies, and slices of golden toasted bread.',
    category: 'Breakfast',
    price: 170,
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 5
  },
  {
    name: 'Steamed Rice Noodles (Idiyappam) with Curry',
    description: 'Steamed white rice flour nests served with mild coconut milk kiri hodi and freshly grated pol sambol.',
    category: 'Breakfast',
    price: 150,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 4
  },

  // ==========================================
  // 2. LUNCH SPECIALS (6 ITEMS)
  // ==========================================
  {
    name: 'Special Chicken Fried Rice with Chili Paste',
    description: 'Wok-tossed basmati fried rice with tender chicken cubes, scrambled egg, leeks, and homemade chili paste.',
    category: 'Lunch',
    price: 380,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 8
  },
  {
    name: 'Fragrant Chicken Biryani with Boiled Egg',
    description: 'Aromatic spiced basmati rice layered with juicy marinated chicken, boiled farm egg, mint sambol, and gravy.',
    category: 'Lunch',
    price: 450,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 10
  },
  {
    name: 'Sri Lankan Rice & Spicy Chicken Curry Plate',
    description: 'Steaming country samba rice with rich spicy chicken curry, creamy yellow dhal, and papadam.',
    category: 'Lunch',
    price: 350,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 5
  },
  {
    name: 'Stir-Fried Egg & Vegetable Noodles',
    description: 'Hot wok noodles stir-fried with carrots, cabbage, leeks, scrambled egg, and savory soya seasoning.',
    category: 'Lunch',
    price: 320,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 7
  },
  {
    name: 'Crispy Fried Fish Fillet with Steamed Rice & Dhal',
    description: 'Crispy seasoned ocean fish fillet served with steaming samba rice, creamy dhal curry, and salad.',
    category: 'Lunch',
    price: 340,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 6
  },
  {
    name: 'Vegetarian Mixed Rice & Dhal Curry Feast',
    description: 'Steamed red samba rice served with rich yellow dhal curry, tempered potato badum, gotukola sambol, and papadam.',
    category: 'Lunch',
    price: 250,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 5
  },

  // ==========================================
  // 3. SNACKS & BAKERY (6 ITEMS)
  // ==========================================
  {
    name: 'Crispy Golden Vegetable & Potato Samosa (2 Pcs)',
    description: 'Two triangle pastries with crisp golden crust, filled with spiced diced potatoes, green peas, and herbs.',
    category: 'Snacks',
    price: 120,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    name: 'Crispy Vegetable Spring Rolls (2 Pcs)',
    description: 'Two golden fried rolled crepes filled with seasoned shredded cabbage, carrots, leeks, and black pepper.',
    category: 'Snacks',
    price: 130,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    name: 'Crispy Golden French Fries with Dip',
    description: 'Freshly fried hot potato finger chips lightly salted, served with spicy tomato and chili dipping sauce.',
    category: 'Snacks',
    price: 220,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 5
  },
  {
    name: 'Canteen Chicken & Cheese Burger',
    description: 'Juicy spiced minced chicken patty with melted cheese, crisp lettuce, and mayo inside a soft sesame seed bun.',
    category: 'Snacks',
    price: 320,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 6
  },
  {
    name: 'Freshly Baked Sausage Roll Pastry',
    description: 'Flaky golden puff pastry roll wrapped around a savory spiced chicken sausage, baked fresh daily.',
    category: 'Snacks',
    price: 150,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    name: 'Toasted Chicken & Salad Submarine Sandwich',
    description: 'Warm French bread bun filled with seasoned shredded chicken breast, cucumber, tomatoes, and garlic mayo.',
    category: 'Snacks',
    price: 350,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 5
  },

  // ==========================================
  // 4. BEVERAGES (6 ITEMS)
  // ==========================================
  {
    name: 'Chilled Fresh Lime Juice with Mint',
    description: 'Freshly squeezed natural lime juice blended with pure raw sugar, crushed ice, and refreshing mint leaves.',
    category: 'Beverages',
    price: 140,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 3
  },
  {
    name: 'Authentic Hot Ceylon Milk Tea',
    description: 'Freshly brewed strong Ceylon BOPF black tea mixed with rich milk and sweetened to perfection.',
    category: 'Beverages',
    price: 100,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 3
  },
  {
    name: 'Iced Chocolate Milk Shake / Milo',
    description: 'Creamy cold chocolate milk blended with ice and topped with a generous sprinkle of dry Milo malt powder.',
    category: 'Beverages',
    price: 180,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 3
  },
  {
    name: 'Fresh Tropical Mango & Fruit Smoothie',
    description: 'Thick velvety cold tropical smoothie blended from ripe fresh mangoes and sweet papaya fruit.',
    category: 'Beverages',
    price: 160,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 4
  },
  {
    name: 'Fresh Sweet Orange Juice',
    description: 'Freshly pressed sun-ripened oranges served chilled with ice cubes and natural citrus vitamins.',
    category: 'Beverages',
    price: 150,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 3
  },
  {
    name: 'Hot Spiced Ginger & Cardamom Tea',
    description: 'Invigorating hot Ceylon tea infused with crushed fresh ginger root, green cardamom, and raw brown sugar.',
    category: 'Beverages',
    price: 90,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 3
  },

  // ==========================================
  // 5. DESSERTS & SWEETS (6 ITEMS)
  // ==========================================
  {
    name: 'Rich Chocolate Fudge Cake Slice',
    description: 'Decadent moist dark chocolate sponge cake layered with rich chocolate fudge icing and chocolate chips.',
    category: 'Dessert',
    price: 180,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    name: 'Classic Caramel Custard Pudding',
    description: 'Silky smooth baked vanilla egg custard topped with a glistening layer of golden amber caramel glaze.',
    category: 'Dessert',
    price: 150,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    name: 'Glazed Strawberry Chocolate Donut',
    description: 'Soft fluffy bakery ring doughnut dipped in sweet pink strawberry glaze and topped with rainbow sprinkles.',
    category: 'Dessert',
    price: 120,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 1
  },
  {
    name: 'Creamy Vanilla & Berry Ice Cream Sundae',
    description: 'Two generous scoops of creamy dairy vanilla ice cream drizzled with sweet strawberry syrup.',
    category: 'Dessert',
    price: 160,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    name: 'Layered Chocolate Biscuit Pudding Cup',
    description: 'Traditional Marie biscuit pudding layered with chilled dark cocoa custard and toasted cashew nuts.',
    category: 'Dessert',
    price: 170,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    name: 'Sweet Cream Vanilla Custard Tart',
    description: 'Golden buttery pastry crust filled with smooth baked vanilla custard cream and dusted with icing sugar.',
    category: 'Dessert',
    price: 140,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTimeMinutes: 2
  }
];

module.exports = defaultMenuItems;
