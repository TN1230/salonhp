document.addEventListener('DOMContentLoaded', function() {

    // --- Single Page Application (SPA) Navigation ---
    const navLinks = document.querySelectorAll('.nav-link-js');
    const contentSections = document.querySelectorAll('.content-section');
    const mobileMenu = document.getElementById('mobile-menu');

    const switchPage = (targetId) => {
        // Hide all sections
        contentSections.forEach(section => {
            if (!section.classList.contains('hidden')) {
                section.classList.add('hidden');
            }
        });

        // Show the target section
        const targetSection = document.getElementById(targetId + '-content');
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        // Update active link
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Close mobile menu if open
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
        
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // remove '#'
            switchPage(targetId);
        });
    });

    // Show home page by default
    switchPage('home');

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Slideshow ---
    let slideIndex = 1;
    let slideInterval;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    function showSlides(n) {
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }

        slides.forEach(slide => slide.style.display = "none");
        dots.forEach(dot => dot.classList.remove("active"));
        
        if (slides[slideIndex - 1]) {
            slides[slideIndex - 1].style.display = "block";
        }
        if (dots[slideIndex - 1]) {
           dots[slideIndex - 1].classList.add("active");
        }
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }
    
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }
    
    function startSlideShow() {
        stopSlideShow(); // Ensure no multiple intervals are running
        slideInterval = setInterval(() => {
            plusSlides(1);
        }, 5000); // Change image every 5 seconds
    }
    
    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    if (slides.length > 0) {
        document.querySelector(".prev")?.addEventListener('click', () => { plusSlides(-1); resetInterval(); });
        document.querySelector(".next")?.addEventListener('click', () => { plusSlides(1); resetInterval(); });
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { currentSlide(index + 1); resetInterval(); });
        });
        
        function resetInterval() {
            stopSlideShow();
            startSlideShow();
        }

        showSlides(slideIndex);
        startSlideShow();
    }


    // --- Menu Page Image Preview ---
    const menuItems = document.querySelectorAll('.menu-item');
    const previewBox = document.querySelector('.menu-image-preview');
    let cutInterval;

    if (menuItems.length > 0 && previewBox) {
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                clearInterval(cutInterval);
                const img1 = this.dataset.image1;
                const img2 = this.dataset.image2;

                if (img1) {
                    previewBox.style.backgroundImage = `url('${img1}')`;
                }

                if (img2) {
                    let currentImage = 1;
                    cutInterval = setInterval(() => {
                        if (currentImage === 1) {
                            previewBox.style.backgroundImage = `url('${img2}')`;
                            currentImage = 2;
                        } else {
                            previewBox.style.backgroundImage = `url('${img1}')`;
                            currentImage = 1;
                        }
                    }, 3000); // Switch every 3 seconds
                }
            });

            item.addEventListener('mouseleave', function() {
                clearInterval(cutInterval);
            });
        });
        // Set a default image
        const firstItemImage = menuItems[0].dataset.image1;
        if(firstItemImage){
             previewBox.style.backgroundImage = `url('${firstItemImage}')`;
        }
    }

    // --- Reservation Form Validation ---
    const form = document.getElementById('reservation-form');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.error-msg').forEach(el => el.classList.add('hidden'));

            // Name validation
            const name = document.getElementById('name');
            if (name.value.trim() === '') {
                document.getElementById('name-error').textContent = 'お名前を入力してください。';
                document.getElementById('name-error').classList.remove('hidden');
                isValid = false;
            }

            // Email validation
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '' || !emailRegex.test(email.value)) {
                 document.getElementById('email-error').textContent = '有効なメールアドレスを入力してください。';
                 document.getElementById('email-error').classList.remove('hidden');
                isValid = false;
            }
            
            // Date validation
            const date = document.getElementById('date');
            const selectedDate = new Date(date.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to beginning of today
            if (date.value === '' || selectedDate < today) {
                document.getElementById('date-error').textContent = '本日以降の日付を選択してください。';
                document.getElementById('date-error').classList.remove('hidden');
                isValid = false;
            }

            // Menu validation
            const menu = document.getElementById('menu-select');
            if (menu.value === '') {
                document.getElementById('menu-error').textContent = 'メニューを選択してください。';
                document.getElementById('menu-error').classList.remove('hidden');
                isValid = false;
            }

            if (isValid) {
                document.getElementById('form-container').classList.add('hidden');
                document.getElementById('success-message').classList.remove('hidden');
            }
        });
    }
});

