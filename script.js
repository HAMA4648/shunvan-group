// Initialize Lenis for smooth inertial scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Integration with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Main DOM Logic
document.addEventListener("DOMContentLoaded", () => {
    
    // --------------------------------------------------
    // 1. Cinematic Hero Reveal Animation
    // --------------------------------------------------
    const tl = gsap.timeline();

    tl.to(".logo-svg", {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut"
    })
    .from(".logo-circle", {
        strokeDasharray: 251,
        strokeDashoffset: 251,
        duration: 1.5,
        ease: "power3.inOut"
    }, "-=0.2")
    .from(".logo-sun", {
        scale: 0,
        transformOrigin: "center center",
        rotation: -90,
        duration: 1.2,
        ease: "back.out(1.5)"
    }, "-=1")
    .to(".logo-text", {
        opacity: 1,
        duration: 1,
        y: -20,
        ease: "power2.out"
    }, "-=0.5")
    .to(".loader", {
        y: "-100%",
        duration: 1.5,
        ease: "power4.inOut",
        delay: 1.5
    })
    .set(".main-content", {
        opacity: 1,
        visibility: "visible"
    }, "-=1.5")
    .to(".hero-logo-circle", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out"
    }, "-=0.8")
    .from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
    }, "-=1")
    .from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from(".scroll-indicator", {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.6");


    // --------------------------------------------------
    // 2. Module Grid Scroll Animations
    // --------------------------------------------------
    const modules = gsap.utils.toArray('.module-item');

    modules.forEach((module, i) => {
        const imageContainer = module.querySelector('.module-image-container');
        const image = module.querySelector('.module-image');
        const button = module.querySelector('.module-btn');

        gsap.set(imageContainer, { y: 100, opacity: 0 });
        gsap.set(button, { y: 30, opacity: 0 });

        ScrollTrigger.create({
            trigger: module,
            start: "top 85%",
            animation: gsap.timeline()
                .to(imageContainer, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out"
                })
                .to(button, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.8")
        });

        gsap.to(image, {
            y: -20,
            duration: 2.5 + (i * 0.2),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    });


    // --------------------------------------------------
    // 3. PRODUCT OVERLAY & GALLERY LOGIC
    // --------------------------------------------------
    const productBtn = document.querySelector("#module-product .module-btn");
    const productOverlay = document.querySelector("#product-overlay");
    const productCloseBtn = document.querySelector("#close-product-btn");
    const productGalleryTrack = document.querySelector("#product-gallery");
    const activeProductBg = document.querySelector("#active-product-bg");
    const activeProductTitle = document.querySelector("#active-project-title");
    const mainContent = document.querySelector(".main-content");

    const subProjects = [
        { title: "Residential Complex", image: "assets/images/module_design.png" },
        { title: "Minimalist Pavilion", image: "assets/images/module_light.png" },
        { title: "Urban Development", image: "assets/images/module_product.png" }
    ];

    subProjects.forEach((project) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${project.image}" alt="${project.title}" class="gallery-thumb"><div class="gallery-item-overlay"></div>`;
        
        item.addEventListener("click", () => {
            const newBg = activeProductBg.cloneNode();
            newBg.src = project.image;
            newBg.style.opacity = 0;
            newBg.style.transform = "scale(1.1)";
            newBg.style.position = "absolute";
            newBg.style.top = "0";
            newBg.style.left = "0";
            newBg.id = "";
            activeProductBg.parentNode.insertBefore(newBg, activeProductBg.nextSibling);

            gsap.to(newBg, {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: "power2.inOut",
                onComplete: () => {
                    activeProductBg.src = project.image;
                    newBg.remove();
                }
            });

            gsap.to(activeProductTitle, {
                opacity: 0, y: -10, duration: 0.4,
                onComplete: () => {
                    activeProductTitle.textContent = project.title;
                    gsap.to(activeProductTitle, { opacity: 1, y: 0, duration: 0.4 });
                }
            });
        });
        productGalleryTrack.appendChild(item);
    });

    productBtn.addEventListener("click", () => {
        lenis.stop();
        const tlP = gsap.timeline();
        tlP.to(mainContent, { opacity: 0, duration: 0.6 })
           .set(productOverlay, { visibility: "visible", pointerEvents: "all" })
           .to(productOverlay, { opacity: 1, duration: 0.6 }, "-=0.3")
           .to(activeProductBg, { scale: 1, duration: 1.5, ease: "power3.out" }, "-=0.6")
           .from("#product-overlay .overlay-header", { y: -30, opacity: 0, duration: 0.8 }, "-=1")
           .from("#product-overlay .gallery-container", { y: 30, opacity: 0, duration: 0.8 }, "-=0.8");
    });

    productCloseBtn.addEventListener("click", () => {
        gsap.timeline({ onComplete: () => { lenis.start(); gsap.set(activeProductBg, { scale: 1.2 }); }})
            .to(productOverlay, { opacity: 0, duration: 0.6 })
            .set(productOverlay, { visibility: "hidden", pointerEvents: "none" })
            .to(mainContent, { opacity: 1, duration: 0.8 }, "-=0.2");
    });


    // --------------------------------------------------
    // 4. DESIGN OVERLAY & BLUEPRINT LOGIC
    // --------------------------------------------------
    const designBtn = document.querySelector("#module-design .module-btn");
    const designOverlay = document.querySelector("#design-overlay");
    const designCloseBtn = document.querySelector("#close-design-btn");
    const svgContainer = document.querySelector("#blueprint-svg-container");
    const designGalleryTrack = document.querySelector("#design-gallery");
    const designHint = document.querySelector(".reveal-hint");

    async function initBlueprint() {
        try {
            const response = await fetch('assets/images/blueprint.svg');
            const svgText = await response.text();
            svgContainer.innerHTML = svgText;
            const paths = svgContainer.querySelectorAll('path');
            paths.forEach(path => {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            });
        } catch (e) { console.error("SVG Load Error", e); }
    }
    initBlueprint();

    const designProjects = [
        { title: "Museo Castromaior", image: "assets/images/module_design.png" },
        { title: "Cultural Center", image: "assets/images/module_product.png" },
        { title: "Civic Pavilion", image: "assets/images/module_light.png" }
    ];

    designProjects.forEach(p => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${p.image}" alt="${p.title}" class="gallery-thumb"><div class="gallery-item-overlay"></div>`;
        designGalleryTrack.appendChild(item);
    });

    designBtn.addEventListener("click", () => {
        lenis.stop();
        const paths = svgContainer.querySelectorAll('path');
        const tlD = gsap.timeline();
        tlD.to(mainContent, { opacity: 0, duration: 0.6 })
           .set(designOverlay, { visibility: "visible", pointerEvents: "all" })
           .to(designOverlay, { opacity: 1, duration: 0.6 }, "-=0.3")
           .to(paths, { strokeDashoffset: 0, duration: 3, stagger: 0.05, ease: "power2.inOut" })
           .from("#design-overlay .overlay-header", { y: -30, opacity: 0, duration: 0.8 }, "-=1")
           .to(designHint, { opacity: 1, duration: 1 }, "-=0.5")
           .from("#design-overlay .gallery-container", { y: 30, opacity: 0, duration: 0.8 }, "-=0.8");
    });

    designCloseBtn.addEventListener("click", () => {
        const paths = svgContainer.querySelectorAll('path');
        gsap.timeline({ onComplete: () => {
            lenis.start();
            paths.forEach(p => { gsap.set(p, { strokeDashoffset: p.getTotalLength() }); });
            gsap.set("#design-overlay .render-image", { opacity: 0 });
        }})
        .to(paths, { strokeDashoffset: (i, t) => t.getTotalLength(), duration: 1.5, ease: "power2.in" })
        .to(designOverlay, { opacity: 0, duration: 0.6 }, "-=0.5")
        .set(designOverlay, { visibility: "hidden", pointerEvents: "none" })
        .to(mainContent, { opacity: 1, duration: 0.8 }, "-=0.2");
    });

});
