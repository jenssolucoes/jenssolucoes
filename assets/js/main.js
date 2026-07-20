/*================================  */
/*================================  */
/* ====== HEADER COMPONENT ======== */
/*================================  */
/*================================ */

class Header {
  constructor() {
    this.navbar = document.querySelector(".nav-bar");
    this.toggle = document.querySelector(".menu-toggle");
    this.navLinks = document.querySelector(".nav-links");
    this.topbar = document.querySelector(".top-bar");
    this.topbarHeight = 0;
    this.lastScroll = 0;

    this.init();
  }

  init() {
    this.calculateTopbarHeight();
    this.bindEvents();
    this.handleScroll();
  }

  calculateTopbarHeight() {
    if (this.topbar) {
      const styles = window.getComputedStyle(this.topbar);
      if (styles.display !== "none") {
        this.topbarHeight = this.topbar.offsetHeight;
      } else {
        this.topbarHeight = 0;
      }
    }
  }

  bindEvents() {
    window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
    window.addEventListener("resize", () => this.handleResize(), { passive: true });

    if (this.toggle && this.navLinks) {
      this.toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });

      // Fecha o menu ao clicar em um link (mobile)
      this.navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => this.closeMenu());
      });

      // Fecha o menu ao clicar fora do header/menu
      document.addEventListener("click", (e) => {
        if (!this.navLinks.classList.contains("active")) return;
        const clickedInsideNav = this.navbar.contains(e.target);
        if (!clickedInsideNav) this.closeMenu();
      });

      // Fecha o menu ao rolar a página
      window.addEventListener(
        "scroll",
        () => {
          if (this.navLinks.classList.contains("active")) this.closeMenu();
        },
        { passive: true }
      );

      // Fecha o menu ao pressionar ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.navLinks.classList.contains("active")) {
          this.closeMenu();
        }
      });
    }
  }

  toggleMenu() {
    const isOpen = this.navLinks.classList.toggle("active");
    this.toggle.classList.toggle("active", isOpen);
    this.toggle.setAttribute("aria-expanded", isOpen);
    this.toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  }

  closeMenu() {
    this.navLinks.classList.remove("active");
    this.toggle.classList.remove("active");
    this.toggle.setAttribute("aria-expanded", "false");
    this.toggle.setAttribute("aria-label", "Abrir menu");
  }

  handleScroll() {
    if (!this.navbar) return;
    const scrollY = window.scrollY;

    if (scrollY > this.topbarHeight) {
      this.navbar.classList.add("scrolled");
    } else {
      this.navbar.classList.remove("scrolled");
    }

    this.lastScroll = scrollY;
  }

  handleResize() {
    this.calculateTopbarHeight();

    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 992 && this.navLinks) {
      this.closeMenu();
    }
  }
}

/*================================  */
/*================================  */
/* ====== SMOOTH SCROLL =========== */
/*================================  */
/*================================ */

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navbarHeight = 72;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top: targetPos, behavior: "smooth" });
        }
      });
    });
  }
}

/*================================  */
/*================================  */
/* ====== FAQ ACCORDION =========== */
/*================================  */
/*================================ */

class FaqAccordion {
  constructor() {
    this.items = document.querySelectorAll(".faq__item");
    if (this.items.length === 0) return;
    this.init();
  }

  init() {
    this.items.forEach((item) => {
      const btn = item.querySelector(".faq__question");
      if (btn) {
        btn.addEventListener("click", () => this.toggle(item));
      }
    });
  }

  toggle(clickedItem) {
    const isActive = clickedItem.classList.contains("active");

    // Close all
    this.items.forEach((item) => {
      item.classList.remove("active");
      const btn = item.querySelector(".faq__question");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });

    // Open clicked if it was closed
    if (!isActive) {
      clickedItem.classList.add("active");
      const btn = clickedItem.querySelector(".faq__question");
      if (btn) btn.setAttribute("aria-expanded", "true");
    }
  }
}

/*================================  */
/* ====== FLOATING BUTTONS ======== */
/*================================  */

class FloatingButtons {
  constructor() {
    this.scrollToTopBtn = document.getElementById("scroll-to-top");
    this.lastScrollTop = 0;
    this.init();
  }

  init() {
    if (!this.scrollToTopBtn) return;

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Clique no botão: rola suavemente até o topo
    this.scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    this.handleScroll(window.scrollY);
  }

  handleScroll(scrollY) {
    // Mostra o botão só quando: passou de 200px E está rolando pra CIMA
    if (scrollY > 200 && scrollY < this.lastScrollTop) {
      this.scrollToTopBtn.classList.add("show");
    } else if (scrollY <= 200 || scrollY > this.lastScrollTop) {
      this.scrollToTopBtn.classList.remove("show");
    }

    // Guarda a posição atual pra comparar na próxima rolagem
    this.lastScrollTop = scrollY <= 0 ? 0 : scrollY;
  }
}

/*================================  */
/*================================  */
/* ====== INIT ==================== */
/*================================  */
/*================================ */

document.addEventListener("DOMContentLoaded", () => {
  new Header();
  new SmoothScroll();
  new FaqAccordion();
  new FloatingButtons();

  // Initialize Swiper for Reviews
  if (typeof Swiper !== "undefined") {
    new Swiper(".reviews__slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });

    // Reinitialize Popular Services Swiper after inline scripts run
    // Using requestAnimationFrame to ensure this runs AFTER inline <script> tags
    requestAnimationFrame(() => {
      const popularSwiperEl = document.querySelector(".popular-swiper");
      if (popularSwiperEl && popularSwiperEl.swiper) {
        popularSwiperEl.swiper.destroy(true, true);
      }

      if (popularSwiperEl) {
        new Swiper(".popular-swiper", {
          slidesPerView: "auto",
          spaceBetween: 12,
          watchOverflow: true,
          watchSlidesProgress: true,
          navigation: {
            nextEl: "#popular-next",
            prevEl: "#popular-prev",
            disabledClass: "swiper-button-disabled",
          },
          pagination: {
            el: ".popular-swiper-pagination",
            clickable: true,
          },
          breakpoints: {
            900: { spaceBetween: 16 },
            1200: { spaceBetween: 16 },
          },
        });
      }
    });
  }
});