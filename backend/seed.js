/**
 * Database Seeder for SEUSL University Canteen System
 * Populates 6 delicious food items in EVERY category with pictures & full details!
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

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/university_canteen_db');
    console.log('Connecting to MongoDB and clearing old test data...');
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
    const invRice = await Inventory.create({
      ingredientName: 'Samba Rice',
      category: 'Grains & Rice',
      currentStock: 60,
      unit: 'kg',
      minThreshold: 15,
      costPerUnit: 240
    });

    const invChicken = await Inventory.create({
      ingredientName: 'Fresh Chicken',
      category: 'Meat & Poultry',
      currentStock: 35,
      unit: 'kg',
      minThreshold: 8,
      costPerUnit: 1100
    });

    const invFish = await Inventory.create({
      ingredientName: 'Tuna Fish',
      category: 'Meat & Poultry',
      currentStock: 20,
      unit: 'kg',
      minThreshold: 5,
      costPerUnit: 950
    });

    const invEggs = await Inventory.create({
      ingredientName: 'Farm Fresh Eggs',
      category: 'Dairy',
      currentStock: 200,
      unit: 'pcs',
      minThreshold: 40,
      costPerUnit: 35
    });

    const invMilk = await Inventory.create({
      ingredientName: 'Fresh Milk',
      category: 'Dairy',
      currentStock: 50,
      unit: 'liter',
      minThreshold: 15,
      costPerUnit: 300
    });

    const invDhal = await Inventory.create({
      ingredientName: 'Red Dhal',
      category: 'Grains & Rice',
      currentStock: 6, // Low stock warning (< 10)
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
        name: 'String Hoppers (10 Pcs) with Kiri Hodi & Sambol',
        description: 'Steamed red and white rice flour nests served with rich coconut milk kiri hodi and freshly grated spicy pol sambol.',
        category: 'Breakfast',
        price: 180,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 5
      },
      {
        name: 'Crispy Vegetable Egg Roti',
        description: 'Hot Sri Lankan griddle paratha stuffed with beaten egg, green chilies, and caramelized onions served with dhal.',
        category: 'Breakfast',
        price: 150,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 5
      },
      {
        name: 'Traditional Pol Roti with Lunu Miris & Dhal',
        description: 'Two thick rustic shredded coconut rotis toasted golden brown, served with spicy crushed chili-onion-lime paste and dhal.',
        category: 'Breakfast',
        price: 140,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 5
      },
      {
        name: 'Ceylon Milk Rice (Kiribath) with Seeni Sambol',
        description: 'Diamond-cut rich coconut milk rice squares served with sweet and spicy caramelized onion seeni sambol.',
        category: 'Breakfast',
        price: 160,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 3
      },
      {
        name: 'Steamed Rice Puttu with Chickpea Curry (Kadala)',
        description: 'Layered steamed rice flour and grated coconut cylinders served with spiced black chickpea coconut curry.',
        category: 'Breakfast',
        price: 170,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 6
      },
      {
        name: 'Flaky Vegetable Paratha (2 Pcs) with Potato Curry',
        description: 'Tossed flaky Sri Lankan parathas served with tempered yellow potato curry and coconut sambol.',
        category: 'Breakfast',
        price: 150,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 5
      },

      // ==========================================
      // 2. LUNCH SPECIALS (6 ITEMS)
      // ==========================================
      {
        name: 'Sri Lankan Chicken Rice & Curry',
        description: 'Steaming samba rice served with tender chicken curry, yellow dhal, fried brinjal moju, pol sambol, and papadam.',
        category: 'Lunch',
        price: 350,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 5
      },
      {
        name: 'Vegetable Fried Rice with Egg & Chili Paste',
        description: 'Wok-tossed fragrant basmati fried rice loaded with carrots, leeks, fried egg, and homemade spicy chili paste.',
        category: 'Lunch',
        price: 300,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 8
      },
      {
        name: 'Spicy Chicken Kottu Roti',
        description: 'Chopped Godamba roti chopped on hot griddle with shredded roast chicken, eggs, cabbage, leeks, and curry gravy.',
        category: 'Lunch',
        price: 420,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 10
      },
      {
        name: 'Special Seafood Biryani with Boiled Egg',
        description: 'Spiced aromatic long-grain basmati rice cooked with fresh tuna steaks, boiled egg, mint sambol, and raita.',
        category: 'Lunch',
        price: 450,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 10
      },
      {
        name: 'Crispy Fried Fish Rice & Curry Platter',
        description: 'Samba rice served with deep-fried spiced fish fillet, dhal curry, tempered potato baduma, and gotukola sambol.',
        category: 'Lunch',
        price: 320,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 6
      },
      {
        name: 'Vegetarian Village Feast Rice & Curry',
        description: 'Nutritious red raw rice served with jackfruit (polos) curry, dhal, pumpkin curry, lotus root, and papadam.',
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
        name: 'Spicy Fish Cutlets (2 Pcs)',
        description: 'Golden fried crumbed croquettes filled with seasoned canned tuna fish, mashed potatoes, onions, and black pepper.',
        category: 'Snacks',
        price: 100,
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Crispy Vegetable Chinese Roll',
        description: 'Crispy breaded crepe roll packed with spiced curried potato, leeks, and carrots, fried to golden perfection.',
        category: 'Snacks',
        price: 90,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Chicken Sausage Pastry',
        description: 'Buttery flaky puff pastry baked with a seasoned chicken sausage inside and brushed with golden egg wash.',
        category: 'Snacks',
        price: 130,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 3
      },
      {
        name: 'Spicy Beef & Potato Samosa (2 Pcs)',
        description: 'Crispy triangular pastry pockets filled with minced spiced meat, onions, cumin seeds, and fresh coriander.',
        category: 'Snacks',
        price: 120,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Vegetable Egg & Seeni Sambol Bun',
        description: 'Soft sweet bakery bun stuffed with spicy caramelized onion seeni sambol and half a boiled farm egg.',
        category: 'Snacks',
        price: 110,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 1
      },
      {
        name: 'Golden Fried Ulundu Vadai (2 Pcs) with Chutney',
        description: 'Crispy savory lentil doughnuts spiced with curry leaves, crushed pepper, and ginger, served with coconut chutney.',
        category: 'Snacks',
        price: 100,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 3
      },

      // ==========================================
      // 4. BEVERAGES (6 ITEMS)
      // ==========================================
      {
        name: 'Fresh Iced Milk Tea',
        description: 'Freshly brewed strong Ceylon BOPF black tea mixed with creamy pasteurized milk and served over chilled ice.',
        category: 'Beverages',
        price: 120,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 3
      },
      {
        name: 'Chilled Lime Juice with Mint',
        description: 'Freshly squeezed Sri Lankan key limes blended with organic raw sugar, pinch of rock salt, and crushed mint leaves.',
        category: 'Beverages',
        price: 140,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 3
      },
      {
        name: 'Iced Milo Dinosaur',
        description: 'Creamy cold chocolate malt drink topped with a heaping mountain of dry crunchy Milo powder.',
        category: 'Beverages',
        price: 180,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 3
      },
      {
        name: 'Fresh King Coconut Water (Thambili)',
        description: 'Naturally sweet and electrolyte-rich fresh organic Sri Lankan king coconut water served chilled.',
        category: 'Beverages',
        price: 120,
        image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 1
      },
      {
        name: 'Fresh Papaya & Passion Fruit Smoothie',
        description: 'Thick creamy tropical smoothie blended from ripe red papaya and tangy passion fruit pulp.',
        category: 'Beverages',
        price: 160,
        image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 4
      },
      {
        name: 'Hot Ginger Milk Tea',
        description: 'Invigorating hot Ceylon tea infused with crushed fresh ginger root, cardamom, and creamy milk.',
        category: 'Beverages',
        price: 100,
        image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 3
      },

      // ==========================================
      // 5. DESSERTS & SWEETS (6 ITEMS)
      // ==========================================
      {
        name: 'Traditional Watalappan Cup',
        description: 'Rich and velvety steamed coconut custard sweetened with pure kithul jaggery, cardamom, and toasted cashew nuts.',
        category: 'Dessert',
        price: 180,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Creamy Buffalo Curd with Kithul Treacle',
        description: 'Traditional clay pot buffalo curd served with a generous drizzle of sweet golden pure Sri Lankan kithul treacle.',
        category: 'Dessert',
        price: 160,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Chocolate Biscuit Pudding (CBP)',
        description: 'Classic layered Marie biscuit pudding soaked in milk and dark chocolate cream, topped with roasted cashew nuts.',
        category: 'Dessert',
        price: 170,
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Caramel Egg Pudding Slice',
        description: 'Silky smooth baked vanilla egg custard topped with a rich golden caramelized sugar syrup layer.',
        category: 'Dessert',
        price: 150,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Sri Lankan Sweet Konda Kavum (2 Pcs)',
        description: 'Traditional festive oil cakes made from kithul treacle and rice flour, fried golden brown with crowned top.',
        category: 'Dessert',
        price: 120,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 2
      },
      {
        name: 'Tropical Fruit Salad with Vanilla Ice Cream',
        description: 'Chilled watermelon, pineapple, papaya, and banana cubes topped with a rich scoop of vanilla ice cream.',
        category: 'Dessert',
        price: 200,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        prepTimeMinutes: 4
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
          price: 350,
          quantity: 1,
          subtotal: 350
        },
        {
          menuItem: menuItems[18]._id,
          name: menuItems[18].name,
          price: 120,
          quantity: 1,
          subtotal: 120
        }
      ],
      totalAmount: 470,
      pickupSlot: slot2._id,
      pickupTime: slot2.label,
      pickupDate: today,
      paymentMethod: 'WALLET',
      paymentStatus: 'PAID',
      status: 'Preparing',
      specialNotes: 'Please give less gravy',
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
      comment: 'The chicken curry was tender and warm! Minimal waiting at the pickup counter.',
      serviceAspect: 'Food Quality'
    });

    console.log('----------------------------------------------------');
    console.log(' SEEDING COMPLETE! Exactly 6 dishes per category (30 total)');
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
