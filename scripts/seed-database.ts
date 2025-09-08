import connectDB from '../lib/mongodb'
import Property from '../models/Property'

const sampleProperties = [
  {
    title: "Luxury 3BHK Apartment in Sector 17",
    description: "Beautiful 3BHK apartment in the heart of Chandigarh's commercial hub. This property offers modern amenities, excellent connectivity, and is perfect for families looking for a premium living experience. Features include spacious rooms, modular kitchen, and 24/7 security.",
    price: 8500000,
    location: "Sector 17, Chandigarh",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop&auto=format"
    ],
    type: "sale",
    bedrooms: 3,
    bathrooms: 2,
    area: 1650,
    amenities: ["Parking", "Security", "Lift", "Power Backup", "Garden", "Gym"],
    contact: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@example.com"
    }
  },
  {
    title: "Modern 2BHK for Rent in Sector 22",
    description: "Fully furnished 2BHK apartment available for rent in Sector 22. Perfect for working professionals or small families. Close to IT parks and shopping centers. Includes all modern amenities and appliances.",
    price: 25000,
    location: "Sector 22, Chandigarh",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop&auto=format"
    ],
    type: "rent",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ["Furnished", "AC", "WiFi", "Parking", "Security", "Lift"],
    contact: {
      name: "Priya Sharma",
      phone: "+91 98765 43211",
      email: "priya.sharma@example.com"
    }
  },
  {
    title: "Premium PG Accommodation in Sector 15",
    description: "Comfortable and affordable PG accommodation for students and working professionals. Single and double sharing rooms available with all meals, WiFi, laundry service, and 24x7 security. Located close to universities and IT companies.",
    price: 12000,
    location: "Sector 15, Chandigarh",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format"
    ],
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    area: 150,
    amenities: ["Meals", "WiFi", "Laundry", "Security", "AC", "Common Area"],
    contact: {
      name: "Amit Singh",
      phone: "+91 98765 43212",
      email: "amit.singh@example.com"
    }
  },
  {
    title: "Spacious 4BHK Villa in Sector 9",
    description: "Independent 4BHK villa with private garden and parking for 2 cars. This property offers luxury living with spacious rooms, modern kitchen, and beautiful landscaping. Perfect for large families who value privacy and comfort.",
    price: 15000000,
    location: "Sector 9, Chandigarh",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format"
    ],
    type: "sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    amenities: ["Garden", "Parking", "Security", "Independent", "Terrace", "Store Room"],
    contact: {
      name: "Deepak Verma",
      phone: "+91 98765 43213",
      email: "deepak.verma@example.com"
    }
  },
  {
    title: "Cozy 1BHK Studio in Sector 34",
    description: "Compact and modern 1BHK studio apartment perfect for young professionals. Features open-plan living, modern kitchen, and great connectivity to major business districts. Ideal for those seeking affordable luxury.",
    price: 18000,
    location: "Sector 34, Chandigarh",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format"
    ],
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    amenities: ["Furnished", "AC", "WiFi", "Security", "Lift", "Balcony"],
    contact: {
      name: "Neha Gupta",
      phone: "+91 98765 43214",
      email: "neha.gupta@example.com"
    }
  },
  {
    title: "Luxury Penthouse in Sector 26",
    description: "Stunning penthouse with panoramic city views. This premium property features high-end finishes, spacious terraces, and world-class amenities. Perfect for those who appreciate luxury and exclusivity in their living space.",
    price: 25000000,
    location: "Sector 26, Chandigarh",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop&auto=format"
    ],
    type: "sale",
    bedrooms: 3,
    bathrooms: 3,
    area: 3000,
    amenities: ["Terrace", "City View", "Luxury Fittings", "Parking", "Pool", "Gym", "Concierge"],
    contact: {
      name: "Rohit Malhotra",
      phone: "+91 98765 43215",
      email: "rohit.malhotra@example.com"
    }
  }
]

export async function seedDatabase() {
  try {
    await connectDB()
    
    // Clear existing properties
    await Property.deleteMany({})
    
    // Insert sample properties
    await Property.insertMany(sampleProperties)
    
    console.log('Database seeded successfully with', sampleProperties.length, 'properties')
    return { success: true, count: sampleProperties.length }
  } catch (error) {
    console.error('Error seeding database:', error)
    return { success: false, error: error.message }
  }
}
