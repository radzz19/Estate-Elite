// Bookmark management utilities
export interface BookmarkedProperty {
  id: string
  title: string
  location: string
  price: number
  type: 'sale' | 'rent'
  image: string
  bookmarkedAt: string
}

const BOOKMARKS_KEY = 'real-estate-bookmarks'

export const getBookmarks = (): BookmarkedProperty[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY)
    return bookmarks ? JSON.parse(bookmarks) : []
  } catch (error) {
    console.error('Error reading bookmarks:', error)
    return []
  }
}

export const saveBookmarks = (bookmarks: BookmarkedProperty[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
  } catch (error) {
    console.error('Error saving bookmarks:', error)
  }
}

export const addBookmark = (property: {
  id: string
  title: string
  location: string
  price: number
  type: 'sale' | 'rent'
  images?: string[]
}): boolean => {
  try {
    const bookmarks = getBookmarks()
    const isAlreadyBookmarked = bookmarks.some(b => b.id === property.id)
    
    if (isAlreadyBookmarked) {
      return false // Already bookmarked
    }
    
    const newBookmark: BookmarkedProperty = {
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      type: property.type,
      image: property.images?.[0] || '/placeholder.jpg',
      bookmarkedAt: new Date().toISOString()
    }
    
    const updatedBookmarks = [newBookmark, ...bookmarks]
    saveBookmarks(updatedBookmarks)
    return true
  } catch (error) {
    console.error('Error adding bookmark:', error)
    return false
  }
}

export const removeBookmark = (propertyId: string): boolean => {
  try {
    const bookmarks = getBookmarks()
    const updatedBookmarks = bookmarks.filter(b => b.id !== propertyId)
    saveBookmarks(updatedBookmarks)
    return true
  } catch (error) {
    console.error('Error removing bookmark:', error)
    return false
  }
}

export const isBookmarked = (propertyId: string): boolean => {
  const bookmarks = getBookmarks()
  return bookmarks.some(b => b.id === propertyId)
}

export const clearAllBookmarks = (): boolean => {
  try {
    localStorage.removeItem(BOOKMARKS_KEY)
    return true
  } catch (error) {
    console.error('Error clearing bookmarks:', error)
    return false
  }
}
