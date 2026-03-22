import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SafeLedger</h3>
            <p className="text-gray-400 text-sm mb-4">
              Building trust in informal finance through blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/safeledger" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a1 1 0 00-.94-.366L20.516 2.4a1 1 0 00-1.175-.492l-2.467 2.878-.042l-2.467 2.878.042a1 1 0 00-.585.425l-2.467 2.879a1 1 0 00-.585-.425l-2.467-2.879a1 1 0 00-.585-.425z"/>
                </svg>
              </a>
              <a href="https://facebook.com/safeledger" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s5.373 12 12 12 5.373 12 12c-.073 0-.14-.022-.203-.058.09-.247.335-.37-.54c0-.815.846-1.43 2.24-3.859 3.179-4.122-.317.55.168-1.107-.278-.145.46-.603-.663-.224-.078-.17-.246-.073-.13-.335-.14-.157-.01-.003-.041-.005-.015-.02.137.021-.335.043-.044-.05-.084-.134-.321.217-.391-.518-.642-.855-1.163-.245-.493-.78-.823-1.003-.277-.593-.912-1.184-1.599-2.015-2.399-3.174-4.291-5.079-5.476-5.984-.292-.24-.113-.207-.113-.418-.419-.24-.24-.519-.742-.767-.844-1.798-1.93-2.423-3.078-3.415-4.525-4.992-5.092-5.176-8.585-7.253-9.347-10.535-10.93-12.12-12.12z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/safeledger" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-8.947c0-.768.599-1.414 1.414h4.5v8.947h3.554c.768 0 1.414-.599 1.414h1.414v-10.474h-15.236l4.618 4.618c0 1.414 1.414 1.414v17.052h-15.236c0 1.414 1.414 1.414v-17.052z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-400 hover:text-white transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-gray-400 hover:text-white transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-gray-400 hover:text-white transition-colors">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              &copy; 2026 SafeLedger. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Built for Kenya 🇰🇪</span>
              <span>•</span>
              <Link to="/hedera" className="hover:text-white transition-colors">
                Powered by Hedera
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;