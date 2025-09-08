import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import AboutUs from "@/components/AboutUs"
import FeaturedPropertiesSection from "@/components/FeaturedPropertiesSection"
import Categories from "@/components/Categories"
import Reviews from "@/components/Reviews"
import FAQ from "@/components/FAQ"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutUs />
      <FeaturedPropertiesSection />
      <Categories />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}
