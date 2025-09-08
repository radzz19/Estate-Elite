"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  SlidersHorizontal, 
  X, 
  Filter,
  HeartHandshake,
  MessageCircle,
  Phone,
  Send,
  BookmarkCheck,
  Bookmark,
  Star,
  Calendar,
  TrendingUp,
  Home,
  Building2,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { PropertyType } from "@/lib/properties"
import { getBookmarks, addBookmark, removeBookmark, isBookmarked, BookmarkedProperty } from "@/lib/bookmarks"
import { sendInquiryEmail, initializeEmailJS, EmailParams } from "@/lib/emailjs"
import { useToast } from "@/hooks/use-toast"

export default function ListingsPage() {
  const [properties, setProperties] = useState<PropertyType[]>([])
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>([])
  const [bookmarks, setBookmarks] = useState<BookmarkedProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [bedrooms, setBedrooms] = useState<string>("all")
  const [bathrooms, setBathrooms] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    initializeEmailJS()
    fetchProperties()
    loadBookmarks()
  }, [])

  useEffect(() => {
    filterProperties()
  }, [properties, searchTerm, selectedType, priceRange, bedrooms, bathrooms, selectedLocation, activeTab])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadBookmarks = () => {
    const savedBookmarks = getBookmarks()
    setBookmarks(savedBookmarks)
  }

  const filterProperties = () => {
    let filtered = properties

    // Filter by active tab
    if (activeTab === "bookmarked") {
      const bookmarkedIds = bookmarks.map(b => b.id)
      filtered = properties.filter(p => bookmarkedIds.includes(p.id))
    }

    // Apply other filters
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(property => property.type === selectedType)
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(property => property.location === selectedLocation)
    }

    if (bedrooms !== "all") {
      filtered = filtered.filter(property => property.bedrooms && property.bedrooms >= parseInt(bedrooms))
    }

    if (bathrooms !== "all") {
      filtered = filtered.filter(property => property.bathrooms && property.bathrooms >= parseInt(bathrooms))
    }

    filtered = filtered.filter(property => property.price >= priceRange[0] && property.price <= priceRange[1])

    setFilteredProperties(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedType("all")
    setPriceRange([0, 10000000])
    setBedrooms("all")
    setBathrooms("all")
    setSelectedLocation("all")
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

  const getUniqueLocations = () => {
    const locations = properties.map(p => p.location).filter(Boolean)
    return [...new Set(locations)]
  }

  const handleBookmark = (property: PropertyType) => {
    const propertyIsBookmarked = isBookmarked(property.id)
    
    if (propertyIsBookmarked) {
      if (removeBookmark(property.id)) {
        loadBookmarks()
        toast({
          title: "Removed from bookmarks",
          description: `${property.title} has been removed from your bookmarks`,
        })
      }
    } else {
      if (addBookmark(property)) {
        loadBookmarks()
        toast({
          title: "Added to bookmarks",
          description: `${property.title} has been bookmarked`,
        })
      }
    }
  }

  const handleInquiry = (property: PropertyType) => {
    setSelectedProperty(property)
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: `Hi, I'm interested in ${property.title} located in ${property.location}. Could you please provide more details?`
    })
    setIsInquiryOpen(true)
  }

  const submitInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProperty) return

    setIsSubmitting(true)

    try {
      const emailParams: EmailParams = {
        user_name: contactForm.name,
        user_email: contactForm.email,
        user_phone: contactForm.phone,
        property_title: selectedProperty.title,
        property_location: selectedProperty.location,
        property_price: formatPrice(selectedProperty.price, selectedProperty.type),
        property_type: selectedProperty.type === 'sale' ? 'For Sale' : 'For Rent',
        property_link: `${window.location.origin}/property/${selectedProperty.id}`,
        message: contactForm.message,
        inquiry_type: 'listing_page'
      }

      const success = await sendInquiryEmail(emailParams)
      
      if (success) {
        toast({
          title: "Inquiry sent successfully!",
          description: "We'll get back to you soon with property details.",
        })
        setContactForm({ name: '', email: '', phone: '', message: '' })
        setIsInquiryOpen(false)
      } else {
        // Fallback to mailto
        const subject = `Inquiry about ${selectedProperty.title}`
        const body = `Hi,

I'm interested in your property "${selectedProperty.title}" listed for ${formatPrice(selectedProperty.price, selectedProperty.type)} in ${selectedProperty.location}.

My Details:
Name: ${contactForm.name}
Email: ${contactForm.email}
Phone: ${contactForm.phone}

Message:
${contactForm.message}

Property Link: ${window.location.origin}/property/${selectedProperty.id}

Best regards,
${contactForm.name}`

        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
        
        toast({
          title: "Email client opened",
          description: "Please send the email from your email client.",
        })
        setIsInquiryOpen(false)
      }
    } catch (error) {
      console.error('Error sending inquiry:', error)
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading premium properties...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/5 to-primary/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6">
              Premium Properties
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover exceptional real estate opportunities curated for discerning buyers and investors
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
              >
                <div className="flex items-center justify-center mb-2">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">{properties.length}</h3>
                <p className="text-muted-foreground">Premium Properties</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
              >
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">{getUniqueLocations().length}</h3>
                <p className="text-muted-foreground">Prime Locations</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
              >
                <div className="flex items-center justify-center mb-2">
                  <Bookmark className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">{bookmarks.length}</h3>
                <p className="text-muted-foreground">Bookmarked</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties, locations, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 px-6"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button onClick={clearFilters} variant="ghost" className="h-12">
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="type">Property Type</Label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="sale">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {getUniqueLocations().map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="bedrooms">Min Bedrooms</Label>
                        <Select value={bedrooms} onValueChange={setBedrooms}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="bathrooms">Min Bathrooms</Label>
                        <Select value={bathrooms} onValueChange={setBathrooms}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 lg:col-span-4">
                        <Label>Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</Label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          min={0}
                          max={10000000}
                          step={100000}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for All Properties vs Bookmarked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                All Properties ({filteredProperties.length})
              </TabsTrigger>
              <TabsTrigger value="bookmarked" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Bookmarked ({bookmarks.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Properties Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {filteredProperties.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {activeTab === "bookmarked" ? "No bookmarked properties" : "No properties found"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "bookmarked"
                    ? "Start bookmarking properties to see them here"
                    : "Try adjusting your search criteria or filters"
                  }
                </p>
                {activeTab !== "bookmarked" && (
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group bg-white/90 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <Link href={`/property/${property.id}`}>
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={property.images?.[0] || "/placeholder.jpg"}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg"
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                      
                      {/* Property Type Badge */}
                      <Badge 
                        variant={property.type === "sale" ? "default" : "secondary"}
                        className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white"
                      >
                        For {property.type === "sale" ? "Sale" : "Rent"}
                      </Badge>

                      {/* Bookmark Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(property)}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg"
                      >
                        {isBookmarked(property.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Quick Action Buttons */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href={`/property/${property.id}`}>
                          <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white shadow-lg">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleInquiry(property)}
                          className="bg-white/90 hover:bg-white shadow-lg"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <Link href={`/property/${property.id}`}>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {property.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(property.price, property.type)}
                        </span>
                      </div>

                      {(property.bedrooms || property.bathrooms || property.area) && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          {property.bedrooms && (
                            <span className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              {property.bedrooms}
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              {property.bathrooms}
                            </span>
                          )}
                          {property.area && (
                            <span className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              {property.area.toLocaleString()} sq ft
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Link href={`/property/${property.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => handleInquiry(property)}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Inquire
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Inquiry Dialog */}
      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white border border-gray-200 shadow-xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Send Property Inquiry</DialogTitle>
            <DialogDescription>
              {selectedProperty && (
                <>
                  Get in touch about <span className="font-semibold">{selectedProperty.title}</span> in {selectedProperty.location}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedProperty.images?.[0] || "/placeholder.jpg"}
                  alt={selectedProperty.title}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg"
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{selectedProperty.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedProperty.location}
                  </p>
                  <p className="text-lg font-bold text-primary mt-1">
                    {formatPrice(selectedProperty.price, selectedProperty.type)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={submitInquiry} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="message">Your Message *</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us about your requirements..."
                rows={4}
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsInquiryOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Inquiry
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
