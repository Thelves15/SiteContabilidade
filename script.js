document.addEventListener("DOMContentLoaded", () => {
  // --- Header Scroll Effect ---
  const header = document.querySelector(".header")

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  }

  // --- Mobile Navigation ---
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-list a")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
    })
  }

  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu && navToggle) {
          navMenu.classList.remove("active")
          navToggle.classList.remove("active")
        }
      })
    })
  }

  // --- Testimonial Carousel ---
  const testimonialCards = document.querySelectorAll(".testimonial-card")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const dots = document.querySelectorAll(".dot")
  let currentSlide = 0
  let autoPlayInterval

  function updateCarousel() {
    // Remove active class from all cards and dots
    testimonialCards.forEach((card, index) => {
      card.classList.remove("active")
      card.style.display = "none"
    })

    dots.forEach((dot) => {
      dot.classList.remove("active")
    })

    // Show current slide
    if (testimonialCards[currentSlide]) {
      testimonialCards[currentSlide].style.display = "block"
      testimonialCards[currentSlide].classList.add("active")
    }

    if (dots[currentSlide]) {
      dots[currentSlide].classList.add("active")
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % testimonialCards.length
    updateCarousel()
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length
    updateCarousel()
  }

  function goToSlide(index) {
    currentSlide = index
    updateCarousel()
  }

  // Initialize carousel
  if (testimonialCards.length > 0) {
    updateCarousel()

    // Auto-play
    autoPlayInterval = setInterval(nextSlide, 5000)
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      clearInterval(autoPlayInterval)
      nextSlide()
      autoPlayInterval = setInterval(nextSlide, 5000)
    })
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      clearInterval(autoPlayInterval)
      prevSlide()
      autoPlayInterval = setInterval(nextSlide, 5000)
    })
  }

  // Dots navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      clearInterval(autoPlayInterval)
      goToSlide(index)
      autoPlayInterval = setInterval(nextSlide, 5000)
    })
  })

  // Pause on hover
  const carousel = document.querySelector(".testimonials-carousel")
  if (carousel) {
    carousel.addEventListener("mouseenter", () => {
      clearInterval(autoPlayInterval)
    })

    carousel.addEventListener("mouseleave", () => {
      autoPlayInterval = setInterval(nextSlide, 5000)
    })
  }

  // --- Form Submission Handling ---
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      if (!validateForm()) {
        return false
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]')
      if (!submitBtn) return

      const originalText = submitBtn.innerHTML

      // Show loading state
      submitBtn.classList.add("btn-loading")
      submitBtn.disabled = true

      // Get form data
      const formData = new FormData(contactForm)
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        service: formData.get("service"),
        message: formData.get("message"),
      }

      try {
        // Simulate form submission (replace with actual endpoint)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Show success message
        showNotification("Mensagem enviada com sucesso! Entrarei em contato em breve.", "success")
        contactForm.reset()

        // Open WhatsApp with form data
        const whatsappMessage = `Olá Márcia! Enviei uma mensagem pelo site:

Nome: ${data.name}
E-mail: ${data.email}
Telefone: ${data.phone}
Serviço: ${data.service}
Mensagem: ${data.message}`

        setTimeout(() => {
          openWhatsApp(whatsappMessage)
        }, 1000)
      } catch (error) {
        showNotification("Erro ao enviar mensagem. Tente novamente.", "error")
      } finally {
        // Reset button state
        submitBtn.classList.remove("btn-loading")
        submitBtn.disabled = false
        submitBtn.innerHTML = originalText
      }
    })
  }

  // --- Notification System ---
  function showNotification(message, type) {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
      <span>${message}</span>
    `

    // Add notification styles
    notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 12px;
          color: white;
          font-weight: 500;
          z-index: 10000;
          transform: translateX(400px);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 350px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 10px;
      `

    if (type === "success") {
      notification.style.background = "linear-gradient(135deg, #10B981, #059669)"
    } else {
      notification.style.background = "linear-gradient(135deg, #EF4444, #DC2626)"
    }

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(400px)"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 5000)
  }

  // --- WhatsApp Integration ---
  function openWhatsApp(message = "") {
    const phone = "5598970269290" // Replace with actual phone number
    const defaultMessage = message || "Olá Márcia! Gostaria de saber mais sobre os serviços contábeis para MEI."
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`
    window.open(url, "_blank")
  }

  const whatsappBtn = document.getElementById("whatsapp-btn")
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", (e) => {
      e.preventDefault()
      openWhatsApp("Olá Márcia! Vi seu site e gostaria de falar sobre os serviços para MEI.")
    })
  }

  const aboutWhatsapp = document.getElementById("about-whatsapp")
  if (aboutWhatsapp) {
    aboutWhatsapp.addEventListener("click", (e) => {
      e.preventDefault()
      openWhatsApp("Olá Márcia! Gostaria de conhecer melhor seu trabalho e conversar sobre meu MEI.")
    })
  }

  const whatsappFloat = document.getElementById("whatsapp-float")
  if (whatsappFloat) {
    whatsappFloat.addEventListener("click", () => {
      openWhatsApp()
    })
  }

  // --- Form Validation ---
  function validateForm() {
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const phone = document.getElementById("phone")
    const service = document.getElementById("service")

    if (!name || !name.value.trim()) {
      showNotification("Por favor, preencha seu nome.", "error")
      return false
    }

    if (!email || !email.value.trim() || !isValidEmail(email.value.trim())) {
      showNotification("Por favor, insira um e-mail válido.", "error")
      return false
    }

    if (!phone || !phone.value.trim()) {
      showNotification("Por favor, preencha seu telefone.", "error")
      return false
    }

    if (!service || !service.value) {
      showNotification("Por favor, selecione um serviço.", "error")
      return false
    }

    return true
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // --- Phone Number Formatting ---
  const phoneInput = document.getElementById("phone")
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")

      if (value.length <= 11) {
        if (value.length <= 2) {
          value = value.replace(/(\d{0,2})/, "($1")
        } else if (value.length <= 7) {
          value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
        } else {
          value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
        }
      }

      e.target.value = value
    })
  }

  // --- Accessibility Improvements ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Close mobile menu on escape
      if (navMenu && navToggle) {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
      }
    }
  })

  console.log("Márcia Carla Contabilidade - Site carregado com sucesso! 🚀")
})
