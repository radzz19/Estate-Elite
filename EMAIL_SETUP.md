# EmailJS Setup Instructions

## 1. EmailJS Account Setup

1. Go to [EmailJS.com](https://www.emailjs.com/) and create an account
2. Create a new email service with service ID: `service_u9i2div`
3. Create an email template with template ID: `template_s7n7rlo`

## 2. Email Template Configuration

Use this HTML template in your EmailJS template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Property Inquiry</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
        .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .value { color: #333; }
        .message-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .property-link { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 New Property Inquiry</h1>
            <p>You have received a new inquiry from your website</p>
        </div>
        
        <div class="content">
            <h2>Contact Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Full Name</div>
                    <div class="value">{{user_name}}</div>
                </div>
                <div class="info-item">
                    <div class="label">Email Address</div>
                    <div class="value">{{user_email}}</div>
                </div>
                <div class="info-item">
                    <div class="label">Phone Number</div>
                    <div class="value">{{user_phone}}</div>
                </div>
                <div class="info-item">
                    <div class="label">Inquiry Type</div>
                    <div class="value">{{inquiry_type}}</div>
                </div>
            </div>
            
            <h2>Property Details</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Property Title</div>
                    <div class="value">{{property_title}}</div>
                </div>
                <div class="info-item">
                    <div class="label">Location</div>
                    <div class="value">{{property_location}}</div>
                </div>
                <div class="info-item">
                    <div class="label">Price Range</div>
                    <div class="value">{{property_price}}</div>
                </div>
                <div class="info-item">
                    <div class="label">Property Type</div>
                    <div class="value">{{property_type}}</div>
                </div>
            </div>
            
            <div class="message-section">
                <h3>Customer Message</h3>
                <p>{{message}}</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{property_link}}" class="property-link">View Property/Website</a>
            </div>
            
            <div class="footer">
                <p>This inquiry was sent from your real estate website.</p>
                <p>Please respond to the customer within 24 hours for the best experience.</p>
            </div>
        </div>
    </div>
</body>
</html>
```

## 3. Environment Variables

Add these to your `.env.local` file:

```
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=BzSR-v7E37vg6FpKK
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_u9i2div
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_s7n7rlo
```

## 4. Features Implemented

### Main Page (Hero Section)
- ✅ Contact dialog with full inquiry form
- ✅ EmailJS integration with fallback to mailto
- ✅ Location, price range, and property type filters
- ✅ Direct link to listings page
- ✅ Responsive design matching theme

### Listings Page
- ✅ Enhanced UI with gradient theme matching main site
- ✅ Bookmark functionality with browser localStorage
- ✅ "All Properties" and "Bookmarked" tabs
- ✅ Individual property inquiry forms with EmailJS
- ✅ Property cards with bookmark heart icons
- ✅ Search and filter functionality

### Bookmark System
- ✅ Add/remove bookmarks with heart icon
- ✅ Persistent storage in browser localStorage
- ✅ Bookmark counter and management
- ✅ Cross-browser compatibility

### Email System
- ✅ EmailJS integration for professional emails
- ✅ Comprehensive email template with all user info
- ✅ Fallback to mailto if EmailJS fails
- ✅ Toast notifications for user feedback
- ✅ Contact forms on both main page and individual properties

## 5. Testing Checklist

1. **Main Page Contact Form**
   - [ ] Fill out the form and submit
   - [ ] Check if email is received with all information
   - [ ] Test fallback mailto functionality

2. **Listings Page**
   - [ ] Navigate to /listings
   - [ ] Test bookmark functionality (heart icons)
   - [ ] Switch between "All Properties" and "Bookmarked" tabs
   - [ ] Test individual property inquiries

3. **Email Template**
   - [ ] Verify all placeholders are filled correctly
   - [ ] Check email formatting and styling
   - [ ] Test on different email clients

## 6. Deployment Notes

- The bookmark data is stored locally in the browser
- EmailJS requires internet connection to function
- Make sure to configure your EmailJS account with the exact service and template IDs
- Test thoroughly in production environment

## 7. Support

If you need any adjustments or additional features, the codebase is now fully integrated and ready for customization.
