import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://dinesh:D9075134498m@cluster0.sizscn5.mongodb.net/";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('ecommerce');
    const categories = await db.collection('categories').find({}).toArray();
    console.log("Categories found:", categories.length);

    if (categories.length === 0) {
      console.log("No categories found to seed products into.");
      return;
    }

    const productsCollection = db.collection('products');
    let totalInserted = 0;

    for (const category of categories) {
      const products = [];
      const catId = category._id.toString();
      
      for (let i = 1; i <= 15; i++) {
        const basePrice = Math.floor(Math.random() * 5000) + 500;
        
        products.push({
          name: `${category.name} Item ${i} - Premium Select`,
          description: `This is a high-quality product in the ${category.name} category. It features premium materials and excellent build quality, ensuring a long shelf life and great usability. Highly recommended for everyday use.`,
          brand: `Brand ${Math.floor(Math.random() * 5) + 1}`,
          price: basePrice.toString(),
          discountPrice: Math.floor(basePrice * 0.8).toString(),
          discountPercentage: 20,
          categoryId: catId,
          categoryName: category.name,
          images: [`https://via.placeholder.com/400?text=${encodeURIComponent(category.name)}+Item+${i}`],
          stockQuantity: Math.floor(Math.random() * 100) + 10,
          active: true,
          featured: Math.random() > 0.8, // 20% chance to be featured
          averageRating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
          reviewCount: Math.floor(Math.random() * 500),
          tags: [category.name.toLowerCase(), "premium", "new arrival"],
          specs: {
            weight: "1.5 kg",
            dimensions: "10x10x10 cm",
            color: ["Red", "Blue", "Black"][Math.floor(Math.random() * 3)],
            material: "Mixed",
            warranty: "1 Year"
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          _class: "com.ecommerce.model.Product"
        });
      }

      await productsCollection.insertMany(products);
      console.log(`Inserted 15 products for category ${category.name}`);
      totalInserted += 15;
    }

    console.log(`Successfully seeded ${totalInserted} products.`);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
