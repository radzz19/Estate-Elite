# EmailJS Template Setup Instructions

## 📧 Quick Template Setup

### Step 1: Create EmailJS Template
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Click "Email Templates" → "Create New Template"
3. Use this simple template:

```html
<h2>🏡 New Property Inquiry</h2>

<h3>Customer Details:</h3>
<p><strong>Name:</strong> {{user_name}}</p>
<p><strong>Email:</strong> {{user_email}}</p>
<p><strong>Phone:</strong> {{user_phone}}</p>

<h3>Property Requirements:</h3>
<p><strong>Interest:</strong> {{property_title}}</p>
<p><strong>Location:</strong> {{property_location}}</p>
<p><strong>Budget:</strong> {{property_price}}</p>
<p><strong>Type:</strong> {{property_type}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<p><strong>Received:</strong> {{timestamp}}</p>
<p><strong>Source:</strong> {{inquiry_type}}</p>
<p><strong>Website:</strong> {{property_link}}</p>
```

### Step 2: Configure Template
- **Template Name**: "Property Inquiry Template"
- **Subject**: "New Property Inquiry from {{user_name}}"
- **To Email**: Your email address where you want to receive inquiries

### Step 3: Get Template ID
After saving, copy the Template ID (format: template_xxxxxx)

### Step 4: Update Configuration
Once you have the Template ID, tell me and I'll update the code!

## 🔧 Current Variables Used
- `{{user_name}}` - Customer name
- `{{user_email}}` - Customer email  
- `{{user_phone}}` - Customer phone
- `{{property_title}}` - Type of inquiry
- `{{property_location}}` - Preferred location
- `{{property_price}}` - Budget range
- `{{property_type}}` - Property type preference
- `{{message}}` - Customer message
- `{{inquiry_type}}` - Source (main_page, listings, property_detail)
- `{{timestamp}}` - When inquiry was sent
- `{{property_link}}` - Website URL

## ✅ Ready to Test
After you create the template and provide the Template ID, the main page contact form will work immediately!
