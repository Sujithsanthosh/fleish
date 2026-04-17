'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  Save,
  Globe,
  Type,
  Phone,
  Mail,
  MapPin,
  Clock,
  ImageIcon,
  Layout,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  ExternalLink,
  Undo,
  History,
  Search,
  Plus,
  Trash2,
  GripVertical,
  Upload,
  Palette,
  Settings,
  Info,
  X,
  FileText,
  AlignLeft,
  Heading,
  Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface ContentSection {
  id: string;
  name: string;
  type: 'hero' | 'features' | 'about' | 'contact' | 'footer' | 'custom';
  fields: ContentField[];
  lastModified: string;
  modifiedBy: string;
  status: 'published' | 'draft' | 'scheduled';
}

interface ContentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'link' | 'color' | 'array';
  value: any;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  maxLength?: number;
}

// Mock data - Website Content Sections
const MOCK_CONTENT: ContentSection[] = [
  {
    id: 'section-hero',
    name: 'Hero Section',
    type: 'hero',
    lastModified: '2024-01-15T10:30:00Z',
    modifiedBy: 'Admin User',
    status: 'published',
    fields: [
      { id: 'hero_title', label: 'Main Heading', type: 'text', value: 'Fresh Meat Delivered to Your Doorstep', placeholder: 'Enter main heading', required: true, maxLength: 100 },
      { id: 'hero_subtitle', label: 'Subheading', type: 'text', value: 'Premium Quality • Farm Fresh • 2 Hour Delivery', placeholder: 'Enter subheading', required: true, maxLength: 150 },
      { id: 'hero_description', label: 'Description', type: 'textarea', value: 'Get the freshest chicken, mutton, and seafood delivered straight from farms to your kitchen. Quality you can trust, convenience you\'ll love.', placeholder: 'Enter description', required: true, maxLength: 300 },
      { id: 'hero_cta_primary', label: 'Primary CTA Text', type: 'text', value: 'Shop Now', placeholder: 'e.g., Shop Now, Order Now', required: true },
      { id: 'hero_cta_secondary', label: 'Secondary CTA Text', type: 'text', value: 'View Stores', placeholder: 'e.g., Learn More, View Stores', required: false },
      { id: 'hero_image', label: 'Hero Image', type: 'image', value: '/images/hero-main.jpg', helpText: 'Recommended: 1920x800px, JPG or PNG' },
      { id: 'hero_background', label: 'Background Color', type: 'color', value: '#faf9f6', helpText: 'Hex color code for background' },
    ],
  },
  {
    id: 'section-features',
    name: 'Features Section',
    type: 'features',
    lastModified: '2024-01-14T16:20:00Z',
    modifiedBy: 'Admin User',
    status: 'published',
    fields: [
      { id: 'features_title', label: 'Section Title', type: 'text', value: 'Why Choose Fleish?', required: true },
      { id: 'features_subtitle', label: 'Section Subtitle', type: 'text', value: 'We bring you the best meat shopping experience', required: false },
      { id: 'feature_1_title', label: 'Feature 1 Title', type: 'text', value: 'Farm Fresh', required: true },
      { id: 'feature_1_desc', label: 'Feature 1 Description', type: 'textarea', value: 'Directly sourced from certified farms, ensuring the highest quality and freshness.', required: true, maxLength: 150 },
      { id: 'feature_2_title', label: 'Feature 2 Title', type: 'text', value: '2 Hour Delivery', required: true },
      { id: 'feature_2_desc', label: 'Feature 2 Description', type: 'textarea', value: 'Lightning-fast delivery to your doorstep. Freshness guaranteed with our cold chain.', required: true, maxLength: 150 },
      { id: 'feature_3_title', label: 'Feature 3 Title', type: 'text', value: 'Premium Quality', required: true },
      { id: 'feature_3_desc', label: 'Feature 3 Description', type: 'textarea', value: 'Hand-selected cuts by expert butchers. Only the best makes it to your plate.', required: true, maxLength: 150 },
      { id: 'feature_4_title', label: 'Feature 4 Title', type: 'text', value: 'Hygiene First', required: true },
      { id: 'feature_4_desc', label: 'Feature 4 Description', type: 'textarea', value: 'FSSAI certified stores and ISO compliant processing facilities.', required: true, maxLength: 150 },
    ],
  },
  {
    id: 'section-contact',
    name: 'Contact Information',
    type: 'contact',
    lastModified: '2024-01-16T09:15:00Z',
    modifiedBy: 'Manager',
    status: 'published',
    fields: [
      { id: 'contact_phone', label: 'Phone Number', type: 'text', value: '+91 1800 123 4567', required: true, helpText: 'Primary customer support number' },
      { id: 'contact_email', label: 'Email Address', type: 'text', value: 'support@fleish.com', required: true },
      { id: 'contact_address', label: 'Office Address', type: 'textarea', value: '123, Tech Park Road, Whitefield, Bangalore - 560066, Karnataka, India', required: true },
      { id: 'contact_hours', label: 'Business Hours', type: 'text', value: 'Mon - Sat: 6:00 AM - 10:00 PM', required: true },
      { id: 'contact_whatsapp', label: 'WhatsApp Number', type: 'text', value: '+91 98765 43210', required: false, helpText: 'For WhatsApp business queries' },
      { id: 'contact_emergency', label: 'Emergency Helpline', type: 'text', value: '+91 1800 999 8888', required: false, helpText: '24/7 emergency support' },
    ],
  },
  {
    id: 'section-footer',
    name: 'Footer Content',
    type: 'footer',
    lastModified: '2024-01-13T14:00:00Z',
    modifiedBy: 'Admin User',
    status: 'published',
    fields: [
      { id: 'footer_tagline', label: 'Company Tagline', type: 'text', value: 'Freshness Delivered Daily', required: true, maxLength: 50 },
      { id: 'footer_description', label: 'Company Description', type: 'textarea', value: 'Fleish is India\'s leading fresh meat delivery platform, connecting you with the best local vendors and ensuring quality products reach your doorstep.', required: true, maxLength: 200 },
      { id: 'footer_copyright', label: 'Copyright Text', type: 'text', value: '© 2024 Fleish. All rights reserved.', required: true },
      { id: 'footer_facebook', label: 'Facebook URL', type: 'link', value: 'https://facebook.com/fleish', required: false },
      { id: 'footer_instagram', label: 'Instagram URL', type: 'link', value: 'https://instagram.com/fleish', required: false },
      { id: 'footer_twitter', label: 'Twitter URL', type: 'link', value: 'https://twitter.com/fleish', required: false },
      { id: 'footer_linkedin', label: 'LinkedIn URL', type: 'link', value: 'https://linkedin.com/company/fleish', required: false },
    ],
  },
  {
    id: 'section-about',
    name: 'About Us Section',
    type: 'about',
    lastModified: '2024-01-12T11:30:00Z',
    modifiedBy: 'Admin User',
    status: 'draft',
    fields: [
      { id: 'about_title', label: 'Section Title', type: 'text', value: 'Our Story', required: true },
      { id: 'about_content', label: 'About Content', type: 'richtext', value: '<p>Founded in 2023, Fleish started with a simple mission: to make fresh, quality meat accessible to every household in India.</p><p>What began as a small operation in Bangalore has now grown into a trusted platform serving thousands of customers daily.</p>', required: true },
      { id: 'about_mission', label: 'Mission Statement', type: 'textarea', value: 'To revolutionize meat shopping by providing fresh, hygienic, and quality products with unmatched convenience and transparency.', required: true, maxLength: 200 },
      { id: 'about_vision', label: 'Vision Statement', type: 'textarea', value: 'To become India\'s most trusted meat delivery platform, setting new standards in quality, hygiene, and customer service.', required: true, maxLength: 200 },
      { id: 'about_image', label: 'About Image', type: 'image', value: '/images/about-team.jpg', helpText: 'Recommended: 800x600px' },
    ],
  },
];

const SECTION_ICONS = {
  hero: Globe,
  features: Layout,
  about: Info,
  contact: Phone,
  footer: FileText,
  custom: Edit3,
};

const STATUS_CONFIG = {
  published: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Published' },
  draft: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Edit3, label: 'Draft' },
  scheduled: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock, label: 'Scheduled' },
};

export default function ContentEditorPage() {
  const [sections, setSections] = useState<ContentSection[]>(MOCK_CONTENT);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Filter sections
  const filteredSections = sections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.fields.some(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || section.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || section.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFieldChange = (fieldId: string, value: any) => {
    setEditedFields(prev => ({ ...prev, [fieldId]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!selectedSection) return;
    
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSections(prev => prev.map(section => 
      section.id === selectedSection.id 
        ? { 
            ...section, 
            fields: section.fields.map(field => ({
              ...field,
              value: editedFields[field.id] !== undefined ? editedFields[field.id] : field.value
            })),
            lastModified: new Date().toISOString(),
            modifiedBy: 'Current Admin',
            status: 'published'
          }
        : section
    ));
    
    setHasChanges(false);
    setLastSaved(new Date().toLocaleTimeString());
    setSaving(false);
  };

  const handleDiscard = () => {
    if (hasChanges && !confirm('Discard unsaved changes?')) return;
    setEditedFields({});
    setHasChanges(false);
  };

  const selectSection = (section: ContentSection) => {
    if (hasChanges) {
      if (!confirm('You have unsaved changes. Discard and continue?')) return;
    }
    setSelectedSection(section);
    setEditedFields({});
    setHasChanges(false);
    setExpandedSections(new Set([section.id]));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldValue = (field: ContentField) => {
    return editedFields[field.id] !== undefined ? editedFields[field.id] : field.value;
  };

  const stats = {
    total: sections.length,
    published: sections.filter(s => s.status === 'published').length,
    draft: sections.filter(s => s.status === 'draft').length,
    lastModified: sections.reduce((latest, s) => 
      new Date(s.lastModified) > new Date(latest) ? s.lastModified : latest,
      sections[0]?.lastModified
    ),
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center shadow-lg">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3c28]">Website Content Editor</h1>
              <p className="text-[#5c3d1f]">Manage homepage sections and static content</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="text-sm text-[#5c3d1f]">
                Last saved: {lastSaved}
              </span>
            )}
            <a
              href="https://fleish-a81a0.web.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbc4a4]/50 rounded-xl text-[#5c3d1f] hover:bg-[#f0e6d3] transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Website
            </a>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Sections', value: stats.total, icon: Layout, color: 'from-[#2d5a42] to-[#3d7a58]' },
          { label: 'Published', value: stats.published, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Draft', value: stats.draft, icon: Edit3, color: 'from-amber-500 to-amber-600' },
          { label: 'Last Modified', value: formatDate(stats.lastModified).split(',')[0], icon: History, color: 'from-blue-500 to-blue-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#dbc4a4]/30 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#5c3d1f]">{stat.label}</p>
              <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-xl font-bold text-[#1a3c28]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Section List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-4 bg-white rounded-xl border border-[#dbc4a4]/30 shadow-sm overflow-hidden"
        >
          {/* Filters */}
          <div className="p-4 border-b border-[#dbc4a4]/30 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6914]" />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="hero">Hero</option>
                <option value="features">Features</option>
                <option value="about">About</option>
                <option value="contact">Contact</option>
                <option value="footer">Footer</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Section List */}
          <div className="max-h-[600px] overflow-y-auto">
            {filteredSections.map((section) => {
              const SectionIcon = SECTION_ICONS[section.type];
              const StatusIcon = STATUS_CONFIG[section.status].icon;
              const isSelected = selectedSection?.id === section.id;
              
              return (
                <div key={section.id}>
                  <button
                    onClick={() => selectSection(section)}
                    className={cn(
                      "w-full p-4 flex items-center gap-3 transition-colors border-b border-[#dbc4a4]/20",
                      isSelected 
                        ? "bg-[#f0e6d3] border-l-4 border-l-[#2d5a42]" 
                        : "hover:bg-[#faf9f6] border-l-4 border-l-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isSelected ? "bg-[#2d5a42] text-white" : "bg-[#f0e6d3] text-[#5c3d1f]"
                    )}>
                      <SectionIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-[#1a3c28]">{section.name}</h4>
                      <p className="text-xs text-[#5c3d1f]">{section.fields.length} fields</p>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      STATUS_CONFIG[section.status].color
                    )}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {STATUS_CONFIG[section.status].label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Panel - Editor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-8"
        >
          {selectedSection ? (
            <div className="bg-white rounded-xl border border-[#dbc4a4]/30 shadow-sm overflow-hidden">
              {/* Editor Header */}
              <div className="p-6 border-b border-[#dbc4a4]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center text-white">
                    {React.createElement(SECTION_ICONS[selectedSection.type], { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1a3c28]">{selectedSection.name}</h2>
                    <p className="text-sm text-[#5c3d1f]">
                      Last modified: {formatDate(selectedSection.lastModified)} by {selectedSection.modifiedBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      Unsaved Changes
                    </span>
                  )}
                  <button
                    onClick={() => setShowPreview(true)}
                    className="px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg hover:bg-[#e8dcc8] transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleDiscard}
                    disabled={!hasChanges}
                    className="px-4 py-2 border border-[#dbc4a4] text-[#5c3d1f] rounded-lg hover:bg-[#f0e6d3] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Undo className="w-4 h-4" />
                    Discard
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="px-4 py-2 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-6">
                {selectedSection.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5c3d1f]">
                      {field.label}
                      {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={getFieldValue(field)}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        className="w-full px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                      />
                    )}
                    
                    {field.type === 'textarea' && (
                      <textarea
                        value={getFieldValue(field)}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        rows={4}
                        className="w-full px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 resize-none"
                      />
                    )}
                    
                    {field.type === 'richtext' && (
                      <div className="border border-[#dbc4a4]/50 rounded-xl overflow-hidden">
                        <div className="bg-[#f0ebe3] px-4 py-2 flex items-center gap-2 border-b border-[#dbc4a4]/30">
                          <button className="p-1.5 hover:bg-[#faf9f6] rounded"><Heading className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-[#faf9f6] rounded"><AlignLeft className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-[#faf9f6] rounded"><Type className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-[#faf9f6] rounded"><Link2 className="w-4 h-4" /></button>
                        </div>
                        <textarea
                          value={getFieldValue(field)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          rows={6}
                          className="w-full px-4 py-3 bg-[#faf9f6] text-sm focus:outline-none resize-none"
                        />
                      </div>
                    )}
                    
                    {field.type === 'image' && (
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-24 bg-[#f0ebe3] rounded-xl flex items-center justify-center border border-[#dbc4a4]/50">
                          <ImageIcon className="w-8 h-8 text-[#c49a6c]" />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={getFieldValue(field)}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm mb-2"
                            placeholder="Image path or URL"
                          />
                          <button className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg text-sm hover:bg-[#e8dcc8] transition-colors">
                            <Upload className="w-4 h-4" />
                            Upload Image
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {field.type === 'link' && (
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-[#8b6914]" />
                        <input
                          type="url"
                          value={getFieldValue(field)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="flex-1 px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                          placeholder="https://..."
                        />
                      </div>
                    )}
                    
                    {field.type === 'color' && (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={getFieldValue(field)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-12 h-12 rounded-xl border border-[#dbc4a4]/50 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={getFieldValue(field)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="flex-1 px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-xl text-sm font-mono uppercase"
                        />
                      </div>
                    )}

                    {field.helpText && (
                      <p className="text-xs text-[#8b6914]">{field.helpText}</p>
                    )}
                    {field.maxLength && (
                      <p className="text-xs text-[#8b6914] text-right">
                        {getFieldValue(field)?.length || 0} / {field.maxLength} characters
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#dbc4a4]/30 shadow-sm p-12 text-center">
              <Layout className="w-16 h-16 text-[#c49a6c] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1a3c28] mb-2">Select a Section</h3>
              <p className="text-[#5c3d1f] mb-4">Choose a content section from the sidebar to start editing</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedSection && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-4 border-b border-[#dbc4a4]/30 flex items-center justify-between bg-[#faf9f6]">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#8b6914]" />
                <span className="font-medium text-[#1a3c28]">Preview: {selectedSection.name}</span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-[#f0e6d3] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#5c3d1f]" />
              </button>
            </div>
            
            <div className="p-8">
              {selectedSection.type === 'hero' && (
                <div className="text-center py-12">
                  <h1 className="text-4xl font-bold text-[#1a3c28] mb-4">
                    {getFieldValue(selectedSection.fields.find(f => f.id === 'hero_title')!)}
                  </h1>
                  <p className="text-xl text-[#5c3d1f] mb-4">
                    {getFieldValue(selectedSection.fields.find(f => f.id === 'hero_subtitle')!)}
                  </p>
                  <p className="text-[#3d2914] max-w-2xl mx-auto mb-6">
                    {getFieldValue(selectedSection.fields.find(f => f.id === 'hero_description')!)}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button className="px-6 py-3 bg-[#2d5a42] text-white rounded-xl font-semibold">
                      {getFieldValue(selectedSection.fields.find(f => f.id === 'hero_cta_primary')!)}
                    </button>
                    <button className="px-6 py-3 border border-[#dbc4a4] text-[#5c3d1f] rounded-xl font-semibold">
                      {getFieldValue(selectedSection.fields.find(f => f.id === 'hero_cta_secondary')!)}
                    </button>
                  </div>
                </div>
              )}

              {selectedSection.type === 'contact' && (
                <div className="max-w-2xl mx-auto py-8">
                  <h2 className="text-2xl font-bold text-[#1a3c28] mb-6 text-center">Contact Us</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl">
                      <Phone className="w-5 h-5 text-[#2d5a42]" />
                      <span>{getFieldValue(selectedSection.fields.find(f => f.id === 'contact_phone')!)}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl">
                      <Mail className="w-5 h-5 text-[#2d5a42]" />
                      <span>{getFieldValue(selectedSection.fields.find(f => f.id === 'contact_email')!)}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl">
                      <MapPin className="w-5 h-5 text-[#2d5a42]" />
                      <span>{getFieldValue(selectedSection.fields.find(f => f.id === 'contact_address')!)}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl">
                      <Clock className="w-5 h-5 text-[#2d5a42]" />
                      <span>{getFieldValue(selectedSection.fields.find(f => f.id === 'contact_hours')!)}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedSection.type === 'footer' && (
                <div className="py-8 border-t border-[#dbc4a4]">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-[#1a3c28] mb-2">
                      {getFieldValue(selectedSection.fields.find(f => f.id === 'footer_tagline')!)}
                    </h3>
                    <p className="text-sm text-[#5c3d1f] max-w-xl mx-auto mb-4">
                      {getFieldValue(selectedSection.fields.find(f => f.id === 'footer_description')!)}
                    </p>
                    <p className="text-xs text-[#8b6914]">
                      {getFieldValue(selectedSection.fields.find(f => f.id === 'footer_copyright')!)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
