import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default async function LandingPage() {

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Your All-in-One</span>
                <span className="block text-primary-600">Digital Identity</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Create a beautiful profile page that showcases all your social media links, projects, and content in one place.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/auth/signup">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                    <Link href="/auth/login">
                      <Github className="mr-2 h-4 w-4" />
                      Login with GitHub
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <img
                  className="w-full"
                  src="/"
                  alt="App screenshot"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Everything you need in one place
                </h2>
                <p className="mt-4 text-xl text-gray-600">
                  Showcase your online presence with powerful features
                </p>
              </div>

              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="relative group">
                    <div className="relative bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                      <feature.icon className="h-8 w-8 text-primary-600" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">
                        {feature.name}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} Linkify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    name: 'Social Media Integration',
    description: 'Connect all your social media accounts in one place for easy access.',
    icon: function SocialIcon(props: any) {
      return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    },
  },
  {
    name: 'Customizable Layout',
    description: 'Create a unique profile with our drag-and-drop interface and customizable widgets.',
    icon: function CustomizeIcon(props: any) {
      return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      );
    },
  },
  {
    name: 'Analytics & Insights',
    description: 'Track profile views and engagement with detailed analytics.',
    icon: function AnalyticsIcon(props: any) {
      return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    },
  },
]; 