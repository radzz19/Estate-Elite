"use client"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/professional-woman-headshot.png",
    rating: 5,
    review:
      "EstateElite helped us find our dream home in Beverly Hills. Their attention to detail and market knowledge is unmatched. Highly recommended!",
    location: "Beverly Hills, CA",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/professional-man-headshot.png",
    rating: 5,
    review:
      "Outstanding service from start to finish. The team was professional, responsive, and made the entire buying process seamless.",
    location: "Manhattan, NY",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/avatar-1.png",
    rating: 5,
    review:
      "I was impressed by their extensive portfolio and personalized approach. They truly understand luxury real estate.",
    location: "Miami, FL",
  },
  {
    id: 4,
    name: "David Thompson",
    avatar: "/professional-bearded-man.png",
    rating: 5,
    review:
      "Exceptional expertise in the luxury market. They found us the perfect investment property with great potential.",
    location: "San Francisco, CA",
  },
  {
    id: 5,
    name: "Lisa Wang",
    avatar: "/professional-asian-woman-headshot.png",
    rating: 5,
    review: "The most professional real estate experience I've ever had. Their market insights are invaluable.",
    location: "Los Angeles, CA",
  },
  {
    id: 6,
    name: "Robert Miller",
    avatar: "/professional-older-man-headshot.png",
    rating: 5,
    review: "EstateElite exceeded all expectations. Their dedication to client satisfaction is remarkable.",
    location: "Boston, MA",
  },
]

export default function Reviews() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            What Our <span className="text-primary">Clients Say</span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: "easeOut" }}
            >
              <Card className="bg-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                      <AvatarFallback>
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{review.name}</h4>
                      <p className="text-sm text-muted-foreground">{review.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed">"{review.review}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
