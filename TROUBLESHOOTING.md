# EmailJS Troubleshooting Guide

## ✅ Current Configuration
- **Service ID**: `service_u9i2div`
- **Template ID**: `template_69x46qh`
- **Public Key**: `BzSR-v7E37vg6FpKK`

## 🔍 Steps to Verify EmailJS Setup

### 1. Check EmailJS Dashboard
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Verify your **Email Services** section has service ID: `service_u9i2div`
3. Verify your **Email Templates** section has template ID: `template_69x46qh`
4. Check **Integration** section for public key: `BzSR-v7E37vg6FpKK`

### 2. Template Variables to Add in EmailJS
Make sure your EmailJS template (`template_69x46qh`) includes these variables:
```
{{user_name}}
{{user_email}}
{{user_phone}}
{{property_title}}
{{property_location}}
{{property_price}}
{{property_type}}
{{property_link}}
{{message}}
{{inquiry_type}}
{{timestamp}}
```

### 3. Email Service Configuration
- Make sure your email service (Gmail/Outlook/etc.) is properly connected
- Test the service connection in EmailJS dashboard
- Ensure the service is not in test mode if you want real emails

### 4. Common Issues & Solutions

#### "Failed to fetch" Error
- **Cause**: Network/CORS issues or invalid credentials
- **Solution**: 
  1. Check browser console for detailed error messages
  2. Verify public key is correct (case-sensitive)
  3. Ensure template ID matches exactly (case-sensitive)
  4. Test in EmailJS dashboard first

#### Template Variables Not Working
- **Cause**: Variable names don't match
- **Solution**: Copy template variables exactly as shown above

#### Emails Not Received
- **Cause**: Service not properly configured
- **Solution**: 
  1. Check EmailJS service connection
  2. Verify destination email address
  3. Check spam folder
  4. Test with EmailJS dashboard test feature

### 5. Testing Steps
1. **Console Check**: Open browser developer tools → Console tab
2. **Test Contact Form**: Fill out and submit inquiry forms
3. **Check Logs**: Look for debug messages in console:
   ```
   EmailJS Config: {service: "service_u9i2div", template: "template_69x46qh", ...}
   Email Parameters: {user_name: "...", user_email: "...", ...}
   ```

### 6. Fallback Behavior
If EmailJS fails, the system automatically:
1. Opens default email client (mailto)
2. Pre-fills subject and body with inquiry details
3. Shows toast notification to user

## 🚨 If Still Not Working
1. Check browser console for specific error messages
2. Test EmailJS directly in their dashboard
3. Verify all credentials are correct and match your account
4. Ensure EmailJS service is active and not suspended

## 📧 Current Email Features Working
- ✅ Main page contact form
- ✅ Listings page property inquiries  
- ✅ Property detail page inquiry forms
- ✅ Bookmark system with localStorage
- ✅ Responsive design and UI improvements

**Next Step**: Test the contact forms and check browser console for any error messages.
