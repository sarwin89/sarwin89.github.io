jQuery(document).ready(function($) {

    'use strict';

    setupPreloader();

    if ($('.Modern-Slider').length && $.fn.slick) {
        $('.Modern-Slider').slick({
            autoplay: true,
            speed: 1000,
            slidesToShow: 1,
            slidesToScroll: 1,
            pauseOnHover: false,
            dots: true,
            fade: true,
            pauseOnDotsHover: true,
            cssEase: 'linear',
            draggable: false,
            prevArrow: '<button class="PrevArrow"></button>',
            nextArrow: '<button class="NextArrow"></button>'
        });
    }

    $('#nav-toggle').on('click', function(event) {
        event.preventDefault();
        $('#main-nav').toggleClass('open');
    });

    if ($('.tabgroup').length) {
        $('.tabgroup > div').hide();
        $('.tabgroup > div:first-of-type').show();
        $('.tabs a').on('click', function(e) {
            e.preventDefault();
            var $this = $(this);
            var tabgroup = '#' + $this.parents('.tabs').data('tabgroup');
            var others = $this.closest('li').siblings().children('a');
            var target = $this.attr('href');
            others.removeClass('active');
            $this.addClass('active');
            $(tabgroup).children('div').hide();
            $(target).show();
        });
    }

    $('.box-video').on('click', function() {
        var iframe = $('iframe', this)[0];
        if (iframe && iframe.src.indexOf('autoplay=1') === -1) {
            iframe.src += '&amp;autoplay=1';
        }
        $(this).addClass('open');
    });

    if ($('.owl-carousel').length && $.fn.owlCarousel) {
        $('.owl-carousel').owlCarousel({
            loop: true,
            margin: 30,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    nav: true
                },
                600: {
                    items: 2,
                    nav: false
                },
                1000: {
                    items: 3,
                    nav: true,
                    loop: false
                }
            }
        });
    }

    var contentSection = $('.content-section, .main-banner');
    var navigation = $('nav');

    navigation.on('click', 'a', function(event) {
        var href = $(this).attr('href') || '';
        if (href.charAt(0) !== '#') {
            return;
        }

        var target = $(href);
        if (!target.length) {
            return;
        }

        event.preventDefault();
        smoothScroll(target);
    });

    $(window).on('scroll', function() {
        updateNavigation();
    });
    updateNavigation();

    function updateNavigation() {
        contentSection.each(function() {
            var sectionName = $(this).attr('id');
            if (!sectionName) {
                return;
            }
            var navigationMatch = $('nav a[href="#' + sectionName + '"]');
            if (!navigationMatch.length) {
                return;
            }
            if (($(this).offset().top - $(window).height() / 2 < $(window).scrollTop()) &&
                ($(this).offset().top + $(this).height() - $(window).height() / 2 > $(window).scrollTop())) {
                navigationMatch.addClass('active-section');
            } else {
                navigationMatch.removeClass('active-section');
            }
        });
    }

    function smoothScroll(target) {
        if (!target || !target.length) {
            return;
        }
        $('body,html').animate({
            scrollTop: target.offset().top
        }, 900);
    }

    $('.button a[href*=#]').on('click', function(e) {
        var href = $(this).attr('href') || '';
        if (href.charAt(0) !== '#') {
            return;
        }

        var target = $(href);
        if (!target.length) {
            return;
        }

        e.preventDefault();
        smoothScroll(target);
    });

    function ensureTransitionOverlay() {
        if (!$('.page-transition-overlay').length) {
            $('body').append('<div class="page-transition-overlay" aria-hidden="true"></div>');
        }
    }

    function navigateWithTransition(destination) {
        if (!destination || $('body').hasClass('is-transitioning')) {
            return;
        }
        ensureTransitionOverlay();
        $('body').addClass('is-transitioning');
        window.setTimeout(function() {
            window.location.href = destination;
        }, 220);
    }

    function setupPreloader() {
        if ($('.site-preloader').length) {
            return;
        }

        var minimumDurationMs = 1250;
        var startTime = Date.now();
        var released = false;
        var $loader = $('<div class="site-preloader" aria-live="polite"><div class="loader-icon"></div><p class="loader-copy">Loading</p></div>');
        $('body').append($loader);

        function releaseLoader() {
            if (released) {
                return;
            }
            released = true;
            var elapsed = Date.now() - startTime;
            var wait = Math.max(0, minimumDurationMs - elapsed);

            window.setTimeout(function() {
                $loader.addClass('is-hidden');
                window.setTimeout(function() {
                    $loader.remove();
                }, 460);
            }, wait);
        }

        if (document.readyState === 'complete') {
            releaseLoader();
        } else {
            $(window).on('load', releaseLoader);
            window.setTimeout(releaseLoader, 2100);
        }
    }

    function setupThemeToggle() {
        var storedTheme = window.localStorage.getItem('sarwinTheme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', currentTheme);

        var $themeButton = $('<button type="button" class="theme-fab" aria-label="Toggle color theme"></button>');
        $('body').append($themeButton);

        function paintThemeButton(theme) {
            if (theme === 'dark') {
                $themeButton.html('<i class="fa fa-sun-o" aria-hidden="true"></i>');
                $themeButton.attr('title', 'Switch to light mode');
            } else {
                $themeButton.html('<i class="fa fa-moon-o" aria-hidden="true"></i>');
                $themeButton.attr('title', 'Switch to dark mode');
            }
        }

        paintThemeButton(currentTheme);

        $themeButton.on('click', function() {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);
            window.localStorage.setItem('sarwinTheme', currentTheme);
            paintThemeButton(currentTheme);
        });
    }

    function setupExploreMode() {
        var $smartLinks = $('.smart-explore');
        if (!$smartLinks.length) {
            return;
        }

        var $modeToggle = $('#explore-mode-toggle');
        var $modeChip = $modeToggle.find('.mode-chip');
        var $modeCopy = $modeToggle.find('.mode-copy');
        var currentMode = window.localStorage.getItem('sarwinExploreMode') || 'jump';

        function applyMode(mode) {
            var isJump = mode === 'jump';
            currentMode = mode;

            if ($modeToggle.length) {
                $modeToggle.attr('aria-pressed', String(!isJump));
                $modeChip.text(isJump ? 'Quick Jump Mode' : 'Deep Dive Mode');
                $modeCopy.text(isJump ? 'Explore buttons will jump to sections on this page.' : 'Explore buttons will open full dedicated pages.');
            }

            $smartLinks.each(function() {
                var $link = $(this);
                var jumpTarget = $link.data('jump');
                var fullTarget = $link.data('full');
                var destination = isJump ? jumpTarget : fullTarget;
                $link.attr('href', destination);
                $link.text(isJump ? 'Jump Into This Section' : 'Open Full Page');
                $link.attr('data-mode', mode);
            });
        }

        applyMode(currentMode);

        $modeToggle.on('click', function() {
            var nextMode = currentMode === 'jump' ? 'full' : 'jump';
            applyMode(nextMode);
            window.localStorage.setItem('sarwinExploreMode', nextMode);
        });

        $smartLinks.on('click', function(event) {
            var $link = $(this);
            var jumpTarget = $link.data('jump');
            var fullTarget = $link.data('full');
            var resolvedMode = currentMode;

            if (event.shiftKey) {
                resolvedMode = currentMode === 'jump' ? 'full' : 'jump';
            }

            if (resolvedMode === 'jump') {
                var target = $(jumpTarget);
                if (target.length) {
                    event.preventDefault();
                    smoothScroll(target);
                }
                return;
            }

            var href = $link.attr('href');
            if (event.shiftKey || href !== fullTarget) {
                event.preventDefault();
                navigateWithTransition(fullTarget);
            }
        });
    }

    function setupSectionReveal() {
        var $sections = $('.page-content > section');
        if (!$sections.length) {
            return;
        }

        $sections.addClass('section-reveal');

        if (!('IntersectionObserver' in window)) {
            $sections.addClass('is-visible');
            return;
        }

        var observer = new IntersectionObserver(function(entries, ob) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    ob.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.14,
            rootMargin: '0px 0px -60px 0px'
        });

        $sections.each(function() {
            observer.observe(this);
        });
    }

    function setupSidebarCurrentPage() {
        var currentPath = window.location.pathname.split('/').pop().toLowerCase();
        if (!currentPath) {
            currentPath = 'index.html';
        }

        $('nav a').each(function() {
            var href = ($(this).attr('href') || '').toLowerCase();
            if (!href || href.charAt(0) === '#') {
                return;
            }

            var targetPath = href.split('#')[0];
            if (!targetPath) {
                targetPath = 'index.html';
            }

            if (targetPath === currentPath) {
                $(this).addClass('page-active');
            }
        });
    }

    function setupPageTransitions() {
        ensureTransitionOverlay();

        $(document).on('click', 'a', function(event) {
            var href = $(this).attr('href') || '';
            if (!href || href.charAt(0) === '#') {
                return;
            }
            if ($(this).attr('target') === '_blank') {
                return;
            }
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
                return;
            }
            if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) {
                return;
            }

            var resolved;
            try {
                resolved = new URL(href, window.location.href);
            } catch (err) {
                return;
            }

            if (resolved.origin !== window.location.origin) {
                return;
            }

            if (resolved.pathname === window.location.pathname && !resolved.hash) {
                return;
            }

            if (resolved.pathname === window.location.pathname && resolved.hash) {
                return;
            }

            event.preventDefault();
            navigateWithTransition(resolved.href);
        });
    }

    setupThemeToggle();
    setupExploreMode();
    setupSectionReveal();
    setupSidebarCurrentPage();
    setupPageTransitions();

});
