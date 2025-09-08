import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react"

interface PropertyCardProps {
  id: string
  title: string
  price: string
  location: string
  bedrooms: number
  bathrooms: number
  area: string
  image: string
  status: "For Sale" | "For Rent" | "Sold"
  featured?: boolean
}

export default function PropertyCard({
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  image,
  status,
  featured = false,
}: PropertyCardProps) {
  return (
    <Card className="group overflow-hidden bg-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            variant={status === "For Sale" ? "default" : status === "For Rent" ? "secondary" : "destructive"}
            className="bg-background/90 text-foreground"
          >
            {status}
          </Badge>
          {featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 bg-background/90 hover:bg-background text-foreground"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
          <span className="text-2xl font-bold text-primary">{price}</span>
        </div>

        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{area}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-lg transition-all duration-200">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
