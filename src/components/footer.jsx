import { Link, useNavigate } from "react-router-dom";
import { 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaHeart,
  FaSignOutAlt 
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // Adjust import path as needed

function Footer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  const currentYear = new Date().getFullYear();
  
  const navigationLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Blog" },
    { to: "/projects", label: "Projects" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <footer className="relative mt-20 overflow-x-hidden">
      {/* TOP GRADIENT */}
      <div 
        className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" 
        aria-hidden="true"
      />
      
      <div className="bg-gray-900 text-gray-300">
        {/* MAIN CONTENT */}
        <div className="container-main py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* BRAND */}
            <div className="text-center sm:text-left">
              <Link to="/" className="inline-block">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Arbaz Khan
                </h2>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                A personal portfolio and blogging platform where I share my projects, 
                experiences and thoughts on modern web development.
              </p>
            </div>
            
            {/* NAVIGATION */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-white mb-4">
                Navigation
              </h3>
              <nav aria-label="Footer navigation">
                <ul className="space-y-3 text-sm">
                  {navigationLinks.map(({ to, label }) => (
                    <li key={to}>
                      <Link 
                        to={to}
                        className="hover:text-white transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            
            {/* ACCOUNT */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-white mb-4">
                Account
              </h3>
              <nav aria-label="Account links">
                <ul className="space-y-3 text-sm">
                  {user ? (
                    // Logged-in user links
                    <>
                      <li>
                        <Link 
                          to="/dashboard"
                          className="hover:text-white transition-colors duration-200"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button 
                          onClick={handleLogout}
                          className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                        >
                          <FaSignOutAlt className="text-sm" />
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    // Guest user links
                    <>
                      <li>
                        <Link 
                          to="/login"
                          className="hover:text-white transition-colors duration-200"
                        >
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/register"
                          className="hover:text-white transition-colors duration-200"
                        >
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
            
            {/* SOCIAL */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-white mb-4">
                Let's Connect
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                Connect with me on social platforms.
              </p>
              <div 
                className="flex justify-center sm:justify-start gap-4 text-xl"
                role="list"
                aria-label="Social media links"
              >
                <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=rohitcod50@gmail.com"
                  className="p-3 rounded-full bg-gray-800 hover:bg-blue-500 transition duration-300"
                  aria-label="Email"
                >
                  <FaEnvelope />
                </a>
                <a 
                  href="https://github.com/ArbazCod" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition duration-300"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a 
                href="https://www.linkedin.com/in/arbaz17"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* BOTTOM */}
        <div className="border-t border-gray-800 py-5 px-4 text-center text-sm text-gray-400">
          <p className="flex flex-wrap justify-center items-center gap-1">
            © {currentYear} Arbaz Khan • Full Stack Developer • Built with 
            <FaHeart className="text-red-500" aria-hidden="true" /> 
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;