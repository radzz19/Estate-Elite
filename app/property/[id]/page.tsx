"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Home,
  Car,
  Shield,
  Wifi,
  Wind,
  Send,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useParams } from "next/navigation"
import { PropertyType } from "@/lib/properties"
import { sendInquiryEmail, initializeEmailJS, EmailParams } from "@/lib/emailjs"
import { useToast } from "@/hooks/use-toast"

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string
  const [property, setProperty] = useState<PropertyType | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedProperties, setRelatedProperties] = useState<PropertyType[]>([])
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    initializeEmailJS()
    if (propertyId) {
      fetchProperty()
      fetchRelatedProperties()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/properties/${propertyId}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
      } else {
        console.error('Property not found')
        toast({
          title: "Error",
          description: "Property not found",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        setRelatedProperties(data.filter((p: PropertyType) => p.id !== propertyId).slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching related properties:', error)
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

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!property) return

    setIsSubmitting(true)

    try {
      const emailParams: EmailParams = {
        user_name: contactForm.name,
        user_email: contactForm.email,
        user_phone: contactForm.phone,
        property_title: property.title,
        property_location: property.location,
        property_price: formatPrice(property.price, property.type),
        property_type: property.type === 'sale' ? 'For Sale' : 'For Rent',
        property_link: window.location.href,
        message: contactForm.message,
        inquiry_type: 'property_detail'
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
        const subject = `Inquiry about ${property.title}`
        const body = `Hi,

I'm interested in your property "${property.title}" listed for ${formatPrice(property.price, property.type)} in ${property.location}.

My Details:
Name: ${contactForm.name}
Email: ${contactForm.email}
Phone: ${contactForm.phone}

Message:
${contactForm.message}

Property Link: ${window.location.href}

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

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      })
    } catch (err) {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Property link copied to clipboard",
      })
    }
  }

  const handleContact = (type: 'phone' | 'email') => {
    if (!property) return
    
    if (type === 'phone') {
      window.open(`tel:${property.contact.phone}`)
    } else {
      setIsInquiryOpen(true)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      'parking': Car,
      'security': Shield,
      'wifi': Wifi,
      'ac': Wind,
      'lift': Home,
      'garden': Home,
      'gym': Home,
      'pool': Home,
      'club': Home,
    }
    
    const key = amenity.toLowerCase()
    for (const [word, icon] of Object.entries(iconMap)) {
      if (key.includes(word)) {
        return icon
      }
    }
    return Tag
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/listings">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 mt-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link href="/listings">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden mb-4 bg-gray-100">
              <img
                src={property.images?.[currentImageIndex] || "/placeholder.jpg"}
                alt={property.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg"
                }}
              />
              {property.images && property.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background shadow-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background shadow-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
            </div>

            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? "border-primary shadow-md" : "border-transparent"
                    }`}
                  >
                    <img 
                      src={image || "/placeholder.jpg"} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg"
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={property.type === "sale" ? "default" : "secondary"} className="text-sm">
                    For {property.type === "sale" ? "Sale" : "Rent"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-2xl leading-tight">{property.title}</CardTitle>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(property.price, property.type)}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center col-span-2">
                      <Square className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{property.area.toLocaleString()} sq ft</span>
                    </div>
                  )}
                </div>

                <Separator />

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {property.amenities.slice(0, 6).map((amenity, index) => {
                        const IconComponent = getAmenityIcon(amenity)
                        return (
                          <div key={index} className="flex items-center">
                            <IconComponent className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        )
                      })}
                      {property.amenities.length > 6 && (
                        <div className="text-sm text-muted-foreground">
                          +{property.amenities.length - 6} more amenities
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {property.contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{property.contact.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>{property.contact.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => handleContact('phone')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    
                    <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Inquiry
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-xl backdrop-blur-sm">
                        <DialogHeader>
                          <DialogTitle>Send Inquiry</DialogTitle>
                          <DialogDescription>
                            Send a message to {property.contact.name} about this property.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleInquiry} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                              id="name"
                              value={contactForm.name}
                              onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter your name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Your Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Your Phone</Label>
                            <Input
                              id="phone"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="Enter your phone number"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              value={contactForm.message}
                              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                              placeholder="I'm interested in this property..."
                              rows={4}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
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
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {property.createdAt && (
                  <>
                    <Separator />
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Listed on {new Date(property.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>About This Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {relatedProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((relProperty) => (
                <Link key={relProperty.id} href={`/property/${relProperty.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={relProperty.images?.[0] || "/placeholder.jpg"}
                        alt={relProperty.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg"
                        }}
                      />
                      <Badge 
                        variant={relProperty.type === "sale" ? "default" : "secondary"}
                        className="absolute top-2 left-2"
                      >
                        For {relProperty.type === "sale" ? "Sale" : "Rent"}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{relProperty.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{relProperty.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">
                          {formatPrice(relProperty.price, relProperty.type)}
                        </span>
                        {relProperty.bedrooms && relProperty.bathrooms && (
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Bed className="w-3 h-3 mr-1" />
                              {relProperty.bedrooms}
                            </span>
                            <span className="flex items-center">
                              <Bath className="w-3 h-3 mr-1" />
                              {relProperty.bathrooms}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}