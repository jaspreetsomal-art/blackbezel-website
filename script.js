// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// Contact form (front-end only — wire to a backend or form service later)
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
const industrySelect = document.getElementById("industry");
const otherIndustryField = document.getElementById("otherIndustryField");

industrySelect.addEventListener("change", () => {
  const isOther = industrySelect.value === "Other";
  otherIndustryField.hidden = !isOther;
  if (!isOther) document.getElementById("otherIndustry").value = "";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const missing = [];

  if (!form.name.value.trim()) missing.push("your name");
  const email = form.email.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) missing.push("a valid work email");
  if (!form.company.value.trim()) missing.push("business name");
  if (!industrySelect.value) missing.push("industry");
  if (industrySelect.value === "Other" && !form.otherIndustry.value.trim()) missing.push("your industry");
  if (!form.state.value.trim()) missing.push("state");
  if (!form.country.value.trim()) missing.push("country");
  if (!form.footprint.value) missing.push("operating footprint");
  if (!form.employees.value) missing.push("number of employees");
  const services = form.querySelectorAll('input[name="services"]:checked');
  if (services.length === 0) missing.push("at least one service needed");

  if (missing.length > 0) {
    note.textContent = "Please provide: " + missing.join(", ") + ".";
    note.style.color = "#ffb454";
    return;
  }

  note.textContent = "Thanks, " + form.name.value.trim() + "! We received your request and will reach out within one business day.";
  note.style.color = "";
  form.reset();
  otherIndustryField.hidden = true;
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle — Version 1 (dark) / Version 2 (light, logo colors)
const themeLi = document.createElement("li");
const themeToggle = document.createElement("button");
themeToggle.type = "button";
themeToggle.className = "theme-toggle";
themeToggle.id = "themeToggle";
themeLi.appendChild(themeToggle);
navLinks.insertBefore(themeLi, navLinks.querySelector(".nav-cta").parentElement);

function applyTheme(v2) {
  document.body.classList.toggle("theme-v2", v2);
  themeToggle.textContent = v2 ? "Version 1" : "Version 2";
  themeToggle.title = v2 ? "Switch to Version 1 (dark theme)" : "Switch to Version 2 (light theme)";
}

applyTheme(localStorage.getItem("bb-theme") === "v2");

themeToggle.addEventListener("click", () => {
  const v2 = !document.body.classList.contains("theme-v2");
  localStorage.setItem("bb-theme", v2 ? "v2" : "v1");
  applyTheme(v2);
});

// Animated active underline on nav links
const sectionLinks = Array.from(navLinks.querySelectorAll('a[href^="#"]')).filter((a) => !a.classList.contains("nav-cta"));
sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sectionLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});
