'use client';

import { useEffect } from 'react';

const SmoothScrollScript = () => {
  useEffect(() => {
    // Custom smooth scroll function with easing
    const smoothScrollTo = (targetY: number, duration: number = 1900) => {
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      
      // If the distance is very small, use a shorter duration to avoid jerky movement
      const actualDuration = Math.abs(distance) < 50 ? Math.min(duration * 0.3, 300) : duration;
      
      const startTime = performance.now();

      const easeInOutCubic = (t: number) => {
        // Improved easing function with better initial acceleration
        if (t < 0.5) {
          return 4 * t * t * t;
        } else {
          return 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
      };

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / actualDuration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        const currentY = startY + distance * easedProgress;
        window.scrollTo(0, currentY);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      // Add a small delay to ensure smooth start
      setTimeout(() => {
        requestAnimationFrame(animateScroll);
      }, 16); // One frame delay
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link) {
        const href = link.getAttribute('href');
        
        // Only handle internal links (starting with / or #)
        if (href && (href.startsWith('/') || href.startsWith('#'))) {
          e.preventDefault();
          
          if (href === '/') {
            // Scroll to top of page with improved duration based on current position
            const currentScroll = window.pageYOffset;
            const scrollDuration = currentScroll > 1000 ? 1500 : 800;
            smoothScrollTo(0, scrollDuration);
          } else if (href.startsWith('#')) {
            // Scroll to anchor with smooth animation
            const element = document.querySelector(href);
            if (element) {
              const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
              smoothScrollTo(elementTop - 100, 1200); // Offset by 100px for better positioning
            }
          } else {
            // For other internal links, smooth scroll to top first
            smoothScrollTo(0, 1000);
            
            // Navigate after smooth scroll completes
            setTimeout(() => {
              window.location.href = href;
            }, 800);
          }
        }
      }
    };

    // Add event listener to document
    document.addEventListener('click', handleLinkClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SmoothScrollScript; 