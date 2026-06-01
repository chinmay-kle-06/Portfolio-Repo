/* ==========================================================================
   Chinmay's Portfolio - Core Client-Side Logic & Router
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. SPA Hash-Based Router
       ========================================================================== */
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navDropdownLinks = document.querySelectorAll('.nav-dropdown-link');
    const navMenu = document.getElementById('navMenu');
    const burgerBtn = document.getElementById('burgerMenuBtn');

    function router() {
        let hash = window.location.hash || '#home';
        
        // Normalize hash to match section ID (e.g. #learning-html -> learning-html)
        let pageId = hash.substring(1);
        
        // Check if target page exists, else default to home
        let targetSection = document.getElementById(pageId);
        if (!targetSection) {
            pageId = 'home';
            hash = '#home';
        }

        // 1. Switch active section view with transition delay
        sections.forEach(section => {
            if (section.id === pageId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // 2. Manage navigation active classes
        // Clear all active classes first
        navLinks.forEach(link => link.classList.remove('active'));
        navDropdownLinks.forEach(link => link.classList.remove('active'));

        // Highlight matching individual nav links
        const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Highlight dropdown items and activate parent dropdown header
        const activeDropdownLink = document.querySelector(`.nav-dropdown-link[data-page="${pageId}"]`);
        if (activeDropdownLink) {
            activeDropdownLink.classList.add('active');
            
            // Traverse up to find parent dropdown toggle and highlight it
            const parentDropdown = activeDropdownLink.closest('.dropdown');
            if (parentDropdown) {
                const toggle = parentDropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        }

        // 3. Trigger context-specific page animations
        if (pageId === 'skills') {
            triggerSkillsProgressBars();
        } else {
            resetSkillsProgressBars();
        }

        // 4. Close mobile menu drawer on route selection
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }

        // 5. Scroll to top of viewport
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Hash change event listeners
    window.addEventListener('hashchange', router);
    // Initial load route trigger
    router();

    /* ==========================================================================
       2. Mobile Navigation Drawer Toggle
       ========================================================================== */
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        burgerBtn.classList.toggle('open');
    }

    burgerBtn.addEventListener('click', toggleMobileMenu);

    // Mobile dropdown toggle submenus on click
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = toggle.parentElement;
                parent.classList.toggle('active');
            }
        });
    });

    /* ==========================================================================
       3. Search Overlay & Registry Query Engine
       ========================================================================== */
    const openSearchBtn = document.getElementById('openSearch');
    const closeSearchBtn = document.getElementById('closeSearch');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResultsList = document.getElementById('searchResultsList');

    // Portfolio search database index
    const searchRegistry = [
        { title: 'Home Portfolio Shell', page: 'home', keywords: ['portfolio', 'web', 'software', 'credentials', 'credentials', 'chinmay', 'usn'] },
        { title: 'Student Profile Credentials', page: 'home', keywords: ['student', 'department', 'semester', 'usn', '1kl23cs045'] },
        { title: 'Introduction & Biography', page: 'intro', keywords: ['introduction', 'about me', 'student profile', 'biography', 'background', 'enthusiast'] },
        { title: 'Technical Competency overview', page: 'intro', keywords: ['competency', 'frontend', 'backend', 'database', 'tools', 'languages'] },
        { title: 'Course Details: Web Technologies', page: 'course-overview', keywords: ['web technology', 'course 1', 'html5', 'css3', 'dom', 'restful'] },
        { title: 'Course Details: Software Engineering', page: 'course-overview', keywords: ['software engineering', 'course 2', 'agile', 'timeline', 'sprint', 'uml'] },
        { title: 'Learning: HTML structures', page: 'learning-html', keywords: ['html', 'semantic markup', 'tags', 'metadata', 'seo', 'accessibility'] },
        { title: 'Learning: CSS3 structures', page: 'learning-css', keywords: ['css', 'flexbox', 'grid', 'neon glows', 'animations', 'variables'] },
        { title: 'Learning: JavaScript ES6+', page: 'learning-js', keywords: ['javascript', 'promises', 'async', 'await', 'dom manipulation', 'event delegation'] },
        { title: 'Learning: Node.js servers', page: 'learning-node', keywords: ['node.js', 'express.js', 'rest routing', 'api endpoints', 'jwt', 'fs module'] },
        { title: 'Learning: React.js SPA framework', page: 'learning-react', keywords: ['react', 'virtual dom', 'jsx', 'usestate', 'useeffect', 'state hooks'] },
        { title: 'Technical Skills Matrix', page: 'skills', keywords: ['technical skills', 'languages', 'frameworks', 'databases', 'progress bars', 'metrics'] },
        { title: 'Project: Problem Definition & Stack', page: 'project-overview', keywords: ['problem statement', 'objectives', 'stakeholders', 'recruiters', 'academic', 'tech stack'] },
        { title: 'Project: Agile Timelines & Sprints', page: 'project-timeline', keywords: ['agile timeline', 'sprint 1', 'sprint 2', 'user stories', 'milestones', 'priority'] },
        { title: 'Project: System Architectures & UML', page: 'project-architecture', keywords: ['system architecture', 'uml diagrams', 'flowcharts', 'auth pipeline', 'express server'] },
        { title: 'DevOps completions Certifications', page: 'devops', keywords: ['devops', 'certification', 'cloud', 'aws', 'docker', 'containerization'] },
        { title: 'Academic Reflection journey', page: 'reflections', keywords: ['reflections', 'hurdles', 'collaboration', 'timeline', 'growth', 'outcome'] },
        { title: 'Contact coordinates details', page: 'contact', keywords: ['contact', 'email', 'phone', 'linkedin', 'github', 'get in touch'] }
    ];

    function toggleSearchOverlay() {
        searchOverlay.classList.toggle('active');
        if (searchOverlay.classList.contains('active')) {
            setTimeout(() => searchInput.focus(), 150);
            renderSearchResults('');
        } else {
            searchInput.value = '';
        }
    }

    openSearchBtn.addEventListener('click', toggleSearchOverlay);
    closeSearchBtn.addEventListener('click', toggleSearchOverlay);

    // Close on click outside search modal
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            toggleSearchOverlay();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            toggleSearchOverlay();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        renderSearchResults(query);
    });

    function renderSearchResults(query) {
        searchResultsList.innerHTML = '';
        
        if (query === '') {
            // Suggest featured page shortcuts when empty
            const suggestions = [
                { title: 'Navigate to Home', page: 'home', desc: 'Main entry details' },
                { title: 'Inspect Skills Matrix', page: 'skills', desc: 'Technical proficiency graphs' },
                { title: 'Check Sprint Timelines', page: 'project-timeline', desc: 'Agile timeline user stories' },
                { title: 'View Cloud Certifications', page: 'devops', desc: 'AWS and Docker credentials' }
            ];
            
            suggestions.forEach(item => {
                const li = document.createElement('li');
                li.className = 'search-result-item';
                li.innerHTML = `
                    <span class="result-title">${item.title}</span>
                    <span class="result-desc">${item.desc}</span>
                `;
                li.addEventListener('click', () => {
                    window.location.hash = `#${item.page}`;
                    toggleSearchOverlay();
                });
                searchResultsList.appendChild(li);
            });
            return;
        }

        // Filter search registry matches
        const matches = searchRegistry.filter(item => {
            return item.title.toLowerCase().includes(query) || 
                   item.keywords.some(keyword => keyword.toLowerCase().includes(query));
        });

        if (matches.length === 0) {
            const li = document.createElement('li');
            li.className = 'no-results-msg';
            li.textContent = 'No matching sections found.';
            searchResultsList.appendChild(li);
            return;
        }

        matches.forEach(item => {
            const li = document.createElement('li');
            li.className = 'search-result-item';
            li.innerHTML = `
                <span class="result-title">${item.title}</span>
                <span class="result-desc">Keyword Match: ${query} (Click to jump)</span>
            `;
            li.addEventListener('click', () => {
                window.location.hash = `#${item.page}`;
                toggleSearchOverlay();
            });
            searchResultsList.appendChild(li);
        });
    }

    /* ==========================================================================
       4. Code tabs block switches (Learning Page)
       ========================================================================== */
    const codeTabBtns = document.querySelectorAll('.code-tab-btn');

    codeTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parentWidget = btn.closest('.code-container-widget');
            if (!parentWidget) return;

            // Clear active tab button styling
            const siblingBtns = parentWidget.querySelectorAll('.code-tab-btn');
            siblingBtns.forEach(b => b.classList.remove('active'));

            // Clear active code blocks
            const siblingPres = parentWidget.querySelectorAll('.code-pre');
            siblingPres.forEach(p => p.classList.remove('active'));

            // Set active states
            btn.classList.add('active');
            
            const fileTarget = btn.getAttribute('data-file');
            const targetPre = parentWidget.querySelector(`#code-${fileTarget}`);
            if (targetPre) {
                targetPre.classList.add('active');
            }

            // Sync visual text header
            const fileNameDisplay = parentWidget.querySelector('.file-name');
            if (fileNameDisplay) {
                let displayTxt = btn.textContent;
                fileNameDisplay.innerHTML = `<i data-lucide="file-code" class="file-icon"></i> ${displayTxt}`;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    });

    /* ==========================================================================
       5. Dynamic Skills Progress Animation Trigger
       ========================================================================== */
    const skillBars = document.querySelectorAll('.progress-bar-fill');

    function triggerSkillsProgressBars() {
        // Add a small layout render delay to ensure smooth CSS animation transitions
        setTimeout(() => {
            skillBars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-progress');
                bar.style.width = targetWidth;
            });
        }, 150);
    }

    function resetSkillsProgressBars() {
        skillBars.forEach(bar => {
            bar.style.width = '0%';
        });
    }

    /* ==========================================================================
       6. Project Overview Tech Stack Hover Interaction
       ========================================================================== */
    const hoverTags = document.querySelectorAll('.hover-tag');
    const techDescBox = document.getElementById('techDescBox');

    hoverTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            // Remove active style from sibling tags
            hoverTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const descText = tag.getAttribute('data-desc');
            techDescBox.innerHTML = `<p>${descText}</p>`;
        });
    });

    // Reset description on mouseleave row wrapper
    const techStackRow = document.getElementById('techStackRow');
    if (techStackRow) {
        techStackRow.addEventListener('mouseleave', () => {
            hoverTags.forEach(t => t.classList.remove('active'));
            if (techDescBox) {
                techDescBox.innerHTML = `<p class="placeholder-text">Hover over any technology tag to inspect its specific stack purpose...</p>`;
            }
        });
    }

    /* ==========================================================================
       7. Module Simulator Widgets (JS API & React state counter)
       ========================================================================== */
    
    // JS Fetch Data Simulator
    const demoFetchBtn = document.getElementById('demoFetchBtn');
    const demoStatusBox = document.getElementById('demoStatusBox');
    const demoDataDisplay = document.getElementById('demoDataDisplay');

    if (demoFetchBtn) {
        demoFetchBtn.addEventListener('click', () => {
            // Initiate Loading State
            demoFetchBtn.disabled = true;
            demoStatusBox.innerHTML = `
                <div class="status-marker running"></div>
                <span class="status-label">Fetching Data...</span>
            `;
            demoDataDisplay.innerHTML = `<p class="placeholder-text">Connecting to endpoint server stream...</p>`;

            // Simulate server network latency response
            setTimeout(() => {
                demoStatusBox.innerHTML = `
                    <div class="status-marker done"></div>
                    <span class="status-label">Data Received</span>
                `;
                demoDataDisplay.innerHTML = `
                    <div style="text-align: left; font-family: var(--font-code); font-size: 0.72rem; color: #86efac;">
                        {<br>
                        &nbsp;&nbsp;"status": 200,<br>
                        &nbsp;&nbsp;"response": "OK",<br>
                        &nbsp;&nbsp;"payload": {<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;"userId": "1KL23CS045",<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;"student": "Chinmay",<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;"academicRole": "Web Developer"<br>
                        &nbsp;&nbsp;}<br>
                        }
                    </div>
                `;
                demoFetchBtn.disabled = false;
            }, 1400);
        });
    }

    // React State Counter Simulator
    const reactDemoBtn = document.getElementById('reactDemoBtn');
    const reactCounterVal = document.getElementById('reactCounterVal');
    let counterVal = 0;

    if (reactDemoBtn && reactCounterVal) {
        reactDemoBtn.addEventListener('click', () => {
            counterVal += 1;
            reactCounterVal.textContent = counterVal;
            
            // Micro-interaction bounce scaling
            reactCounterVal.style.transform = 'scale(1.25)';
            setTimeout(() => {
                reactCounterVal.style.transform = 'scale(1)';
            }, 100);
        });
    }

});
