import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <i className="fas fa-fire text-[#FFC107] text-2xl mr-2"></i>
                <h2 className="font-bangers text-2xl">APULA</h2>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mt-1">Learn fire safety in a fun way!</p>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-300 hover:text-white">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <i className="fab fa-youtube text-xl"></i>
            </a>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <a href="#" className="text-gray-300 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">Terms of Use</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">Contact Us</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">About</a>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>APULA is designed for educational purposes. In case of a real emergency, please call your local emergency number.</p>
          <p className="mt-2">RCDC© {new Date().getFullYear()} APULA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
