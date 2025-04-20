// Navigation Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Sticky Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.classList.toggle('sticky', window.scrollY > 50);
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Project filtering and carousel
    document.addEventListener('DOMContentLoaded', () => {
        const filterTabs = document.querySelectorAll('.filter-tab');
        const projectItems = document.querySelectorAll('.project-carousel-item');
        const carousel = document.querySelector('.projects-carousel');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const indicators = document.querySelectorAll('.indicator');
        
        // Make sure we have all the elements needed
        if (!carousel || !prevBtn || !nextBtn) {
            console.error('Some carousel elements are missing');
            return;
        }
        
        let currentIndex = 0;
        const GAP = 30; // Gap between items in pixels
        let maxVisibleItems = 3; // Default to 3 items
        let visibleItems = Array.from(projectItems);
        
        // Add smooth transition to carousel
        carousel.style.transition = 'transform 0.3s ease-in-out';
        
        // Calculate responsive values
        function calculateResponsiveValues() {
            if (window.innerWidth < 768) {
                maxVisibleItems = 1;
            } else if (window.innerWidth < 992) {
                maxVisibleItems = 2;
            } else {
                maxVisibleItems = 3;
            }
        }
        
        // Get item width with a more reliable calculation
        function getItemWidth() {
            const containerWidth = carousel.parentElement.clientWidth;
            return (containerWidth - (GAP * (maxVisibleItems - 1))) / maxVisibleItems;
        }
        
        // Set item widths properly
        function setItemWidths() {
            const width = getItemWidth();
            projectItems.forEach(item => {
                item.style.flex = `0 0 ${width}px`;
                item.style.width = `${width}px`;
                item.style.marginRight = `${GAP}px`;
            });
        }
        
        // Update carousel position
        function updateCarousel() {
            if (!carousel) return;
            
            const itemWidth = getItemWidth();
            const offset = currentIndex * (itemWidth + GAP);
            carousel.style.transform = `translateX(-${offset}px)`;
            
            // Update button states
            const maxIndex = Math.max(0, visibleItems.length - maxVisibleItems);
            prevBtn.classList.toggle('disabled', currentIndex === 0);
            nextBtn.classList.toggle('disabled', currentIndex >= maxIndex);
        }
        
        // Update indicators
        function updateIndicators() {
            if (!indicators.length) return;
            
            const totalGroups = Math.ceil(visibleItems.length / maxVisibleItems);
            indicators.forEach((indicator, i) => {
                indicator.style.display = i < totalGroups ? '' : 'none';
                indicator.classList.toggle('active', i === Math.floor(currentIndex / maxVisibleItems));
            });
        }
        
        // Initialize carousel
        calculateResponsiveValues();
        setItemWidths();
        updateCarousel();
        updateIndicators();
        
        // Previous button click handler
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
                updateIndicators();
            }
        });
        
        // Next button click handler
        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, visibleItems.length - maxVisibleItems);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
                updateIndicators();
            }
        });
        
        // Indicator clicks
        indicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                currentIndex = i * maxVisibleItems;
                const maxIndex = Math.max(0, visibleItems.length - maxVisibleItems);
                if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                }
                updateCarousel();
                updateIndicators();
            });
        });
        
        // Filter projects
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const filterValue = tab.getAttribute('data-filter');
                currentIndex = 0;
                
                if (filterValue === 'all') {
                    visibleItems = Array.from(projectItems);
                    projectItems.forEach(item => item.style.display = '');
                } else {
                    visibleItems = Array.from(projectItems).filter(item => {
                        const categories = item.getAttribute('data-category');
                        const shouldShow = categories && categories.includes(filterValue);
                        item.style.display = shouldShow ? '' : 'none';
                        return shouldShow;
                    });
                }
                
                updateCarousel();
                updateIndicators();
            });
        });
        
        // Debounce function for resize handler
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // Window resize handler
        window.addEventListener('resize', debounce(() => {
            calculateResponsiveValues();
            setItemWidths();
            
            // Adjust currentIndex if needed
            const maxIndex = Math.max(0, visibleItems.length - maxVisibleItems);
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            
            updateCarousel();
            updateIndicators();
        }, 250));
    });


    