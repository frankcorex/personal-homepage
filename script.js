"use strict";

const header = document.getElementById("site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.getElementById("site-nav");
const backToTop = document.querySelector(".back-to-top");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateScrollUI() {
  const hasScrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", hasScrolled);
  backToTop.classList.toggle("visible", window.scrollY > 600);
}

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "打开导航菜单");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "打开导航菜单" : "关闭导航菜单");
  navigation.classList.toggle("open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

document.getElementById("current-year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px" });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = navigation.querySelectorAll('a[href^="#"]');

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-30% 0px -60%", threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));
}
