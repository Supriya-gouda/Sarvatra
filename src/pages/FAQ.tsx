import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQ() {
  const faqs = [
    {
      question: "How do I report a disaster?",
      answer:
        "Navigate to the 'Report' page, fill in the disaster type, location, and description. You can use your current GPS location or manually enter coordinates. Adding photos helps authorities verify the situation faster.",
    },
    {
      question: "Are my reports anonymous?",
      answer:
        "You can choose to report anonymously. However, providing contact information helps authorities reach you if they need more details or need to provide assistance.",
    },
    {
      question: "What is the trust score?",
      answer:
        "The trust score is an AI-powered metric that evaluates the credibility of citizen reports based on factors like location accuracy, sentiment analysis, and consistency with other reports. It helps authorities prioritize verified information.",
    },
    {
      question: "How quickly are alerts sent?",
      answer:
        "Official alerts are broadcast immediately after verification. Citizen reports are reviewed and verified by authorities, which typically takes 5-15 minutes depending on the situation.",
    },
    {
      question: "What types of disasters are covered?",
      answer:
        "The platform covers floods, earthquakes, fires, cyclones, landslides, and other natural or man-made disasters. You can also report 'Other' types of emergencies.",
    },
    {
      question: "How do I know if I'm in a danger zone?",
      answer:
        "The platform sends push notifications for alerts in your area. You can also check the 'My Alerts' page or view the real-time map to see active disaster zones near you.",
    },
    {
      question: "Can I update my safety status?",
      answer:
        "Yes! On the 'My Alerts' page, you can respond to active alerts with 'I'm Safe', 'Need Help', or 'False Alarm'. This helps authorities understand the situation better.",
    },
    {
      question: "What is the Risk Gauge?",
      answer:
        "The Risk Gauge is a comprehensive confidence index (0-100) that combines weather data, citizen reports, social sentiment, and official alerts to provide an overall disaster risk assessment.",
    },
    {
      question: "How can authorities access the platform?",
      answer:
        "Emergency management personnel can log in through the 'Authority Portal' with their official credentials to access the comprehensive dashboard and coordination tools.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use industry-standard encryption and security measures. Personal information is only shared with authorized emergency personnel when necessary for your safety.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about the Smart Alert Platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you couldn't find the answer you're looking for, please contact our support team.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Emergency Helpline:</strong> 1800-XXX-XXXX
              </p>
              <p>
                <strong>Email:</strong> emergency@smartalert.gov
              </p>
              <p>
                <strong>Hours:</strong> 24/7 Emergency Response
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
