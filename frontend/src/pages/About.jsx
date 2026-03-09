import React from 'react';
import { Camera, ShieldCheck, Heart, Users } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">Redefining Eyewear.</h1>
                    <p className="text-xl text-blue-100 leading-relaxed">
                        At Branded Appeal, we believe that glasses shouldn't just help you see the world better—they should help the world see <b>you</b> better. We merge cutting-edge technology with timeless style to deliver premium eyewear straight to your door.
                    </p>
                </div>
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
            </div>

            {/* Core Values */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Core Values</h2>
                    <p className="mt-4 text-lg text-gray-500">The principles that guide everything we do.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Value 1 */}
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-200">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
                        <p className="text-gray-500">We source only the finest materials, from Italian acetate to aerospace-grade titanium, ensuring your frames last a lifetime.</p>
                    </div>

                    {/* Value 2 */}
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-200">
                            <Camera className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">AR Technology</h3>
                        <p className="text-gray-500">Shop with confidence using our industry-leading 3D Virtual Try-On, letting you see exactly how frames fit before you buy.</p>
                    </div>

                    {/* Value 3 */}
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-200">
                            <Heart className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Customer First</h3>
                        <p className="text-gray-500">Our dedicated support team is available 24/7. Your satisfaction isn't just a goal, it's our guarantee.</p>
                    </div>

                    {/* Value 4 */}
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-purple-200">
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Community Driven</h3>
                        <p className="text-gray-500">For every pair of glasses purchased, we donate a pair to someone in need in developing communities around the globe.</p>
                    </div>
                </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gray-50 py-20 border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Our Mission</h2>
                    <blockquote className="text-2xl font-medium italic text-gray-600 border-l-4 border-blue-600 pl-6 py-2 text-left bg-white p-8 rounded-2xl shadow-sm">
                        "To empower individuals to express their true selves through exceptionally designed eyewear, breaking down barriers of cost and accessibility without ever compromising on quality."
                    </blockquote>
                    <p className="mt-6 text-gray-500 font-bold uppercase tracking-wider">— The Branded Appeal Team</p>
                </div>
            </div>
        </div>
    );
};

export default About;
