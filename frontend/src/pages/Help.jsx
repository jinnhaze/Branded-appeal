import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-xl mb-4 bg-white overflow-hidden transition-all duration-200 shadow-sm hover:border-blue-200">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
            >
                <span className="font-bold text-gray-900">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-5 pt-0 text-gray-600 bg-gray-50 border-t border-gray-100">
                    <p className="mt-4 leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
};

const Help = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 pt-16 pb-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">How can we help you?</h1>
                    <p className="text-lg text-gray-500 mb-8">Search our knowledge base or browse categories below.</p>
                    
                    <div className="relative max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
                            placeholder="Type a question..."
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
                
                {/* FAQ Section */}
                <div className="flex-1">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Frequently Asked Questions</h2>
                    
                    <FAQItem 
                        question="How does the Virtual Try-On feature work?" 
                        answer="Our Virtual Try-On uses advanced augmented reality (AR) technology via your device's webcam. Simply click the 'Try On' button on any product page, grant camera access, and our engine will overlay a 3D model of the glasses directly onto your face in real-time."
                    />
                    <FAQItem 
                        question="What is your return policy?" 
                        answer="We offer a 14-day hassle-free return policy. If you're not completely satisfied with your purchase, you can return it within 14 days of delivery for a full refund or exchange. The frames must be in their original, unworn condition."
                    />
                    <FAQItem 
                        question="How long does shipping take?" 
                        answer="Standard shipping typically takes 3-5 business days. Expedited shipping options (1-2 business days) are available at checkout. Prescription orders may require an additional 2-3 days for custom lens fitting."
                    />
                    <FAQItem 
                        question="Do you accept vision insurance?" 
                        answer="Currently, we are an out-of-network provider for most vision insurance plans. We provide detailed itemized receipts with all orders, which you can submit to your insurance provider for reimbursement based on your plan's out-of-network benefits."
                    />
                    <FAQItem 
                        question="How do I submit my prescription?" 
                        answer="After selecting your frames and lenses, you'll be prompted to provide your prescription. You can upload a photo of your prescription, manually enter the details, or provide your eye doctor's contact information for us to verify it for you."
                    />
                </div>

                {/* Contact Section */}
                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sticky top-28">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-6">Need more help?</h2>
                        <p className="text-gray-500 mb-8">Our support team is available Monday through Friday, 9am to 6pm EST.</p>
                        
                        <div className="space-y-4">
                            <a href="#" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-gray-100 transition group">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Live Chat</p>
                                    <p className="text-xs text-gray-500">Typically replies in minutes</p>
                                </div>
                            </a>
                            
                            <a href="mailto:support@brandedappeal.com" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-gray-100 transition group">
                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Email Us</p>
                                    <p className="text-xs text-gray-500">support@brandedappeal.com</p>
                                </div>
                            </a>
                            
                            <a href="tel:+18001234567" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-gray-100 transition group">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Call Us</p>
                                    <p className="text-xs text-gray-500">1-800-123-4567</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Help;
