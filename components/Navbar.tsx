"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Building, Users, Phone, LogIn, UserPlus, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About Us", href: "#about", icon: Users },
    { name: "Listings", href: "/listings", icon: Building },
    { name: "Contact", href: "#contact", icon: Phone },
  ]

  return (
    <motion.nav
      className={cn(
        "fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl rounded-full border border-border/40 bg-background/95 backdrop-blur-md shadow-lg transition-all duration-500 ease-in-out",
        isCollapsed ? "h-12 max-w-fit px-4" : "h-16 px-6",
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex h-full items-center justify-between">
        {/* Logo */}
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link href="/">
            <motion.h1
              className={cn("font-bold text-primary transition-all duration-500", isCollapsed ? "text-lg" : "text-2xl")}
              animate={{
                fontSize: isCollapsed ? "1.125rem" : "1.5rem",
              }}
            >
              {isCollapsed ? "EE" : "EstateElite"}
            </motion.h1>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="hidden md:flex items-center space-x-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="group relative px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="relative z-10 flex items-center gap-2 font-thin">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </span>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse Toggle */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <Menu className="h-4 w-4" />
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <Menu className="h-4 w-4" />
            </motion.div>
          </motion.button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground rounded-full"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 md:hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-2xl border border-border/40 bg-background/95 backdrop-blur-md p-4 shadow-xl">
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </motion.a>
                ))}
                <div className="border-t border-border/40 pt-4 mt-4 space-y-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-xl"
                    >
                      <LogIn className="h-4 w-4 mr-3" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                      <UserPlus className="h-4 w-4 mr-3" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
