import { FaFire, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark-navy text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <FaFire className="text-fire-orange text-2xl mr-2" />
              <h3 className="text-xl font-bold">APULA</h3>
            </div>
            <p className="text-gray-400 mb-4">Making fire safety education fun and engaging for everyone.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition">Home</a></Link></li>
              <li><Link href="/games"><a className="text-gray-400 hover:text-white transition">Games</a></Link></li>
              <li><Link href="/resources"><a className="text-gray-400 hover:text-white transition">Resources</a></Link></li>
              <li><Link href="/about"><a className="text-gray-400 hover:text-white transition">About Us</a></Link></li>
              <li><Link href="/contact"><a className="text-gray-400 hover:text-white transition">Contact</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Fire Safety Tips</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Emergency Plans</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Educational Videos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">For Teachers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Fire Department Locator</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-fire-orange" />
                <span className="text-gray-400">123 Safety Street, Fire City, FC 12345</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="mt-1 mr-3 text-fire-orange" />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-3 text-fire-orange" />
                <span className="text-gray-400">info@apula.edu</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} APULA Educational Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
