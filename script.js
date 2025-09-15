/*
 * Hair Salon Lumière - Common Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Single Page Application (SPA) Navigation ---
    const navLinks = document.querySelectorAll('.nav-link-js');
    const contentSections = document.querySelectorAll('.content-section');
    const mobileMenu = document.getElementById('mobile-menu');
    const headerNavLinks = document.querySelectorAll('.header .nav-link');

    const setActiveLink = (targetId) => {
        headerNavLinks.forEach(link => {
            // Use endsWith to correctly match '#home' with the logo link as well
            if (link.hash === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    const switchPage = (targetId) => {
        contentSections.forEach(section => {
            if (`#${section.id}` === targetId) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
        setActiveLink(targetId);
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.hash; // e.g., '#menu'
            
            // For logo click, ensure it always goes to home
            if(link.classList.contains('logo-link')) {
                 switchPage('#home-content');
            } else {
                 switchPage(targetId + '-content'); // e.g., '#menu-content'
            }

            // Close mobile menu if open
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Initial page load check
    const initialTarget = window.location.hash ? window.location.hash + '-content' : '#home-content';
    switchPage(initialTarget);
    
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });


    // --- Hero Slideshow ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slideshow-container .slide');
    const dots = document.querySelectorAll('.slideshow-container .dot');
    let slideInterval;

    const showSlides = (n) => {
        slideIndex = n;
        if (slideIndex >= slides.length) { slideIndex = 0; }
        if (slideIndex < 0) { slideIndex = slides.length - 1; }

        slides.forEach(slide => slide.style.display = "none");
        dots.forEach(dot => dot.classList.remove("active-dot"));

        if (slides[slideIndex]) {
            slides[slideIndex].style.display = "block";
            slides[slideIndex].classList.add('fade');
        }
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add("active-dot");
        }
    };

    const plusSlides = (n) => {
        showSlides(slideIndex += n);
        resetSlideInterval();
    };

    const currentSlide = (n) => {
        showSlides(slideIndex = n);
        resetSlideInterval();
    };

    const startSlideInterval = () => {
        slideInterval = setInterval(() => {
            plusSlides(1);
        }, 5000); // Change image every 5 seconds
    };
    
    const resetSlideInterval = () => {
        clearInterval(slideInterval);
        startSlideInterval();
    };

    // Event listeners for slideshow controls if they exist
    const prevButton = document.querySelector('.slideshow-container .prev');
    const nextButton = document.querySelector('.slideshow-container .next');
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => plusSlides(-1));
        nextButton.addEventListener('click', () => plusSlides(1));
    }
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => currentSlide(index));
    });

    if (slides.length > 0) {
        showSlides(slideIndex);
        startSlideInterval();
    }


    // --- Menu Page Image Preview ---
    if (window.matchMedia('(min-width: 992px)').matches) {
        const menuItems = document.querySelectorAll('#menu-content .menu-item');
        const previewImage = document.getElementById('menu-preview-image');
        let imageSliderInterval = null;

        if (menuItems.length > 0 && previewImage) {
            const defaultImageSrc = previewImage.src; // Store the initial image

            menuItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    clearInterval(imageSliderInterval);
                    const imageUrlsString = item.getAttribute('data-image');
                    const imageUrls = imageUrlsString.split(',');

                    if (imageUrls.length > 1) { // Slideshow for 'cut'
                        let currentImageIndex = 0;
                        const updateImage = () => {
                            previewImage.style.opacity = 0;
                            setTimeout(() => {
                                previewImage.src = imageUrls[currentImageIndex];
                                previewImage.style.opacity = 1;
                                currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
                            }, 200);
                        };
                        updateImage();
                        imageSliderInterval = setInterval(updateImage, 3000);
                    } else { // Single image for other items
                        const imageUrl = imageUrls[0];
                        if (imageUrl && previewImage.src !== imageUrl) {
                            previewImage.style.opacity = 0;
                            setTimeout(() => {
                                previewImage.src = imageUrl;
                                previewImage.style.opacity = 1;
                            }, 200);
                        }
                    }
                });
            });

            // Reset image on leaving the menu area
            const menuList = document.querySelector('#menu-content .menu-list');
            if (menuList) {
                menuList.addEventListener('mouseleave', () => {
                    clearInterval(imageSliderInterval);
                    if (previewImage.src !== defaultImageSrc) {
                        previewImage.style.opacity = 0;
                        setTimeout(() => {
                            previewImage.src = defaultImageSrc;
                            previewImage.style.opacity = 1;
                        }, 200);
                    }
                });
            }
        }
    }


    // --- Reservation Form Validation ---
    const form = document.getElementById('reservation-form');
    if (form) {
        form.addEventListener('submit', (e) => {
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
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                 document.getElementById('email-error').textContent = '有効なメールアドレスを入力してください。';
                 document.getElementById('email-error').classList.remove('hidden');
                isValid = false;
            }

            // Date validation
            const date = document.getElementById('date');
            const selectedDate = new Date(date.value);
            const today = new Date();
            today.setHours(0,0,0,0); // Reset time to compare dates only
            if (date.value === '' || selectedDate < today) {
                document.getElementById('date-error').textContent = '本日以降の日付を選択してください。';
                document.getElementById('date-error').classList.remove('hidden');
                isValid = false;
            }

            // Menu validation
            const menuSelect = document.getElementById('menu-select');
            if (menuSelect.value === '') {
                 document.getElementById('menu-error').textContent = 'メニューを選択してください。';
                 document.getElementById('menu-error').classList.remove('hidden');
                isValid = false;
            }

            // If all valid, show success message
            if (isValid) {
                document.getElementById('form-container').classList.add('hidden');
                document.getElementById('success-message').classList.remove('hidden');
            }
        });
    }

});
