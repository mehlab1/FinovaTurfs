import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CreditCard, 
  Users, 
  MapPin,
  HelpCircle,
  BookOpen,
  Settings,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      title: "Booking & Reservations",
      icon: BookOpen,
      items: [
        {
          question: "How do I book a turf?",
          answer: "Navigate to 'Book a Turf', select your preferred ground, choose available time slots, and complete the booking with payment. You'll receive instant confirmation."
        },
        {
          question: "Can I book multiple time slots?",
          answer: "Yes! You can select consecutive 30-minute slots to book for longer durations. The system will automatically calculate the total price and duration."
        },
        {
          question: "How far in advance can I book?",
          answer: "You can book up to 30 days in advance. We recommend booking at least 24 hours ahead for better availability, especially for peak hours."
        },
        {
          question: "Can I cancel or modify my booking?",
          answer: "Yes, you can cancel bookings up to 4 hours before the scheduled time. Modifications depend on availability and may incur additional charges."
        }
      ]
    },
    {
      title: "Pricing & Payments",
      icon: CreditCard,
      items: [
        {
          question: "How is pricing calculated?",
          answer: "Pricing is based on base rates, demand multipliers (peak/off-peak), weather conditions, and duration. Peak hours (6-8 PM) cost more than off-peak hours."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, mobile wallets (JazzCash, EasyPaisa), and online banking. Payments are processed securely."
        },
        {
          question: "How do loyalty points work?",
          answer: "Earn 1 point per PKR 100 spent. 50 points = PKR 50 discount. Points can be used for any booking and never expire."
        },
        {
          question: "Are there any hidden charges?",
          answer: "No hidden charges! The price shown includes all taxes and fees. You only pay what's displayed at checkout."
        }
      ]
    },
    {
      title: "Facilities & Grounds",
      icon: MapPin,
      items: [
        {
          question: "What facilities are available at the grounds?",
          answer: "All grounds include changing rooms, parking, drinking water, and basic equipment. Premium grounds may offer additional amenities like cafeterias and equipment rental."
        },
        {
          question: "Do you provide sports equipment?",
          answer: "Basic equipment (footballs, cones) is included. Premium equipment rental is available at select locations for an additional fee."
        },
        {
          question: "Are the grounds weather-proof?",
          answer: "Most grounds are outdoor facilities. We provide real-time weather updates and allow free cancellations for severe weather conditions."
        },
        {
          question: "How do I get to the ground?",
          answer: "Each ground listing includes detailed location information, Google Maps integration, and nearby landmarks for easy navigation."
        }
      ]
    },
    {
      title: "Account & Support",
      icon: Settings,
      items: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' and provide your name, email, phone number, and create a password. Email verification is required to activate your account."
        },
        {
          question: "I forgot my password. What should I do?",
          answer: "Click 'Forgot Password' on the login page, enter your email, and follow the reset instructions sent to your email."
        },
        {
          question: "How do I contact customer support?",
          answer: "Use the chat widget, call our helpline at +92-XXX-XXXXXXX, or email support@finovaturfs.com. We're available 24/7."
        },
        {
          question: "Can I change my booking to a different ground?",
          answer: "Ground changes are subject to availability and may require price adjustments. Contact support within 2 hours of booking for assistance."
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "24/7 customer service",
      contact: "+92-XXX-XXXXXXX",
      color: "from-accent to-green-600"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Response within 2 hours",
      contact: "support@finovaturfs.com",
      color: "from-primary to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant assistance",
      contact: "Available 24/7",
      color: "from-accent to-primary"
    }
  ];

  const quickGuides = [
    {
      title: "First Time Booking",
      steps: ["Create account", "Browse grounds", "Select slots", "Complete payment"],
      icon: BookOpen
    },
    {
      title: "Using Loyalty Points",
      steps: ["Earn points on bookings", "Toggle during checkout", "Save instantly", "Track balance"],
      icon: Star
    },
    {
      title: "Group Bookings",
      steps: ["Select multiple slots", "Contact for discounts", "Coordinate timing", "Split payments"],
      icon: Users
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <HelpCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">How can we help you?</h1>
            <p className="text-gray-400 text-lg">Find answers to frequently asked questions or contact our support team</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 text-lg bg-gray-800 border-gray-700 glassmorphic"
              />
            </div>
          </motion.div>

          {/* Quick Guides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Quick Start Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickGuides.map((guide, index) => (
                <Card key={guide.title} className="glassmorphic border-gray-700 hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-6">
                    <guide.icon className="w-8 h-8 text-accent mb-4" />
                    <h3 className="font-semibold text-white mb-3">{guide.title}</h3>
                    <ol className="space-y-2">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-gray-400 flex items-center">
                          <span className="w-5 h-5 bg-accent text-black rounded-full text-xs flex items-center justify-center mr-2 font-medium">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Contact Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={method.title} className="glassmorphic border-gray-700 hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${method.color} bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <method.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{method.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{method.description}</p>
                    <p className="text-accent font-medium">{method.contact}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* FAQ Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
            
            {filteredFAQs.length === 0 && searchTerm && (
              <Card className="glassmorphic border-gray-700">
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
                  <p className="text-gray-400">Try searching with different keywords or contact our support team</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => (
                <Card key={category.title} className="glassmorphic border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <category.icon className="w-5 h-5 mr-3 text-accent" />
                      {category.title}
                      <Badge variant="secondary" className="ml-auto">
                        {category.items.length} questions
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`} className="border-gray-700">
                          <AccordionTrigger className="text-left hover:text-accent transition-colors duration-300">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-400 leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Still Need Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12"
          >
            <Card className="glassmorphic border-gray-700 text-center">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Still need help?</h3>
                <p className="text-gray-400 mb-6">Our support team is ready to assist you 24/7</p>
                <Button className="bg-gradient-to-r from-accent to-primary text-white">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
