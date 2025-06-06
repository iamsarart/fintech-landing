/**
 * script.js
 * Handles:
 *  1. Sticky header on scroll
 *  2. Hamburger menu toggle
 *  3. Loan amount slider, tooltip & display
 *  4. Monthly payment calculation and display
 *  5. Form validation
 *  6. Countdown logic (Midsummer Eve default, New Year if ?counter=newyear)
 */

document.addEventListener("DOMContentLoaded", function () {
  // Header elements
  const header = document.getElementById("site-header");
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("main-nav");

  // Slider & form elements
  const amountSlider = document.getElementById("amount-slider");
  const amountDisplay = document.getElementById("amount-display");
  const sliderTooltip = document.getElementById("slider-tooltip");
  const paymentAmountEl = document.getElementById("payment-amount");
  const loanForm = document.getElementById("loan-form");

  // Set initial display for amount, tooltip, and monthly payment
  updateAmountDisplay();
  updateTooltipPosition();
  calculateMonthlyPayment();

  // Sticky header on scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });

  // Hamburger menu toggle
  hamburger.addEventListener("click", function () {
    mainNav.classList.toggle("open");
  });

  // Update display and tooltip when slider value changes
  amountSlider.addEventListener("input", function () {
    updateAmountDisplay();
    updateTooltipPosition();
    calculateMonthlyPayment();
  });

  // Form submission: simple client-side validation
  loanForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
      // Reset form after submission
      loanForm.reset();
      amountSlider.value = 10000;
      updateAmountDisplay();
      updateTooltipPosition();
      calculateMonthlyPayment();
    }
  });

  // Initialize countdown
  initializeCountdown();

  /** Updates the displayed loan amount text. */
  function updateAmountDisplay() {
    const val = parseInt(amountSlider.value, 10);
    const formatted = val.toLocaleString();
    amountDisplay.textContent = `€${formatted}`;
    sliderTooltip.textContent = `€${formatted}`;
  }

  /** Positions the tooltip above the slider thumb. */
  function updateTooltipPosition() {
    const min = parseInt(amountSlider.min, 10);
    const max = parseInt(amountSlider.max, 10);
    const val = parseInt(amountSlider.value, 10);
    const percent = (val - min) / (max - min);

    // Calculate slider pixel width and tooltip position
    const sliderRect = amountSlider.getBoundingClientRect();
    const offsetX = percent * sliderRect.width;

    // Position tooltip horizontally (centered above thumb)
    sliderTooltip.style.left = `${offsetX}px`;
  }

  /** Calculates monthly payment and updates the DOM. */
  function calculateMonthlyPayment() {
    const principal = parseInt(amountSlider.value, 10);
    const annualRate = 0.05; // 5%
    const months = 12;
    const totalWithInterest = principal * (1 + annualRate);
    const monthlyPayment = totalWithInterest / months;
    paymentAmountEl.textContent = `€${monthlyPayment.toFixed(2)}`;
  }

  /**
   * Validates the form fields:
   *  - Ensures loan amount is set (slider always has a value)
   *  - Name is not empty
   *  - Email contains '@'
   *  - Phone is at least 9 characters
   *  - Terms checkbox is checked
   * Returns true if valid, false otherwise.
   */
  function validateForm() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const termsCheckbox = document.getElementById("terms");

    // Full name validation
    if (nameInput.value.trim() === "") {
      alert("Please enter your full name.");
      nameInput.focus();
      return false;
    }

    // Email validation (basic)
    const emailVal = emailInput.value.trim();
    if (emailVal === "" || !emailVal.includes("@")) {
      alert("Please enter a valid email address.");
      emailInput.focus();
      return false;
    }

    // Phone validation (at least 9 chars)
    const phoneVal = phoneInput.value.trim();
    if (phoneVal.length < 9) {
      alert("Please enter a valid phone number (at least 9 digits).");
      phoneInput.focus();
      return false;
    }

    // Terms & conditions
    if (!termsCheckbox.checked) {
      alert("You must accept the terms and conditions.");
      termsCheckbox.focus();
      return false;
    }

    return true;
  }

  /**
   * Initializes the countdown clock.
   * Default target: Midsummer Eve (June 20, 2025 at 23:59:59).
   * If URL contains '?counter=newyear', target becomes Dec 31, 2025 at 23:59:59.
   */
  function initializeCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    // Determine target date
    const params = new URLSearchParams(window.location.search);
    let targetDate;
    if (params.get("counter") === "newyear") {
      targetDate = new Date("2025-12-31T23:59:59");
    } else {
      targetDate = new Date("2025-06-20T23:59:59");
    }

    // Update countdown every 1 second
    setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }, 1000);
  }
});