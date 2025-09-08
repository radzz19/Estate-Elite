"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, MapPin, IndianRupee, Home, MessageCircle, Send, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import { sendInquiryEmail, initializeEmailJS, EmailParams } from "@/lib/emailjs"
import { useToast } from "@/hooks/use-toast"

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    location: '',
    priceRange: '',
    propertyType: ''
  })

  const heroImages = [
    "https://i.pinimg.com/1200x/d1/43/c0/d143c00b48fe47c568e60c3794e942e6.jpg",
    "https://i.pinimg.com/1200x/1c/79/59/1c7959173bef58b99efda3363d1970c1.jpg",
    "https://i.pinimg.com/1200x/77/d7/18/77d718f3889e3bba59f1e3afba6b51d5.jpg",
    "/beachfront-property.png",
    "/penthouse-rooftop-city.png",
    "/traditional-mansion.png",
  ]

  useEffect(() => {
    initializeEmailJS()
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 4000) // 4 seconds for smooth viewing

    return () => clearInterval(interval)
  }, [heroImages.length])

  const handleGeneralInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const emailParams: EmailParams = {
        user_name: contactForm.name,
        user_email: contactForm.email,
        user_phone: contactForm.phone,
        property_title: 'General Property Inquiry',
        property_location: contactForm.location || 'Multiple Locations',
        property_price: contactForm.priceRange || 'Flexible Budget',
        property_type: contactForm.propertyType || 'Multiple Types',
        property_link: window.location.origin,
        message: contactForm.message,
        inquiry_type: 'main_page'
      }

      const success = await sendInquiryEmail(emailParams)
      
      if (success) {
        toast({
          title: "Inquiry sent successfully!",
          description: "We'll get back to you soon with property options that match your requirements.",
        })
        setContactForm({
          name: '',
          email: '',
          phone: '',
          message: '',
          location: '',
          priceRange: '',
          propertyType: ''
        })
        setIsInquiryOpen(false)
      } else {
        // Fallback to mailto
        const subject = 'General Property Inquiry'
        const body = `Hi,

I'm interested in exploring property options and would like to get in touch.

My Details:
Name: ${contactForm.name}
Email: ${contactForm.email}
Phone: ${contactForm.phone}

Requirements:
Location Preference: ${contactForm.location || 'Flexible'}
Price Range: ${contactForm.priceRange || 'Flexible'}
Property Type: ${contactForm.propertyType || 'Open to options'}

Message:
${contactForm.message}

Looking forward to hearing from you.

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

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel with Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={currentImageIndex}
            src={heroImages[currentImageIndex]}
            alt={`Luxury Real Estate ${currentImageIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            Find Your
            <span className="block text-secondary">Dream Home</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Discover exceptional properties in prime locations with our premium real estate services
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {/* Location */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-foreground">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                Location
              </label>
              <Input
                placeholder="Enter city or area"
                className="h-12 border-border focus:ring-primary focus:border-primary"
                value={contactForm.location}
                onChange={(e) => setContactForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-foreground">
                <IndianRupee className="w-4 h-4 mr-2 text-primary" />
                Price Range
              </label>
              <Select value={contactForm.priceRange} onValueChange={(value) => setContactForm(prev => ({ ...prev, priceRange: value }))}>
                <SelectTrigger className="h-12 border-border focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Select price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-4cr">₹0 - ₹4 Cr</SelectItem>
                  <SelectItem value="4cr-8cr">₹4 Cr - ₹8 Cr</SelectItem>
                  <SelectItem value="8cr-16cr">₹8 Cr - ₹16 Cr</SelectItem>
                  <SelectItem value="16cr+">₹16 Cr+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-foreground">
                <Home className="w-4 h-4 mr-2 text-primary" />
                Property Type
              </label>
              <Select value={contactForm.propertyType} onValueChange={(value) => setContactForm(prev => ({ ...prev, propertyType: value }))}>
                <SelectTrigger className="h-12 border-border focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-transparent">Search</label>
              <Link href="/listings">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 hover:shadow-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Search Properties
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <Link href="/listings">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Search className="w-5 h-5 mr-2" />
              Browse All Properties
            </Button>
          </Link>
          
          <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="bg-white/90 hover:bg-white text-primary border-white hover:border-primary px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <MessageCircle className="w-5 h-5 mr-2" />
                Get Property Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white border border-gray-200 shadow-xl backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Get Property Consultation</DialogTitle>
                <DialogDescription>
                  Tell us about your requirements and we'll help you find the perfect property
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleGeneralInquiry} className="space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dialog-location">Preferred Location</Label>
                    <Input
                      id="dialog-location"
                      value={contactForm.location}
                      onChange={(e) => setContactForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City or area"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dialog-price">Budget Range</Label>
                    <Select value={contactForm.priceRange} onValueChange={(value) => setContactForm(prev => ({ ...prev, priceRange: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-4cr">₹0 - ₹4 Cr</SelectItem>
                        <SelectItem value="4cr-8cr">₹4 Cr - ₹8 Cr</SelectItem>
                        <SelectItem value="8cr-16cr">₹8 Cr - ₹16 Cr</SelectItem>
                        <SelectItem value="16cr+">₹16 Cr+</SelectItem>
                        <SelectItem value="rent">Looking for Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dialog-type">Property Type</Label>
                    <Select value={contactForm.propertyType} onValueChange={(value) => setContactForm(prev => ({ ...prev, propertyType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">Tell us about your requirements *</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about your specific requirements, timeline, and any other details..."
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
        </motion.div>
      </div>
    </section>
  )
}
