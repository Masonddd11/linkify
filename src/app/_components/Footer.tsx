import { Github, Twitter, DiscIcon as Discord } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Linkify</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              Your free and open-source personal page to show everything you are
              and create.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/yourusername/your-repo"
                className="text-gray-400 hover:text-gray-500"
              >
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Discord className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Project
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  Contribute
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Linkify. Open source software licensed
            under MIT.
          </p>
        </div>
      </div>
    </footer>
  );
}
