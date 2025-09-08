import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I start the home buying process?",
    answer:
      "Begin by getting pre-approved for a mortgage to understand your budget. Then, contact our team to discuss your preferences and requirements. We'll help you identify suitable properties and guide you through every step of the process.",
  },
  {
    question: "What documents do I need to buy a property?",
    answer:
      "You'll typically need proof of income, bank statements, tax returns, employment verification, and identification. Our team will provide you with a comprehensive checklist based on your specific situation and the property type.",
  },
  {
    question: "How long does the buying process take?",
    answer:
      "The timeline varies depending on factors like financing, inspections, and negotiations. Typically, it takes 30-45 days from offer acceptance to closing. Cash purchases can be completed faster, sometimes within 2-3 weeks.",
  },
  {
    question: "Do you help with property inspections?",
    answer:
      "Yes, we coordinate professional property inspections and help you understand the results. We work with trusted inspectors who provide detailed reports on the property's condition, helping you make informed decisions.",
  },
  {
    question: "What are your commission rates?",
    answer:
      "Our commission structure is competitive and transparent. We offer different service packages to meet various needs and budgets. Contact us for a detailed discussion about our fees and what's included in our services.",
  },
  {
    question: "Do you assist with investment properties?",
    answer:
      "We specialize in investment properties and can help you analyze potential returns, market trends, and rental income projections. Our team has extensive experience in investment real estate across various markets.",
  },
]

export default function FAQ() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get answers to common questions about buying, selling, and investing in real estate
          </p>
        </div>

        <div className="animate-slide-up">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-lg px-6 border border-border shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
