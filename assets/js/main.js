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
    this.lastScroll = 0;

    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
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
    if (this.navLinks.classList.contains("active")) {
      this.closeMenu();
      return;
    }
    this.openMenu();
  }

  openMenu() {
    clearTimeout(this._closeBgTimer);
    clearTimeout(this._openMenuTimer);

    // 1. First make the header blue (0.15s CSS transition)
    if (this.navbar) this.navbar.classList.add("menu-open");
    this.toggle.classList.add("active");
    this.toggle.setAttribute("aria-expanded", "true");
    this.toggle.setAttribute("aria-label", "Fechar menu");

    // 2. After bg transition, slide the menu down
    this._openMenuTimer = setTimeout(() => {
      this.navLinks.classList.add("active");
    }, 50);
  }

  closeMenu() {
    clearTimeout(this._closeBgTimer);
    clearTimeout(this._openMenuTimer);

    // 1. First slide the menu up
    this.navLinks.classList.remove("active");
    this.toggle.classList.remove("active");
    this.toggle.setAttribute("aria-expanded", "false");
    this.toggle.setAttribute("aria-label", "Abrir menu");

    // 2. After menu closes (500ms), fade the bg to transparent
    this._closeBgTimer = setTimeout(() => {
      if (this.navbar) this.navbar.classList.remove("menu-open");
    }, 500);
  }

  handleScroll() {
    if (!this.navbar) return;
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      this.navbar.classList.add("scrolled");
    } else {
      this.navbar.classList.remove("scrolled");
    }

    this.lastScroll = scrollY;
  }

  handleResize() {
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
    this.items = document.querySelectorAll(".faq-item, .service-faq-item");
    if (this.items.length === 0) return;
    this.init();
  }

  init() {
    this.instances = [];
    this.items.forEach((item) => {
      this.instances.push(new FaqAccordionItem(item, this));
    });
  }

  closeOthers(currentItem) {
    const parent = currentItem.el.parentElement;
    this.instances.forEach((instance) => {
      if (
        instance !== currentItem &&
        instance.el.parentElement === parent &&
        instance.el.open &&
        !instance.isClosing
      ) {
        instance.shrink();
      }
    });
  }
}

class FaqAccordionItem {
  constructor(el, manager) {
    this.el = el;
    this.manager = manager;
    this.summary = el.querySelector("summary");
    this.content = el.querySelector(".faq-answer, .service-faq-answer");
    if (!this.summary || !this.content) return;

    this.animation = null;
    this.contentAnimation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.summary.addEventListener("click", (e) => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();

    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  open() {
    if (this.manager) {
      this.manager.closeOthers(this);
    }

    this.isClosing = false;
    this.el.classList.remove("is-closing");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = prefersReducedMotion ? 0 : 320;

    const startHeight = this.el.offsetHeight;

    this.el.style.height = "auto";
    this.el.open = true;

    const endHeight = this.el.offsetHeight;

    this.isExpanding = true;
    this.el.style.overflow = "hidden";

    if (this.animation) this.animation.cancel();
    if (this.contentAnimation) this.contentAnimation.cancel();

    if (duration === 0 || !this.el.animate) {
      this.onAnimationFinish(true);
      return;
    }

    this.animation = this.el.animate(
      {
        height: [`${startHeight}px`, `${endHeight}px`],
      },
      {
        duration: duration,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      }
    );

    this.contentAnimation = this.content.animate(
      {
        opacity: [0, 1],
        transform: ["translateY(-8px)", "translateY(0)"],
      },
      {
        duration: duration,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      }
    );

    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => {
      this.isExpanding = false;
    };
  }

  shrink() {
    this.isExpanding = false;
    this.isClosing = true;
    this.el.classList.add("is-closing");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = prefersReducedMotion ? 0 : 280;

    const startHeight = this.el.offsetHeight;
    const computedStyle = window.getComputedStyle(this.el);
    const paddingBorder =
      (parseFloat(computedStyle.paddingTop) || 0) +
      (parseFloat(computedStyle.paddingBottom) || 0) +
      (parseFloat(computedStyle.borderTopWidth) || 0) +
      (parseFloat(computedStyle.borderBottomWidth) || 0);
    const endHeight = this.summary.offsetHeight + paddingBorder;

    this.el.style.overflow = "hidden";

    if (this.animation) this.animation.cancel();
    if (this.contentAnimation) this.contentAnimation.cancel();

    if (duration === 0 || !this.el.animate) {
      this.onAnimationFinish(false);
      return;
    }

    this.animation = this.el.animate(
      {
        height: [`${startHeight}px`, `${endHeight}px`],
      },
      {
        duration: duration,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      }
    );

    this.contentAnimation = this.content.animate(
      {
        opacity: [1, 0],
        transform: ["translateY(0)", "translateY(-6px)"],
      },
      {
        duration: Math.max(120, duration - 60),
        easing: "ease-in",
      }
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => {
      this.isClosing = false;
      this.el.classList.remove("is-closing");
    };
  }

  onAnimationFinish(isOpen) {
    this.el.open = isOpen;
    this.animation = null;
    this.contentAnimation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.classList.remove("is-closing");
    this.el.style.height = "";
    this.el.style.overflow = "";
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
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
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