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

  const data = {
    _subject: "New consultation request — blackbezel.com",
    _template: "table",
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    business: form.company.value.trim(),
    industry: industrySelect.value === "Other" ? "Other: " + form.otherIndustry.value.trim() : industrySelect.value,
    state: form.state.value.trim(),
    country: form.country.value.trim(),
    footprint: form.footprint.value,
    employees: form.employees.value,
    services: Array.from(services).map((s) => s.value).join(", "),
    message: form.message.value.trim()
  };

  note.textContent = "Sending…";
  note.style.color = "";
  fetch("https://formsubmit.co/ajax/jaspreet.somal@gmail.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data)
  })
    .then((r) => {
      if (!r.ok) throw new Error("send failed");
      note.textContent = "Thanks, " + data.name + "! We received your request and will reach out within one business day.";
      form.reset();
      otherIndustryField.hidden = true;
    })
    .catch(() => {
      note.textContent = "Something went wrong — please try again in a moment.";
      note.style.color = "#ffb454";
    });
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Site theme — set to "v1" (dark) or "v2" (light, logo colors).
// Not exposed to visitors; change this value to switch the whole site.
const SITE_THEME = "v2";
if (SITE_THEME === "v2") document.body.classList.add("theme-v2");

// Animated active underline on nav links
const sectionLinks = Array.from(navLinks.querySelectorAll('a[href^="#"]')).filter((a) => !a.classList.contains("nav-cta"));
sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sectionLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});
