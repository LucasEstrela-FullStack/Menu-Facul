// ============ MENU RESPONSIVO - JAVASCRIPT ============

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownParents = document.querySelectorAll('.dropdown-parent');
    const header = document.querySelector('.header');
    
    // ============ FUNCIONALIDADE MOBILE TOGGLE ============
    
    function toggleMobileMenu() {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Previne scroll do body quando menu está aberto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Event listener para o botão mobile
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // ============ DROPDOWN MOBILE ============
    
    function handleDropdownMobile() {
        dropdownParents.forEach(parent => {
            const link = parent.querySelector('.nav-link');
            const dropdown = parent.querySelector('.dropdown');
            
            if (link && dropdown) {
                link.addEventListener('click', function(e) {
                    // Só previne o comportamento padrão em mobile
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        
                        // Toggle do dropdown atual
                        dropdown.classList.toggle('active');
                        
                        // Fecha outros dropdowns
                        dropdownParents.forEach(otherParent => {
                            if (otherParent !== parent) {
                                const otherDropdown = otherParent.querySelector('.dropdown');
                                if (otherDropdown) {
                                    otherDropdown.classList.remove('active');
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    
    // Inicializar dropdowns mobile
    handleDropdownMobile();
    
    // ============ FECHAR MENU AO CLICAR FORA ============
    
    document.addEventListener('click', function(e) {
        const isClickInsideNav = navMenu.contains(e.target);
        const isClickOnToggle = mobileToggle.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // ============ SCROLL HEADER EFFECT ============
    
    let lastScrollTop = 0;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona/remove classe baseada no scroll
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header baseado na direção do scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    
    // Throttle para otimizar performance
    let ticking = false;
    
    function requestScroll() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => {
                ticking = false;
            }, 10);
        }
    }
    
    window.addEventListener('scroll', requestScroll);
    
    // ============ RESIZE HANDLER ============
    
    function handleResize() {
        // Fecha menu mobile quando redimensiona para desktop
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            // Remove classes active dos dropdowns
            dropdownParents.forEach(parent => {
                const dropdown = parent.querySelector('.dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            });
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // ============ ANIMAÇÕES DE ENTRADA ============
    
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature, .objective');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // Inicializar animações se IntersectionObserver é suportado
    if ('IntersectionObserver' in window) {
        animateOnScroll();
    }
    
    // ============ SMOOTH SCROLL ============
    
    function smoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href !== '#' && href !== '') {
                    e.preventDefault();
                    
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80; // Ajuste para header fixo
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                        
                        // Fecha menu mobile se estiver aberto
                        if (navMenu.classList.contains('active')) {
                            toggleMobileMenu();
                        }
                    }
                }
            });
        });
    }
    
    smoothScroll();
    
    // ============ KEYBOARD NAVIGATION ============
    
    function handleKeyboardNavigation() {
        // Escape key para fechar menu mobile
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
        
        // Tab navigation para dropdowns
        dropdownParents.forEach(parent => {
            const dropdown = parent.querySelector('.dropdown');
            const dropdownLinks = dropdown ? dropdown.querySelectorAll('.dropdown-link') : [];
            
            if (dropdownLinks.length > 0) {
                // Focus no primeiro item quando dropdown abre
                parent.addEventListener('mouseenter', () => {
                    if (window.innerWidth > 768) {
                        dropdownLinks[0].focus();
                    }
                });
                
                // Navegação com setas
                dropdownLinks.forEach((link, index) => {
                    link.addEventListener('keydown', function(e) {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            const nextIndex = (index + 1) % dropdownLinks.length;
                            dropdownLinks[nextIndex].focus();
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            const prevIndex = index === 0 ? dropdownLinks.length - 1 : index - 1;
                            dropdownLinks[prevIndex].focus();
                        }
                    });
                });
            }
        });
    }
    
    handleKeyboardNavigation();
    
    // ============ DEBUGGING E LOGS ============
    
    function logMenuState() {
        console.log('Menu Responsivo Inicializado');
        console.log('Dropdowns encontrados:', dropdownParents.length);
        console.log('Largura da tela:', window.innerWidth);
    }
    
    // Log inicial (remover em produção)
    logMenuState();
    
    // ============ PERFORMANCE MONITORING ============
    
    // Monitora performance de animações
    function monitorPerformance() {
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 16) { // Mais que 1 frame (60fps)
                        console.warn('Animação lenta detectada:', entry.name, entry.duration + 'ms');
                    }
                }
            });
            
            observer.observe({ entryTypes: ['measure'] });
        }
    }
    
    // Ativar monitoramento em desenvolvimento
    if (window.location.hostname === 'localhost') {
        monitorPerformance();
    }
    
    // ============ ACESSIBILIDADE ============
    
    function enhanceAccessibility() {
        // Adiciona atributos ARIA
        mobileToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-controls', 'main-navigation');
        
        navMenu.setAttribute('id', 'main-navigation');
        navMenu.setAttribute('role', 'navigation');
        
        // Atualiza aria-expanded
        function updateAriaExpanded() {
            const isExpanded = navMenu.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded.toString());
        }
        
        // Observer para mudanças na classe active
        const observer = new MutationObserver(updateAriaExpanded);
        observer.observe(navMenu, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        // Adiciona skip link (invisible até ser focado)
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 0 0 4px 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    enhanceAccessibility();
});