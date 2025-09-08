"use client"

import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { PropertyType } from "@/lib/properties"

function FeaturedPropertiesSection() {
  const [properties, setProperties] = useState<PropertyType[]>([])

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data.slice(0, 6))
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = price.toLocaleString('en-IN')
    if (type === 'rent') {
      return `₹${formatted}/month`
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`
    }
    return `₹${formatted}`
  }

  return (
    <section id="properties" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured Properties in <span className="text-primary">Chandigarh</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover premium real estate opportunities and comfortable PG accommodations 
            in the heart of Chandigarh's most sought-after locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Link key={property.id} href={`/property/${property.id}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="relative">
                  <img
                    src={property.images?.[0] || '/placeholder.jpg'}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      For {property.type === 'sale' ? 'Sale' : 'Rent'}
                    </span>
                  </div>
                  {property.images && property.images.length > 1 && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                        +{property.images.length - 1} more
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-1">{property.location}</p>
                  <p className="text-2xl font-bold text-primary mb-4">
                    {formatPrice(property.price, property.type)}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    {property.bedrooms && <span>{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>}
                    {property.bathrooms && <span>{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>}
                    {property.area && <span>{property.area.toLocaleString()} sq ft</span>}
                  </div>
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading properties...</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedPropertiesSection
