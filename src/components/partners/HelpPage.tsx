import * as React from 'react'
import { useState } from 'react'
import {
  HelpCircle,
  Book,
  MessageSquare,
  Video,
  FileText,
  Search,
  ChevronRight,
  
  Mail,
  Phone,
  Clock,
  Users,
  Zap,
  FileSearch,
  Building2,
  DollarSign,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Accordion } from '../ui/Accordion'

// =============================================================================
// TYPES
// =============================================================================

export interface HelpArticle {
  id: string
  title: string
  description: string
  category: string
  icon?: React.ReactNode
  href?: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface HelpPageProps {
  /** Help articles to display (uses defaults if not provided) */
  articles?: HelpArticle[]
  /** FAQ items to display (uses defaults if not provided) */
  faqs?: FAQItem[]
  /** Additional className */
  className?: string
  /** Callback when article is clicked */
  onArticleClick?: (article: HelpArticle) => void
  /** Callback when contact support is clicked */
  onContactSupport?: () => void
  /** Callback when search is performed */
  onSearch?: (query: string) => void
}

// =============================================================================
// DEFAULT DATA (exported for consumers)
// =============================================================================

export const DEFAULT_HELP_ARTICLES: HelpArticle[] = [
  {
    id: '1',
    title: 'Getting Started with Partner Portal',
    description: 'Learn the basics of navigating and using the Partner Portal',
    category: 'Getting Started',
    icon: <Book className="w-5 h-5" />,
  },
  {
    id: '2',
    title: 'Managing Your Leads',
    description: 'How to create, track, and convert leads effectively',
    category: 'Leads',
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: '3',
    title: 'Tenant Provisioning Guide',
    description: 'Step-by-step guide to provisioning new tenants',
    category: 'Tenants',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: '4',
    title: 'Understanding Invoices',
    description: 'How invoices are generated and managed',
    category: 'Billing',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: '5',
    title: 'Partner Network Management',
    description: 'Managing your partner hierarchy and sub-partners',
    category: 'Partners',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: '6',
    title: 'Using the Pricing Calculator',
    description: 'Calculate pricing for potential tenants',
    category: 'Tools',
    icon: <DollarSign className="w-5 h-5" />,
  },
]

export const DEFAULT_HELP_FAQS: FAQItem[] = [
  {
    question: 'How do I create a new tenant?',
    answer:
      'Navigate to Tenant Provisioning from the sidebar. You can either use the Chat Assistant for guided setup or the Manual Wizard for full control. Both methods will walk you through company info, contact details, and pricing selection.',
  },
  {
    question: 'What is my commission rate?',
    answer:
      "Commission rates vary based on your partner tier. Standard partners receive 10%, Premium partners receive 15%, and Enterprise partners receive 20%. You can view your current rate in the Pricing Calculator or contact your account manager for details.",
  },
  {
    question: 'How do I track my leads?',
    answer:
      "The Leads page shows all your leads with their current status, priority, and value. You can filter by status, search by name or company, and click on any lead to view details or update their status.",
  },
  {
    question: 'When are invoices generated?',
    answer:
      'Invoices are automatically generated when a tenant provisioning request is completed. You can view all invoices in the Invoices section, filter by status, and download PDFs for your records.',
  },
  {
    question: 'How do I add a sub-partner?',
    answer:
      "Go to Partner Network and click 'Add Sub-Partner'. Fill in their company details and contact information. Once created, they'll appear in your partner hierarchy and you'll earn commissions on their tenant provisioning.",
  },
  {
    question: 'Can I edit a tenant request after submission?',
    answer:
      "Yes, you can edit tenant requests that are still in 'Pending Payment' or 'In Review' status. Click on the request to open the details sheet, then use the Edit tab to make changes.",
  },
]

// =============================================================================
// HELP PAGE COMPONENT
// =============================================================================

export function HelpPage({
  articles = DEFAULT_HELP_ARTICLES,
  faqs = DEFAULT_HELP_FAQS,
  className,
  onArticleClick,
  onContactSupport,
  onSearch,
}: HelpPageProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <div className={cn('flex flex-col gap-6 p-6', className)}>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-semibold text-primary">How can we help you?</h1>
        <p className="text-secondary mt-2">
          Search our knowledge base or browse popular topics below
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none z-10" />
            <Input
              type="search"
              placeholder="Search for help..."
              className="pl-10 pr-4 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          className="bg-surface border-default hover:border-accent hover:shadow-md transition-all cursor-pointer"
          onClick={() =>
            onArticleClick?.({
              id: 'docs',
              title: 'Documentation',
              description: 'Browse all documentation',
              category: 'Docs',
            })
          }
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-info-light flex items-center justify-center flex-shrink-0">
              <Book className="w-6 h-6 text-info" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-primary">Documentation</h3>
              <p className="text-sm text-secondary">Browse guides and tutorials</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </CardContent>
        </Card>

        <Card
          className="bg-surface border-default hover:border-accent hover:shadow-md transition-all cursor-pointer"
          onClick={() =>
            onArticleClick?.({
              id: 'videos',
              title: 'Video Tutorials',
              description: 'Watch video guides',
              category: 'Videos',
            })
          }
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-info-light flex items-center justify-center flex-shrink-0">
              <Video className="w-6 h-6 text-info" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-primary">Video Tutorials</h3>
              <p className="text-sm text-secondary">Watch step-by-step guides</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </CardContent>
        </Card>

        <Card
          className="bg-surface border-default hover:border-accent hover:shadow-md transition-all cursor-pointer"
          onClick={onContactSupport}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning-light flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-primary">Contact Support</h3>
              <p className="text-sm text-secondary">Get help from our team</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </CardContent>
        </Card>
      </div>

      {/* Popular Articles */}
      <Card className="bg-surface border-default">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-accent" />
            Popular Articles
          </CardTitle>
          <CardDescription>Commonly accessed help topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {articles.map((article) => (
              <button
                key={article.id}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors text-left group"
                onClick={() => onArticleClick?.(article)}
              >
                <div className="w-10 h-10 rounded-lg bg-muted-bg group-hover:bg-info-light flex items-center justify-center flex-shrink-0 text-muted group-hover:text-info transition-colors">
                  {article.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-primary group-hover:text-accent transition-colors">{article.title}</h4>
                  <p className="text-sm text-secondary truncate">{article.description}</p>
                </div>
                <span className="text-xs text-muted bg-muted-bg px-2.5 py-1 rounded-md font-medium">
                  {article.category}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="bg-surface border-default">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion items={faqs} allowMultiple={false} />
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="bg-accent/10 border-accent/30">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-lg font-semibold text-primary">Still need help?</h3>
              <p className="text-secondary mt-1">
                Our support team is available Monday through Friday, 9am-6pm EST.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Mail className="w-4 h-4 text-accent" />
                <span>support@partner.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Phone className="w-4 h-4 text-accent" />
                <span>1-800-PARTNER</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Clock className="w-4 h-4 text-accent" />
                <span>Mon-Fri 9am-6pm EST</span>
              </div>
            </div>

            <Button variant="accent" onClick={onContactSupport}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HelpPage
