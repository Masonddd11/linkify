"use client";

import { SocialLinksSettings } from "./_components/SocialLinksSettings";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - for future settings sections */}
          <div className="lg:col-span-3">
            <nav className="space-y-1">
              <a 
                href="#social-links" 
                className="bg-white px-3 py-2 rounded-lg text-primary-600 font-medium block hover:bg-gray-50 transition-colors"
              >
                Social Links
              </a>
              {/* Add more nav items here */}
            </nav>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            <SocialLinksSettings />
          </div>
        </div>
      </div>
    </div>
  );
} 