"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import GoogleTranslateButton from "./GoogleTranslateButton"
import "../styles/theme.css"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleAboutDropdown = () => {
    setIsAboutDropdownOpen(!isAboutDropdownOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsAboutDropdownOpen(false)
  }

  return (
    <nav
      className={`navbar fixed w-full z-50 transition-all duration-300 ${isScrolled ? "shadow-md py-2" : "py-4"}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold" style={{color: 'var(--primary-dark)'}}>CDRP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>

            <div className="relative group">
              <button
                onClick={toggleAboutDropdown}
                className="nav-link flex items-center focus:outline-none"
              >
                About
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              <div
                className={`nav-dropdown absolute left-0 mt-2 w-56 transition-all duration-200 ${isAboutDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"} group-hover:opacity-100 group-hover:visible`}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    to="/about"
                    className="nav-link block px-4 py-2 text-sm"
                    role="menuitem"
                  >
                    About CDRP
                  </Link>
                  <Link
                    to="/about/how-it-works"
                    className="nav-link block px-4 py-2 text-sm"
                    role="menuitem"
                  >
                    How CDRP Works
                  </Link>
                  <Link
                    to="/about/who-can-use"
                    className="nav-link block px-4 py-2 text-sm"
                    role="menuitem"
                  >
                    Who Can Use CDRP
                  </Link>
                  <Link
                    to="/about/in-action"
                    className="nav-link block px-4 py-2 text-sm"
                    role="menuitem"
                  >
                    CDRP in Action
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/contact" className="nav-link">
              Contact Us
            </Link>

            <Link to="/reports/how-to-report" className="nav-link">
              Reports
            </Link>

            <Link to="/volunteer/how-to-volunteer" className="nav-link">
              Volunteer
            </Link>

            <Link to="/faq" className="nav-link">
              FAQ
            </Link>

            <GoogleTranslateButton />

            <Link
              to="/login"
              className="btn btn-primary"
            >
              Signup/Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <GoogleTranslateButton />
            <button onClick={toggleMobileMenu} className="outline-none focus:outline-none" aria-label="Toggle menu">
              <svg
                className="w-6 h-6" style={{color: 'var(--primary-dark)'}}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                Home
              </Link>

              <div>
                <button
                  onClick={toggleAboutDropdown}
                  className="nav-link flex items-center focus:outline-none w-full text-left"
                >
                  About
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isAboutDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      to="/about"
                      className="block text-sm text-gray-700 hover:text-blue-700 py-1"
                      onClick={closeMobileMenu}
                    >
                      About CDRP
                    </Link>
                    <Link
                      to="/about/how-it-works"
                      className="block text-sm text-gray-700 hover:text-blue-700 py-1"
                      onClick={closeMobileMenu}
                    >
                      How CDRP Works
                    </Link>
                    <Link
                      to="/about/who-can-use"
                      className="block text-sm text-gray-700 hover:text-blue-700 py-1"
                      onClick={closeMobileMenu}
                    >
                      Who Can Use CDRP
                    </Link>
                    <Link
                      to="/about/in-action"
                      className="block text-sm text-gray-700 hover:text-blue-700 py-1"
                      onClick={closeMobileMenu}
                    >
                      CDRP in Action
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/contact"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>

              <Link
                to="/reports/how-to-report"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                Reports
              </Link>

              <Link
                to="/volunteer/how-to-volunteer"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                Volunteer
              </Link>

              <Link
                to="/faq"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                FAQ
              </Link>

              <Link
                to="/login"
                className="text-white bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-md font-medium transition-colors inline-block text-center"
                onClick={closeMobileMenu}
              >
                Signup/Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
