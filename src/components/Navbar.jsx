import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

import {
  FiLogOut,
  FiHome,
  FiFileText,
  FiMail,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
  FiGrid,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

import {
  FaUserShield,
  FaStar,
  FaLeaf,
  FaTree,
} from "react-icons/fa";

import { RiSparklingFill } from "react-icons/ri";

import { HiOutlineSparkles } from "react-icons/hi";

import { BsTree } from "react-icons/bs";

function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHoveringBrand, setIsHoveringBrand] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 60px rgba(5, 150, 105, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(16, 185, 129, 0.3); }
          50% { border-color: rgba(5, 150, 105, 0.8); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes leafSway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes growIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <nav
        style={{
          padding: isMobile ? "0 1.25rem" : "0 3rem",
          background: scrolled
            ? "rgba(6, 78, 60, 0.85)"
            : "rgba(6, 78, 60, 0.95)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          color: "#f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          height: isMobile ? "72px" : "84px",
          borderBottom: scrolled
            ? "1px solid rgba(16, 185, 129, 0.2)"
            : "1px solid rgba(16, 185, 129, 0.1)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0, 0, 0, 0.3), 0 0 60px rgba(16, 185, 129, 0.05)"
            : "0 4px 20px rgba(0, 0, 0, 0.2)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            textDecoration: "none",
            position: "relative",
          }}
          onMouseEnter={() => setIsHoveringBrand(true)}
          onMouseLeave={() => setIsHoveringBrand(false)}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #10b981, #059669, #047857, #065f46)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontSize: "24px",
              color: "white",
              boxShadow: isHoveringBrand
                ? "0 12px 40px rgba(16, 185, 129, 0.5), 0 0 60px rgba(5, 150, 105, 0.3)"
                : "0 8px 25px rgba(16, 185, 129, 0.3)",
              transform: isHoveringBrand ? "rotate(-8deg) scale(1.05)" : "rotate(0deg) scale(1)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              animation: isHoveringBrand ? "glowPulse 2s infinite" : "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: isHoveringBrand ? "shimmer 1.5s infinite" : "none",
              }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>A</span>
            <FaTree
              style={{
                position: "absolute",
                bottom: "-3px",
                right: "-3px",
                fontSize: "14px",
                color: "#34d399",
                filter: "drop-shadow(0 0 6px rgba(52, 211, 153, 0.8))",
                animation: isHoveringBrand ? "leafSway 2s ease-in-out infinite" : "none",
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <h2
              style={{
                fontWeight: "800",
                fontSize: isMobile ? "22px" : "26px",
                background: "linear-gradient(135deg, #f1f5f9 0%, #10b981 50%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
                position: "relative",
                paddingBottom: "4px",
                margin: 0,
              }}
            >
              Arbaz<span style={{ WebkitTextFillColor: "#10b981" }}>.dev</span>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: isHoveringBrand ? "100%" : "0%",
                  height: "2px",
                  background: "linear-gradient(90deg, #10b981, #059669, #047857)",
                  transition: "width 0.4s ease",
                  borderRadius: "1px",
                }}
              />
            </h2>
            <div
              style={{
                position: "absolute",
                top: "-12px",
                right: "-45px",
                background: "linear-gradient(135deg, #34d399, #059669)",
                color: "#064e3b",
                fontSize: "9px",
                fontWeight: "800",
                padding: "2px 10px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                boxShadow: "0 4px 15px rgba(5, 150, 105, 0.4)",
                letterSpacing: "0.5px",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              <FaLeaf size={8} /> GREEN
            </div>
          </div>
        </Link>

       
        <div
          style={{
            display: isMobile ? "none" : "flex",
            gap: "4px",
            alignItems: "center",
            height: "100%",
          }}
        >
          <NavItem to="/" icon={<FiHome />} active={isActive("/")} accent="#10b981">
            Home
          </NavItem>

          <NavItem to="/blog" icon={<FiFileText />} active={isActive("/blog")} accent="#10b981">
            Blog
          </NavItem>

       <NavItem
  to="/projects"
  icon={<FiGrid />}
  active={isActive("/projects")}
  accent="#10b981"
>
  Portfolio
</NavItem>
          <NavItem to="/contact" icon={<FiMail />} active={isActive("/contact")} accent="#10b981">
            Contact
          </NavItem>

          {user ? (
            <>
              <div style={{ margin: "0 12px" }}>
                <NotificationBell />
              </div>

              {isAdmin ? (
                <NavItem
                  to="/admin"
                  icon={<FaUserShield />}
                  active={isActive("/admin")}
                  accent="#f59e0b"
                  premium
                >
                  Admin
                </NavItem>
              ) : (
                <NavItem
                  to="/dashboard"
                  icon={<FiUser />}
                  active={isActive("/dashboard")}
                  accent="#34d399"
                  premium
                >
                  Dashboard
                </NavItem>
              )}

             
              <div style={{ position: "relative", marginLeft: "16px" }} ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 18px",
                    background: isDropdownOpen
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px",
                    border: isDropdownOpen
                      ? "1px solid rgba(16, 185, 129, 0.4)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#f1f5f9",
                    cursor: "pointer",
                    height: "50px",
                    minWidth: "170px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=10b981&color=fff&bold=true`
                    }
                    alt="avatar"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "12px",
                      border: "2px solid rgba(16, 185, 129, 0.5)",
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                      zIndex: 1,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      maxWidth: "80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      zIndex: 1,
                    }}
                  >
                    {user?.name || "User"}
                  </span>
                  <FiChevronDown
                    style={{
                      transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      zIndex: 1,
                    }}
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 16px)",
                      right: 0,
                      width: "280px",
                      background: "linear-gradient(145deg, rgba(6, 78, 60, 0.98), rgba(2, 44, 34, 0.98))",
                      backdropFilter: "blur(40px) saturate(180%)",
                      borderRadius: "20px",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      boxShadow:
                        "0 25px 70px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.15)",
                      overflow: "hidden",
                      animation: "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        padding: "20px",
                        borderBottom: "1px solid rgba(16, 185, 129, 0.15)",
                        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: "#f1f5f9",
                          marginBottom: "6px",
                        }}
                      >
                        {user?.name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#94a3b8",
                          marginBottom: "10px",
                        }}
                      >
                        {user?.email}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#34d399",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "rgba(52, 211, 153, 0.1)",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          width: "fit-content",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#34d399",
                            boxShadow: "0 0 10px rgba(52, 211, 153, 0.6)",
                            animation: "pulse 2s infinite",
                          }}
                        />
                        Active now
                      </div>
                    </div>

                    <div style={{ padding: "8px" }}>
                      <DropdownItem icon={<FiUser />} label="Profile" accent="#10b981" />
                      <DropdownItem icon={<FiSettings />} label="Settings" accent="#10b981" />
                      <DropdownItem icon={<FiHelpCircle />} label="Help" accent="#10b981" />
                    </div>

                    <div style={{ padding: "8px", borderTop: "1px solid rgba(16, 185, 129, 0.1)" }}>
                      <button
                        onClick={logout}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "#f87171",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: "14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "14px",
                          fontWeight: "600",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                          e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                          e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
                        }}
                      >
                        <FiLogOut />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: "12px 24px",
                  borderRadius: "14px",
                  border: "1.5px solid rgba(16, 185, 129, 0.4)",
                  color: "#a7f3d0",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginLeft: "20px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "rgba(16, 185, 129, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.6)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(16, 185, 129, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                style={{
                  padding: "12px 24px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #10b981, #059669, #047857)",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                  marginLeft: "12px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 35px rgba(16, 185, 129, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(16, 185, 129, 0.4)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.15), transparent)",
                    transform: "translateX(-100%)",
                    transition: "transform 0.6s ease",
                  }}
                />
                Get Started
              </Link>
            </>
          )}
        </div>

       
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: isMobile ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            background: mobileMenuOpen
              ? "rgba(16, 185, 129, 0.15)"
              : "rgba(255, 255, 255, 0.05)",
            color: "#f1f5f9",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            zIndex: 1001,
          }}
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      
      {mobileMenuOpen && isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "linear-gradient(180deg, rgba(2, 44, 34, 0.98) 0%, rgba(6, 78, 60, 0.99) 100%)",
            backdropFilter: "blur(40px) saturate(180%)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            animation: "fadeIn 0.3s ease",
            padding: "100px 20px 40px",
          }}
        >
        
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-50%",
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30%",
              left: "-30%",
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle, rgba(5, 150, 105, 0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

         
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#10b981",
                marginBottom: "12px",
                paddingLeft: "8px",
              }}
            >
              Navigation
            </div>

            <MobileNavLink
              to="/"
              icon={<FiHome size={22} />}
              active={isActive("/")}
              onClick={() => setMobileMenuOpen(false)}
              accent="#10b981"
            >
              Home
              {isActive("/") && <FaStar size={12} style={{ color: "#34d399" }} />}
            </MobileNavLink>

            <MobileNavLink
              to="/blog"
              icon={<FiFileText size={22} />}
              active={isActive("/blog")}
              onClick={() => setMobileMenuOpen(false)}
              accent="#10b981"
            >
              Blog
            </MobileNavLink>

           <MobileNavLink
  to="/projects"
  icon={<FiGrid size={22} />}
  active={isActive("/projects")}
  onClick={() => setMobileMenuOpen(false)}
  accent="#10b981"
>
  Portfolio
</MobileNavLink>

            <MobileNavLink
              to="/contact"
              icon={<FiMail size={22} />}
              active={isActive("/contact")}
              onClick={() => setMobileMenuOpen(false)}
              accent="#10b981"
            >
              Contact
            </MobileNavLink>
          </div>

         
          <div
            style={{
              marginTop: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            {user ? (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}>
               
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))",
                    borderRadius: "24px",
                    padding: "24px",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 15px 40px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "100px",
                      height: "100px",
                      background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
                      borderRadius: "50%",
                      transform: "translate(30%, -30%)",
                    }}
                  />
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=10b981&color=fff&bold=true`
                      }
                      alt="avatar"
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "18px",
                        border: "3px solid rgba(16, 185, 129, 0.5)",
                        boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "18px", color: "#f1f5f9" }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(52, 211, 153, 0.15)",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    width: "fit-content",
                    border: "1px solid rgba(52, 211, 153, 0.3)",
                  }}>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#34d399",
                      boxShadow: "0 0 12px rgba(52, 211, 153, 0.6)",
                      animation: "pulse 2s infinite",
                    }} />
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#6ee7b7" }}>
                      Active now
                    </span>
                  </div>
                </div>

                
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "18px 24px",
                    background: isAdmin
                      ? "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))"
                      : "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))",
                    borderRadius: "20px",
                    color: isAdmin ? "#fbbf24" : "#34d399",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "16px",
                    border: isAdmin
                      ? "1.5px solid rgba(245, 158, 11, 0.3)"
                      : "1.5px solid rgba(16, 185, 129, 0.3)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isAdmin ? <FaUserShield size={22} /> : <FiUser size={22} />}
                  {isAdmin ? "Admin Dashboard" : "Dashboard"}
                  <HiOutlineSparkles
                    size={16}
                    style={{ marginLeft: "auto", color: isAdmin ? "#fbbf24" : "#34d399" }}
                  />
                </Link>

               
                <div style={{ padding: "4px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px" }}>
                  <NotificationBell />
                </div>

               
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "18px",
                    borderRadius: "20px",
                    border: "1.5px solid rgba(239, 68, 68, 0.3)",
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#f87171",
                    fontWeight: "700",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "100%",
                    marginTop: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                  }}
                >
                  <FiLogOut size={22} />
                  Logout
                </button>
              </div>
            ) : (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}>
               
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))",
                    borderRadius: "24px",
                    padding: "24px",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    textAlign: "center",
                    marginBottom: "8px",
                  }}
                >
                  <BsTree size={32} style={{ color: "#34d399", marginBottom: "12px" }} />
                  <div style={{ fontWeight: "700", fontSize: "16px", color: "#f1f5f9", marginBottom: "6px" }}>
                    Join the Green Community
                  </div>
                  <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
                    Sign in to access exclusive features and grow with us
                  </div>
                </div>

                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: "18px",
                    borderRadius: "20px",
                    border: "2px solid rgba(16, 185, 129, 0.4)",
                    color: "#a7f3d0",
                    textDecoration: "none",
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                    background: "rgba(16, 185, 129, 0.1)",
                  }}
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: "18px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #10b981, #059669, #047857)",
                    color: "white",
                    textDecoration: "none",
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: "16px",
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                      transform: "translateX(-100%)",
                      transition: "transform 0.6s ease",
                    }}
                  />
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

         
          <div
            style={{
              marginTop: "24px",
              height: "4px",
              background: "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), rgba(5, 150, 105, 0.5), transparent)",
              borderRadius: "2px",
              width: "60%",
              alignSelf: "center",
            }}
          />
        </div>
      )}
    </>
  );
}

// Desktop Nav Item Component
function NavItem({ children, to, icon, active, accent = "#10b981", premium = false }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "14px",
        textDecoration: "none",
        color: active ? "#f1f5f9" : "#94a3b8",
        fontSize: "14px",
        fontWeight: active ? "700" : "500",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: active
          ? `linear-gradient(135deg, ${accent}20, ${accent}10)`
          : "transparent",
        border: active
          ? `1px solid ${accent}40`
          : "1px solid transparent",
        transform: isHovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: active
          ? `0 4px 15px ${accent}30`
          : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
          color: active ? accent : "#94a3b8",
          transition: "all 0.3s ease",
          transform: isHovered ? "scale(1.1)" : "scale(1)",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </span>
      {premium && (
        <RiSparklingFill
          size={12}
          style={{
            color: accent,
            marginLeft: "2px",
            filter: `drop-shadow(0 0 4px ${accent}60)`,
          }}
        />
      )}
    </Link>
  );
}

// Dropdown Item Component
function DropdownItem({ icon, label, onClick, accent = "#10b981" }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 16px",
        background: "transparent",
        color: "#94a3b8",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `rgba(16, 185, 129, 0.1)`;
        e.currentTarget.style.color = "#f1f5f9";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#94a3b8";
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ children, to, icon, active, onClick, accent = "#10b981" }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px 20px",
        borderRadius: "18px",
        textDecoration: "none",
        color: active ? "#f1f5f9" : "#94a3b8",
        fontSize: "16px",
        fontWeight: active ? "700" : "500",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: active
          ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))"
          : "transparent",
        border: active
          ? "1px solid rgba(16, 185, 129, 0.3)"
          : "1px solid transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          background: active
            ? "linear-gradient(135deg, #10b981, #059669)"
            : "rgba(255, 255, 255, 0.05)",
          color: active ? "white" : "#94a3b8",
          transition: "all 0.3s ease",
          boxShadow: active ? "0 8px 20px rgba(16, 185, 129, 0.4)" : "none",
        }}
      >
        {icon}
      </div>
      <span style={{ flex: 1 }}>{children}</span>
      {active && (
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 12px rgba(16, 185, 129, 0.6)",
          }}
        />
      )}
    </Link>
  );
}

export default Navbar;    





