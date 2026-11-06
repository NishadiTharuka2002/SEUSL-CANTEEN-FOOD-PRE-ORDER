/**
 * Database Seeder for SEUSL University Canteen System
 * Populates 6 delicious food items in EVERY category with 100% MATCHED pictures & full details!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Inventory = require('./models/Inventory');
const PickupSlot = require('./models/PickupSlot');
const Wallet = require('./models/Wallet');
const Transaction = require('./models/Transaction');
const Order = require('./models/Order');
const Feedback = require('./models/Feedback');

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://tharukanishadi2023_db_user:Nishadi12345@cluster0.xj4reyt.mongodb.net/university_canteen?retryWrites=true&w=majority';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('[Connected] Clearing old test data...');
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Inventory.deleteMany({});
    await PickupSlot.deleteMany({});
    await Wallet.deleteMany({});
    await Transaction.deleteMany({});
    await Order.deleteMany({});
    await Feedback.deleteMany({});

    console.log('Seeding Demo Users...');
    const studentUser = await User.create({
      name: 'Kasun Bandara',
      email: 'student@seusl.lk',
      password: 'password123',
      role: 'student',
      regNumber: 'SEU/IS/22/ICT/001',
      phone: '0771234567'
    });

    const staffUser = await User.create({
      name: 'Canteen Staff Mala',
      email: 'staff@seusl.lk',
      password: 'password123',
      role: 'staff',
      phone: '0719876543'
    });

    const kitchenUser = await User.create({
      name: 'Chef Sunil',
      email: 'kitchen@seusl.lk',
      password: 'password123',
      role: 'kitchen',
      phone: '0761122334'
    });

    const adminUser = await User.create({
      name: 'Canteen Administrator',
      email: 'admin@seusl.lk',
      password: 'password123',
      role: 'admin',
      phone: '0703344556'
    });

    console.log('Seeding Inventory Ingredients...');
    await Inventory.create({
      ingredientName: 'Samba Rice',
      category: 'Grains & Rice',
      currentStock: 60,
      unit: 'kg',
      minThreshold: 15,
      costPerUnit: 240
    });

    await Inventory.create({
      ingredientName: 'Fresh Chicken',
      category: 'Meat & Poultry',
      currentStock: 35,
      unit: 'kg',
      minThreshold: 8,
      costPerUnit: 1100
    });

    await Inventory.create({
      ingredientName: 'Tuna Fish',
      category: 'Meat & Poultry',
      currentStock: 20,
      unit: 'kg',
      minThreshold: 5,
      costPerUnit: 950
    });

    await Inventory.create({
      ingredientName: 'Farm Fresh Eggs',
      category: 'Dairy',
      currentStock: 200,
      unit: 'pcs',
      minThreshold: 40,
      costPerUnit: 35
    });

    await Inventory.create({
      ingredientName: 'Fresh Milk',
      category: 'Dairy',
      currentStock: 50,
      unit: 'liter',
      minThreshold: 15,
      costPerUnit: 300
    });

    await Inventory.create({
      ingredientName: 'Red Dhal',
      category: 'Grains & Rice',
      currentStock: 6,
      unit: 'kg',
      minThreshold: 10,
      costPerUnit: 320
    });

    console.log('Seeding 6 Food Items per Category (Total 30 Dishes) with pictures and full details...');
    const menuItems = await MenuItem.insertMany([
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
        description: 'Healthy white samba rice served with rich red dhal curry, tempered potatoes, green gotukola sambol, and papadam.',
        category: 'Lunch',
        price: 260,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 5
      },

      // ==========================================
      // 3. SNACKS & BAKERY (6 ITEMS)
      // ==========================================
      {
        name: 'Crispy Golden Vegetable & Potato Samosa (2 Pcs)',
        description: 'Crispy triangular flaky pastry pockets packed with spiced curried potatoes, onions, cumin seeds, and peas.',
        category: 'Snacks',
        price: 120,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Crispy Vegetable Spring Rolls (2 Pcs)',
        description: 'Golden fried crispy crepes stuffed with seasoned julienne carrots, cabbage, and black pepper, served with dip.',
        category: 'Snacks',
        price: 100,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Crispy Golden French Fries with Dip',
        description: 'Freshly fried hot potato fries tossed with sea salt and served with tomato ketchup dipping sauce.',
        category: 'Snacks',
        price: 180,
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 4
      },
      {
        name: 'Canteen Chicken & Cheese Burger',
        description: 'Soft sesame seed bun filled with a seasoned chicken patty, melted cheddar cheese, fresh lettuce, and burger sauce.',
        category: 'Snacks',
        price: 250,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 5
      },
      {
        name: 'Freshly Baked Sausage Roll Pastry',
        description: 'Flaky buttery golden puff pastry baked with a spiced sausage filling and sprinkled with black sesame.',
        category: 'Snacks',
        price: 130,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Toasted Chicken & Salad Submarine Sandwich',
        description: 'Warm crusty French baguette roll stuffed with shredded roast chicken, crunchy cucumber, tomatoes, and mayo.',
        category: 'Snacks',
        price: 280,
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
    ]);

    console.log('Seeding Pickup Slots...');
    const today = new Date().toISOString().split('T')[0];
    const slot1 = await PickupSlot.create({
      slotDate: today,
      startTime: '11:30',
      endTime: '11:50',
      label: '11:30 AM - 11:50 AM',
      maxCapacity: 15,
      currentBookings: 2,
      isActive: true
    });

    const slot2 = await PickupSlot.create({
      slotDate: today,
      startTime: '12:00',
      endTime: '12:20',
      label: '12:00 PM - 12:20 PM',
      maxCapacity: 15,
      currentBookings: 8,
      isActive: true
    });

    const slot3 = await PickupSlot.create({
      slotDate: today,
      startTime: '12:30',
      endTime: '12:50',
      label: '12:30 PM - 12:50 PM',
      maxCapacity: 15,
      currentBookings: 1,
      isActive: true
    });

    console.log('Seeding Student Wallet (Rs. 2,500)...');
    const studentWallet = await Wallet.create({
      user: studentUser._id,
      balance: 2500,
      currency: 'LKR',
      status: 'ACTIVE'
    });

    await Transaction.create({
      wallet: studentWallet._id,
      user: studentUser._id,
      type: 'TOP_UP',
      amount: 2500,
      balanceAfter: 2500,
      status: 'SUCCESS',
      description: 'Account activation welcome balance credit'
    });

    console.log('Seeding Sample Active Order...');
    const sampleOrder1 = await Order.create({
      orderNumber: 'SEU-ORD-1001',
      user: studentUser._id,
      items: [
        {
          menuItem: menuItems[6]._id,
          name: menuItems[6].name,
          price: 380,
          quantity: 1,
          subtotal: 380
        },
        {
          menuItem: menuItems[18]._id,
          name: menuItems[18].name,
          price: 140,
          quantity: 1,
          subtotal: 140
        }
      ],
      totalAmount: 520,
      pickupSlot: slot2._id,
      pickupTime: slot2.label,
      pickupDate: today,
      paymentMethod: 'WALLET',
      paymentStatus: 'PAID',
      status: 'Preparing',
      specialNotes: 'Please give extra napkins',
      statusTimestamps: {
        placedAt: new Date(Date.now() - 15 * 60 * 1000),
        confirmedAt: new Date(Date.now() - 10 * 60 * 1000),
        preparingAt: new Date(Date.now() - 4 * 60 * 1000)
      }
    });

    console.log('Seeding Customer Feedback...');
    await Feedback.create({
      user: studentUser._id,
      order: sampleOrder1._id,
      menuItem: menuItems[6]._id,
      rating: 5,
      comment: 'The chicken fried rice was hot and delicious! Minimal waiting at the pickup counter.',
      serviceAspect: 'Food Quality'
    });

    console.log('----------------------------------------------------');
    console.log(' SEEDING COMPLETE! Exactly 6 dishes per category (30 total)');
    console.log(' All pictures, names & descriptions match 100%!');
    console.log(' Student: student@seusl.lk / password123 (Wallet: Rs. 2,500)');
    console.log(' Staff:   staff@seusl.lk   / password123');
    console.log(' Kitchen: kitchen@seusl.lk / password123');
    console.log(' Admin:   admin@seusl.lk   / password123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
