// Initialize Lucide Icons
lucide.createIcons();

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ============================================================
// PORTFOLIO RENDERER — reads from manifest.json
// ============================================================

function titleFromFilename(name) {
    return name
        .replace(/\.[^.]+$/, '')
        .replace(/[_-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function createCard(filename, category) {
    const el = document.createElement('div');
    el.className = `portfolio-item ${category} reveal-scroll`;
    el.setAttribute('data-category', category);

    let folder = '';
    let categoryName = '';
    
    if (category === 'longForm') {
        folder = 'Long form';
        categoryName = 'LONG FORM';
    } else if (category === 'shortsReels') {
        folder = 'Shorts-reels';
        categoryName = 'SHORTS/REELS';
    } else if (category === 'graphicDesign') {
        folder = 'Graphic design';
        categoryName = 'GRAPHIC DESIGN';
    }

    const src = `${folder}/${encodeURIComponent(filename)}`;
    const title = titleFromFilename(filename);

    const isVideo = /\.(mp4|mov|webm|mkv)$/i.test(filename);
    
    let mediaHtml;
    if (isVideo) {
        mediaHtml = `<video autoplay loop muted playsinline src="${src}"></video>`;
    } else {
        mediaHtml = `<img src="${src}" alt="${title}" loading="lazy">`;
    }

    el.innerHTML = `
        <div class="media-container">
            ${mediaHtml}
        </div>
        <div class="item-info">
            <span class="item-category">${categoryName}</span>
            <h3 class="item-title">${title}</h3>
        </div>
    `;
    return el;
}

async function loadPortfolio() {
    const grid = document.getElementById('portfolioGrid');
    const loader = document.getElementById('gridLoader');

    try {
        const res = await fetch('manifest.json');
        if (!res.ok) throw new Error('manifest.json not found');
        const data = await res.json();

        if (loader) loader.remove();

        if (data.longForm) {
            data.longForm.forEach(file => {
                grid.appendChild(createCard(file, 'longForm'));
            });
        }

        if (data.shortsReels) {
            data.shortsReels.forEach(file => {
                grid.appendChild(createCard(file, 'shortsReels'));
            });
        }

        if (data.graphicDesign) {
            data.graphicDesign.forEach(file => {
                grid.appendChild(createCard(file, 'graphicDesign'));
            });
        }

        // Initialize all interactions
        initScrollAnimations();
        initFiltering();
        initCursorHovers();
        initCardTilt();

    } catch (err) {
        console.error('Portfolio load error:', err);
        if (loader) {
            loader.innerHTML = '<p style="color:var(--text-muted);">Could not load work. Please refresh.</p>';
        }
    }
}

// ============================================================
// ANIMATIONS & INTERACTIONS
// ============================================================

// --- Custom Cursor ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 400, fill: 'forwards' });
    });
}

function initCursorHovers() {
    if (window.innerWidth <= 768) return;
    document.querySelectorAll('a, button, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(255, 204, 0, 0.08)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}

// --- Magnetic Buttons ---
if (window.innerWidth > 768) {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// --- 3D Card Tilt ---
function initCardTilt() {
    if (window.innerWidth <= 768) return;
    document.querySelectorAll('.portfolio-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// --- GSAP ---
gsap.registerPlugin(ScrollTrigger);

// Hero entrance — staggered character-level feel
const tl = gsap.timeline();
tl.to('.reveal-text', {
    y: 0, opacity: 1, duration: 1.2,
    stagger: 0.15, ease: 'power4.out', delay: 0.3,
});

// Parallax hero glow on scroll
gsap.to('.hero-bg-glow', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
    },
    y: '-30%',
    scale: 0.8,
    opacity: 0,
});

// Marquee speed-up on scroll
gsap.to('.marquee-track', {
    scrollTrigger: {
        trigger: '.marquee-banner',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
    },
    x: '-120px',
});

function initScrollAnimations() {
    document.querySelectorAll('.reveal-scroll').forEach((el, i) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: el.classList.contains('portfolio-item') ? (i % 3) * 0.1 : 0,
            ease: 'power3.out',
        });
    });
}

initScrollAnimations();

// Footer title animation
gsap.from('.footer-title', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
    },
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
});

// --- Filtering ---
function initFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => { item.style.display = 'none'; }, 400);
                }
            });
            setTimeout(() => ScrollTrigger.refresh(), 500);
        });
    });
}

// Boot
loadPortfolio();
