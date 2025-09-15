document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Single Page App Navigation ---
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-js');
    const contentSections = document.querySelectorAll('.content-section');

    const navigateTo = (hash) => {
        const targetId = hash.substring(1) + '-content';
        const targetSection = document.getElementById(targetId);

        // Hide all sections and clean up animation classes
        contentSections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('page-enter-active');
        });

        // Show and animate the target section
        if (targetSection) {
            targetSection.classList.remove('hidden');
            // Force reflow to ensure animation runs after display property changes
            void targetSection.offsetWidth;
            targetSection.classList.add('page-enter-active');
        }

        // Update active state on nav links
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        window.scrollTo(0, 0);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = link.getAttribute('href');
            navigateTo(hash);
            
            // Close mobile menu on navigation
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Show initial content based on URL hash or default to #home
    const initialHash = window.location.hash || '#home';
    navigateTo(initialHash);


    // --- Slideshow ---
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        let slideIndex = 1;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        let slideInterval;

        const showSlides = (n) => {
            if (n > slides.length) { slideIndex = 1 }
            if (n < 1) { slideIndex = slides.length }
            
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[slideIndex - 1].classList.add('active');
            dots[slideIndex - 1].classList.add('active');
        };

        const plusSlides = (n) => {
            showSlides(slideIndex += n);
            resetInterval();
        };

        const currentSlide = (n) => {
            showSlides(slideIndex = n);
            resetInterval();
        };

        const startInterval = () => {
            slideInterval = setInterval(() => {
                plusSlides(1);
            }, 5000); // Change image every 5 seconds
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };
        
        document.querySelector('.prev')?.addEventListener('click', () => plusSlides(-1));
        document.querySelector('.next')?.addEventListener('click', () => plusSlides(1));
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => currentSlide(index + 1));
        });

        showSlides(slideIndex);
        startInterval();
    }


    // --- Reservation Form Validation ---
    const form = document.getElementById('reservation-form');
    if (form) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const dateInput = document.getElementById('date');
        const menuInput = document.getElementById('menu-select');

        // Set min date for date input
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);

        const showError = (inputId, message) => {
            const errorElement = document.getElementById(`${inputId}-error`);
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            document.getElementById(inputId).classList.add('input-error');
        };

        const hideError = (inputId) => {
            document.getElementById(`${inputId}-error`).classList.add('hidden');
             document.getElementById(inputId).classList.remove('input-error');
        };

        const validateEmail = (email) => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Name validation
            if (nameInput.value.trim() === '') {
                showError('name', 'お名前を入力してください。');
                isValid = false;
            } else {
                hideError('name');
            }

            // Email validation
            if (!validateEmail(emailInput.value)) {
                showError('email', '有効なメールアドレスを入力してください。');
                isValid = false;
            } else {
                hideError('email');
            }

            // Date validation
            if (dateInput.value === '' || new Date(dateInput.value) < new Date(today)) {
                 showError('date', '本日以降の日付を選択してください。');
                isValid = false;
            } else {
                hideError('date');
            }

            // Menu validation
            if (menuInput.value === '') {
                showError('menu', 'メニューを選択してください。');
                isValid = false;
            } else {
                hideError('menu');
            }

            if (isValid) {
                form.classList.add('hidden');
                document.getElementById('success-message').classList.remove('hidden');
            }
        });
    }
});

