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

// Cinematic Hero Reveal Animation
document.addEventListener("DOMContentLoaded", () => {
    const tl = gsap.timeline();

    // 1. Draw SVG Logo
    tl.to(".logo-svg", {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut"
    })
    .from(".logo-circle", {
        strokeDasharray: 251, // approx circumference
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
    
    // 2. Reveal Logo Text
    .to(".logo-text", {
        opacity: 1,
        duration: 1,
        y: -20,
        ease: "power2.out"
    }, "-=0.5")

    // 3. Hold for a moment, then fade out loader and reveal main content
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
    
    // 4. Animate Hero Logo and Text
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

    // Scroll Animations for Modules
    const modules = gsap.utils.toArray('.module-item');

    modules.forEach((module, i) => {
        const imageContainer = module.querySelector('.module-image-container');
        const image = module.querySelector('.module-image');
        const button = module.querySelector('.module-btn');

        // Initial state
        gsap.set(imageContainer, { y: 100, opacity: 0 });
        gsap.set(button, { y: 30, opacity: 0 });

        // Scroll trigger for entrance
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

        // Gentle oscillating float animation for icons
        gsap.to(image, {
            y: -20,
            duration: 2.5 + (i * 0.2), // slight variance based on index
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    });
    
    // Hero title stays visible — no scroll fade
});
