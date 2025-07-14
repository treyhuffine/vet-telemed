'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  ArrowLeft,
  Search,
  Book,
  Video,
  FileText,
  MessageCircle,
  Users,
  Settings,
  Shield,
  Stethoscope,
  Activity,
  HelpCircle,
  ExternalLink,
  PlayCircle,
  Download,
  ChevronRight
} from 'lucide-react';
import { useVetAuth } from '@/context/VetAuth';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  videoUrl?: string;
  downloadUrl?: string;
  tags: string[];
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const helpArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'Getting Started with EmergencyVet',
    category: 'Getting Started',
    content: 'Learn the basics of using EmergencyVet platform for emergency veterinary care...',
    videoUrl: 'https://example.com/video1',
    tags: ['basics', 'onboarding', 'setup'],
  },
  {
    id: '2',
    title: 'Creating and Managing Patient Profiles',
    category: 'Patient Management',
    content: 'How to create new patient profiles, update information, and manage pet records...',
    tags: ['patients', 'profiles', 'records'],
  },
  {
    id: '3',
    title: 'Recording and Tracking Vitals',
    category: 'Clinical Features',
    content: 'Step-by-step guide to recording vital signs and understanding triage levels...',
    tags: ['vitals', 'triage', 'clinical'],
  },
  {
    id: '4',
    title: 'Video Consultation Best Practices',
    category: 'Video Calls',
    content: 'Tips for conducting effective video consultations with remote veterinarians...',
    videoUrl: 'https://example.com/video2',
    tags: ['video', 'consultation', 'communication'],
  },
  {
    id: '5',
    title: 'Writing SOAP Notes',
    category: 'Documentation',
    content: 'Guidelines for creating comprehensive SOAP notes for patient records...',
    downloadUrl: 'https://example.com/soap-template.pdf',
    tags: ['documentation', 'soap', 'notes'],
  },
  {
    id: '6',
    title: 'Managing User Permissions',
    category: 'Administration',
    content: 'How to add users, assign roles, and manage permissions in your clinic...',
    tags: ['admin', 'users', 'permissions'],
  },
];

const faqs: FAQ[] = [
  {
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot password?" on the login page. Enter your email address and we\'ll send you a reset code.',
    category: 'Account',
  },
  {
    question: 'What are the different triage levels?',
    answer: 'Red (Critical): Life-threatening conditions requiring immediate attention. Yellow (Urgent): Serious conditions needing prompt care within 30 minutes. Green (Non-urgent): Stable conditions that can wait.',
    category: 'Clinical',
  },
  {
    question: 'How do I transfer a case to another veterinarian?',
    answer: 'Open the case details, click on "Transfer Case", select the veterinarian, provide a reason, and confirm the transfer.',
    category: 'Cases',
  },
  {
    question: 'Can I export patient records?',
    answer: 'Yes, from the case summary screen, click the "Export" button to generate a PDF of the complete case record.',
    category: 'Records',
  },
  {
    question: 'What browsers are supported?',
    answer: 'EmergencyVet works best with Chrome, Firefox, Safari, and Edge. Ensure your browser is up to date for the best experience.',
    category: 'Technical',
  },
  {
    question: 'How do I report a technical issue?',
    answer: 'Use the Feedback button at the bottom right of any screen to report bugs or technical issues.',
    category: 'Support',
  },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: Book },
    { id: 'Getting Started', label: 'Getting Started', icon: Activity },
    { id: 'Patient Management', label: 'Patient Management', icon: Users },
    { id: 'Clinical Features', label: 'Clinical Features', icon: Stethoscope },
    { id: 'Video Calls', label: 'Video Calls', icon: Video },
    { id: 'Documentation', label: 'Documentation', icon: FileText },
    { id: 'Administration', label: 'Administration', icon: Shield },
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => 
    searchQuery === '' ||
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'vet_tech':
        return {
          title: 'Vet Tech Resources',
          articles: ['1', '2', '3', '4'],
        };
      case 'vet':
        return {
          title: 'Veterinarian Resources',
          articles: ['4', '5'],
        };
      case 'admin':
        return {
          title: 'Administrator Resources',
          articles: ['6'],
        };
      default:
        return null;
    }
  };

  const roleContent = getRoleSpecificContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
                <p className="text-sm text-gray-600 mt-1">Find answers and learn how to use EmergencyVet</p>
              </div>
            </div>
            <Button>
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help articles, guides, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="articles" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="articles">Help Articles</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-6">
              {/* Categories */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>

              {/* Role-specific content */}
              {roleContent && searchQuery === '' && selectedCategory === 'all' && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">{roleContent.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {helpArticles
                        .filter(article => roleContent.articles.includes(article.id))
                        .map(article => (
                          <Button
                            key={article.id}
                            variant="outline"
                            className="justify-start bg-white"
                            onClick={() => router.push(`/help/article/${article.id}`)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {article.title}
                          </Button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map(article => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/help/article/${article.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {article.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
                      <div className="flex items-center gap-2 mt-3">
                        {article.videoUrl && (
                          <Badge variant="outline" className="text-xs">
                            <Video className="mr-1 h-3 w-3" />
                            Video
                          </Badge>
                        )}
                        {article.downloadUrl && (
                          <Badge variant="outline" className="text-xs">
                            <Download className="mr-1 h-3 w-3" />
                            Download
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
                  <p className="mt-1 text-gray-600">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="faqs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {filteredFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-start gap-3">
                            <HelpCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-8">
                          <p className="text-gray-600">{faq.answer}</p>
                          <Badge variant="outline" className="mt-2">
                            {faq.category}
                          </Badge>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {helpArticles
                  .filter(article => article.videoUrl)
                  .map(article => (
                    <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                          <PlayCircle className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{article.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Links */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <MessageCircle className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Contact Support</p>
                    <p className="text-sm text-gray-600">Get help from our team</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <Book className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">User Guide</p>
                    <p className="text-sm text-gray-600">Download the complete guide</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <Video className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Training Videos</p>
                    <p className="text-sm text-gray-600">Watch video tutorials</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}