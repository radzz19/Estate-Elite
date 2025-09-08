import emailjs from '@emailjs/browser'

// EmailJS configuration - using environment variables with fallbacks
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_u9i2div'
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_69x46qh'
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'BzSR-v7E37vg6FpKK'

console.log('Environment variables loaded:', {
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'PRESENT' : 'MISSING'
})

// Initialize EmailJS
export const initializeEmailJS = () => {
  const publicKey = EMAILJS_PUBLIC_KEY
  console.log('Initializing EmailJS with public key:', publicKey)
  
  if (!publicKey) {
    console.error('EmailJS public key is missing!')
    return false
  }
  
  try {
    emailjs.init(publicKey)
    console.log('EmailJS initialized successfully')
    
    // Run configuration test
    testEmailJSConfig()
    return true
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error)
    return false
  }
}

// Email template parameters interface
export interface EmailParams {
  user_name: string
  user_email: string
  user_phone: string
  property_title: string
  property_location: string
  property_price: string
  property_type: string
  property_link: string
  message: string
  inquiry_type: 'property_detail' | 'listing_page' | 'main_page'
}

// Send inquiry email
export const sendInquiryEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    console.log('EmailJS Config:', {
      service: EMAILJS_SERVICE_ID,
      template: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY,
      hasService: !!EMAILJS_SERVICE_ID,
      hasTemplate: !!EMAILJS_TEMPLATE_ID,
      hasKey: !!EMAILJS_PUBLIC_KEY
    })
    console.log('Email Parameters:', params)
    
    // Validate configuration
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS configuration incomplete:', {
        service: EMAILJS_SERVICE_ID,
        template: EMAILJS_TEMPLATE_ID,
        key: EMAILJS_PUBLIC_KEY
      })
      return false
    }
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        user_name: params.user_name,
        user_email: params.user_email,
        user_phone: params.user_phone,
        property_title: params.property_title,
        property_location: params.property_location,
        property_price: params.property_price,
        property_type: params.property_type,
        property_link: params.property_link,
        message: params.message,
        inquiry_type: params.inquiry_type,
        timestamp: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }
    )
    
    console.log('Email sent successfully:', response)
    return true
  } catch (error) {
    console.error('Failed to send email - Full error details:', error)
    
    // Log specific error information
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error name:', error.name)
    }
    
    // Check if it's a network error
    if (error && typeof error === 'object' && 'status' in error) {
      console.error('HTTP Status:', (error as any).status)
      console.error('Response text:', (error as any).text)
    }
    
    return false
  }
}

// Email template for EmailJS setup
export const getEmailTemplate = () => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Property Inquiry</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .property-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #3b82f6; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .label { font-weight: bold; color: #1e3a8a; }
        .value { margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏡 New Property Inquiry</h1>
            <p>You have received a new inquiry from your real estate website</p>
        </div>
        
        <div class="content">
            <h2>👤 Customer Information</h2>
            <div class="value"><span class="label">Name:</span> {{user_name}}</div>
            <div class="value"><span class="label">Email:</span> {{user_email}}</div>
            <div class="value"><span class="label">Phone:</span> {{user_phone}}</div>
            
            <div class="property-details">
                <h3>🏠 Property Details</h3>
                <div class="value"><span class="label">Property:</span> {{property_title}}</div>
                <div class="value"><span class="label">Location:</span> {{property_location}}</div>
                <div class="value"><span class="label">Price:</span> {{property_price}}</div>
                <div class="value"><span class="label">Type:</span> {{property_type}}</div>
                <div class="value"><span class="label">Property Link:</span> <a href="{{property_link}}">View Property</a></div>
                <div class="value"><span class="label">Inquiry Source:</span> {{inquiry_type}}</div>
            </div>
            
            <h3>💬 Customer Message</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #d1d5db;">
                {{message}}
            </div>
            
            <div class="value" style="margin-top: 20px;">
                <span class="label">Inquiry Time:</span> {{timestamp}}
            </div>
        </div>
        
        <div class="footer">
            <p>🚀 Real Estate Platform - Professional Property Management</p>
            <p>This inquiry was sent through your website's contact form</p>
        </div>
    </div>
</body>
</html>
  `.trim()
}

// Test EmailJS configuration
export const testEmailJSConfig = () => {
  console.log('Testing EmailJS Configuration:')
  console.log('Service ID:', EMAILJS_SERVICE_ID)
  console.log('Template ID:', EMAILJS_TEMPLATE_ID)
  console.log('Public Key:', EMAILJS_PUBLIC_KEY ? `${EMAILJS_PUBLIC_KEY.substring(0, 8)}...` : 'NOT SET')
  console.log('EmailJS object:', emailjs)
  
  // Test if emailjs is properly imported
  if (typeof emailjs.send !== 'function') {
    console.error('EmailJS send function not available!')
    return false
  }
  
  console.log('EmailJS configuration looks good!')
  return true
}

// Configuration instructions
export const getSetupInstructions = () => {
  return {
    emailjs_setup: {
      service_id: 'service_u9i2div',
      template_id: 'template_inquiry',
      public_key: 'YOUR_PUBLIC_KEY',
      steps: [
        '1. Create an account at https://emailjs.com',
        '2. Create a new email service (Gmail, Outlook, etc.)',
        '3. Create a new email template using the template above',
        '4. Replace YOUR_PUBLIC_KEY with your actual public key',
        '5. Update the to_email field with your email address',
        '6. Test the integration'
      ]
    },
    template_variables: [
      '{{from_name}} - Customer name',
      '{{from_email}} - Customer email',
      '{{phone}} - Customer phone',
      '{{property_title}} - Property title',
      '{{property_location}} - Property location',
      '{{property_price}} - Property price',
      '{{property_type}} - Sale or Rent',
      '{{property_link}} - Direct link to property',
      '{{inquiry_type}} - Source of inquiry',
      '{{message}} - Customer message',
      '{{timestamp}} - When inquiry was sent'
    ]
  }
}
