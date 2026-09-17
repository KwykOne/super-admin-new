
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Video,
  Globe
} from "lucide-react";

// Mock FAQ data
const faqs = [
  {
    question: "How do I add a new seller to the platform?",
    answer: "Go to the Sellers page and click on the 'Add Seller' button. Fill in the required information and submit the form. The new seller will receive an invitation email with instructions to complete their registration."
  },
  {
    question: "How can I change the status of an order?",
    answer: "Navigate to the Orders page, find the order you want to modify, and click on the Status dropdown menu. Select the new status and confirm the change. The seller and the customer will be notified automatically."
  },
  {
    question: "How do I run financial reports for a specific period?",
    answer: "Visit the Revenue page and use the date range selector to specify the time period. Then click on 'Generate Report'. You can export the report in various formats including PDF, Excel, or CSV."
  },
  {
    question: "How can I grant admin access to a team member?",
    answer: "Go to the Team Management page, click on 'Add Team Member', and fill in their details. Select the appropriate role that determines their access level. Once added, they will receive an email with login instructions."
  },
  {
    question: "What's the difference between test stores and actual stores?",
    answer: "Test stores are created for internal testing and don't generate actual revenue or orders that count towards your business metrics. They are identified with a 'Test' badge in listings. You can toggle between viewing test stores, actual stores, or both using the filter at the top of the dashboard."
  },
  {
    question: "How do I update subscription plans for sellers?",
    answer: "Navigate to the Sellers page, find the seller whose plan you want to change, click on the Actions menu, and select 'Change Plan'. Choose the new plan and confirm the change. The seller will be notified and their billing will be adjusted accordingly."
  },
  {
    question: "How do I view a seller's store as a customer?",
    answer: "On the Sellers page, find the seller and click the 'View Store' button from the Actions menu. This will open their customer-facing store in a new tab, allowing you to browse as a regular customer would."
  },
];

// Mock tutorial data
const tutorials = [
  {
    id: 1,
    title: "Getting Started with the Super Admin Dashboard",
    description: "Learn the basics of navigating and using the BharatGo Super Admin dashboard",
    duration: "5 min",
    type: "video"
  },
  {
    id: 2,
    title: "Managing Sellers and Onboarding",
    description: "Complete guide to seller management and onboarding processes",
    duration: "8 min",
    type: "article"
  },
  {
    id: 3,
    title: "Order Management and Fulfillment",
    description: "Learn how to monitor and manage orders across all stores",
    duration: "7 min",
    type: "video"
  },
  {
    id: 4,
    title: "Revenue Analytics and Reporting",
    description: "Deep dive into financial metrics and reporting capabilities",
    duration: "10 min",
    type: "article"
  },
  {
    id: 5,
    title: "Team Permissions and Access Control",
    description: "How to set up roles and permissions for your team",
    duration: "6 min",
    type: "video"
  },
  {
    id: 6,
    title: "Testing Stores vs. Production Stores",
    description: "Understanding the difference and how to manage both",
    duration: "4 min",
    type: "article"
  },
];

export default function Help() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faq");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutorials = tutorials.filter(tutorial => 
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support request sent", {
      description: "We've received your message and will get back to you shortly.",
    });
  };

  return (
    <DashboardLayout title="Help & Support" subtitle="Find answers and get assistance">
      <div className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search for help, tutorials, FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle size={16} />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <Book size={16} />
            <span>Tutorials</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Contact</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions about the BharatGo Super Admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-6 bg-gray-100 rounded animate-pulse w-3/4" />
                      <div className="h-20 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : filteredFaqs.length === 0 ? (
                <div className="text-center py-10">
                  <HelpCircle className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No Results Found</h3>
                  <p className="text-gray-500 mt-2">
                    Try searching with different keywords or browse all FAQs
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tutorials" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tutorials & Guides</CardTitle>
              <CardDescription>
                Step-by-step tutorials and guides to help you make the most of BharatGo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : filteredTutorials.length === 0 ? (
                <div className="text-center py-10">
                  <Book className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No Tutorials Found</h3>
                  <p className="text-gray-500 mt-2">
                    Try searching with different keywords or browse all tutorials
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTutorials.map((tutorial) => (
                    <Card key={tutorial.id} className="overflow-hidden">
                      <div className="bg-gray-100 h-40 flex items-center justify-center">
                        {tutorial.type === "video" ? (
                          <Video className="h-12 w-12 text-bharatgo-primary opacity-50" />
                        ) : (
                          <FileText className="h-12 w-12 text-bharatgo-primary opacity-50" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="outline" className={
                          tutorial.type === "video" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }>
                          {tutorial.type === "video" ? "Video" : "Article"} • {tutorial.duration}
                        </Badge>
                        <h3 className="font-medium text-lg mt-2">{tutorial.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{tutorial.description}</p>
                        <Button variant="link" className="p-0 h-auto mt-2">
                          {tutorial.type === "video" ? "Watch now" : "Read article"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Send us a message and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name
                      </label>
                      <Input id="name" placeholder="Enter your name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input id="email" type="email" placeholder="Enter your email" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="What is your question about?" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe your issue in detail"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <Select defaultValue="low">
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General question</SelectItem>
                        <SelectItem value="medium">Medium - Need help soon</SelectItem>
                        <SelectItem value="high">High - Facing issues</SelectItem>
                        <SelectItem value="critical">Critical - System down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Submit Support Request
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Other Ways to Reach Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-bharatgo-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Call Us</h4>
                      <p className="text-gray-500 text-sm">
                        +91 1800-267-2390<br />
                        Mon-Fri, 9am-6pm IST
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-bharatgo-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Email Us</h4>
                      <p className="text-gray-500 text-sm">
                        support@bharatgo.com<br />
                        We respond within 24 hours
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-bharatgo-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Visit Our Help Center</h4>
                      <p className="text-gray-500 text-sm">
                        Browse our knowledge base for<br />
                        detailed articles and guides
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-1">
                        Visit Help Center
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Live Chat Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-bharatgo-primary opacity-60 mb-3" />
                  <p className="text-gray-500 mb-4">
                    Get immediate assistance from our support team through live chat
                  </p>
                  <Button>
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
