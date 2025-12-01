require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: "Bose QuietComfort Ultra Headphones",
    description: "Premium wireless ANC headphones with immersive sound and long-lasting comfort.",
    price: 379.99,
    category: "electronics",
    brand: "Bose",
    stock: 18,
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80"],
    features: ["Active Noise Cancelling", "Spatial Audio", "Bluetooth 5.3", "Soft Ear Cushions"]
  },
 
  {
    name: "Puma RS-X Bold Sneakers",
    description: "Chunky retro-inspired shoes with bold colors and lightweight cushioning.",
    price: 120.00,
    category: "clothing",
    brand: "Puma",
    stock: 45,
    images: ["https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=500&q=80"],
    features: ["Lightweight Foam", "Bold Design", "Rubber Sole", "Breathable Upper"]
  },
  {
    name: "Logitech MX Master 3S Mouse",
    description: "Advanced ergonomic mouse with ultra-fast scrolling and silent clicks.",
    price: 99.99,
    category: "electronics",
    brand: "Logitech",
    stock: 30,
    images: ["https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=500&q=80"],
    features: ["Silent Clicks", "Ergo Design", "MagSpeed Wheel", "Multi-Device Support"]
  },

  {
    name: "Dell XPS 13 Laptop",
    description: "Ultra-portable premium laptop with InfinityEdge display and powerful performance.",
    price: 1399.99,
    category: "electronics",
    brand: "Dell",
    stock: 10,
    images: ["https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=500&q=80"],
    features: ["13-inch Display", "16GB RAM", "512GB SSD", "Backlit Keyboard"]
  },
  {
    name: "Fitbit Versa 4 Smartwatch",
    description: "A lightweight smartwatch with fitness tracking, GPS, and long battery life.",
    price: 229.99,
    category: "electronics",
    brand: "Fitbit",
    stock: 25,
    images: ["https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=500&q=80"],
    features: ["GPS", "Heart Rate Monitor", "Sleep Tracking", "Waterproof"]
  },
  {
    name: "Herschel Little America Backpack",
    description: "Stylish travel backpack with padded laptop sleeve and spacious compartments.",
    price: 99.99,
    category: "home",
    brand: "Herschel",
    stock: 40,
    images: ["https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=500&q=80"],
    features: ["Laptop Sleeve", "Padded Straps", "Spacious Design", "Durable Fabric"]
  },
  {
    name: "Google Nest Mini (2nd Gen)",
    description: "Smart speaker powered by Google Assistant with improved bass and voice recognition.",
    price: 49.99,
    category: "electronics",
    brand: "Google",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80"],
    features: ["Google Assistant", "Improved Bass", "Voice Match", "Compact Design"]
  },
  {
    name: "Ray-Ban Aviator Sunglasses",
    description: "Classic aviator sunglasses with premium metal frame and UV protection.",
    price: 159.99,
    category: "clothing",
    brand: "Ray-Ban",
    stock: 32,
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80"],
    features: ["UV Protection", "Metal Frame", "Classic Design", "Scratch Resistant"]
  },

  {
    name: "Xiaomi Mi Band 7",
    description: "Lightweight fitness tracker with AMOLED display and long battery life.",
    price: 59.99,
    category: "electronics",
    brand: "Xiaomi",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=500&q=80"],
    features: ["AMOLED", "Heart Monitoring", "Sports Modes", "Water Resistant"]
  },
 
 
  {
    name: "Sony Alpha A7 IV Camera",
    description: "Full-frame hybrid mirrorless camera perfect for photo and video creators.",
    price: 2699.99,
    category: "electronics",
    brand: "Sony",
    stock: 6,
    images: ["https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?auto=format&fit=crop&w=500&q=80"],
    features: ["4K Video", "33MP Sensor", "Fast Autofocus", "Image Stabilization"]
  },
  {
    name: "ASICS Gel-Kayano 29 Running Shoes",
    description: "Premium running shoes with advanced cushioning for long-distance runs.",
    price: 160.00,
    category: "sports",
    brand: "ASICS",
    stock: 27,
    images: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80"],
    features: ["Gel Cushioning", "FlyteFoam", "Stability Support", "Breathable Upper"]
  },

  {
    name: "Guess Leather Strap Watch",
    description: "Stylish men's watch with stainless steel case and premium leather strap.",
    price: 129.99,
    category: "clothing",
    brand: "Guess",
    stock: 16,
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80"],
    features: ["Leather Strap", "Water Resistant", "Quartz Movement", "Stylish Design"]
  },
  {
    name: "Lenovo Legion 5 Gaming Laptop",
    description: "High-performance gaming laptop with RTX graphics and fast refresh display.",
    price: 1599.00,
    category: "electronics",
    brand: "Lenovo",
    stock: 11,
    images: ["https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=500&q=80"],
    features: ["RTX Graphics", "144Hz Display", "16GB RAM", "1TB SSD"]
  }
];


const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-ecommerce');
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    // await Product.deleteMany({});
    // console.log('🗑️ Cleared existing products');

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully added ${createdProducts.length} sample products`);

    // Display added products by category
    console.log('\n📦 Added Products by Category:');
    const categories = [...new Set(createdProducts.map(p => p.category))];
    
    categories.forEach(category => {
      console.log(`\n📁 ${category.toUpperCase()}:`);
      createdProducts
        .filter(p => p.category === category)
        .forEach(product => {
          console.log(`   - ${product.name} ($${product.price}) - Stock: ${product.stock}`);
        });
    });

    console.log('\n🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();