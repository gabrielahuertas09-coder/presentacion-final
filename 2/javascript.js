document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica del Menú (Panel Pequeño)
    const btn = document.getElementById("btnMenu");
    const panel = document.getElementById("panel");

    if (btn && panel) {
        btn.addEventListener("click", () => {
            panel.classList.toggle("active");
            btn.classList.toggle("active");
        });
    }

    // Cerrar panel al hacer click en un link
    document.querySelectorAll('.panel nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (panel) panel.classList.remove('active');
            if (btn) btn.classList.remove('active');
        });
    });

    // 2. Scroll suave al presionar Bienvenida
    const btnB = document.getElementById("btnBienvenida");
    const nextSec = document.getElementById("memory-parallax");

    if (btnB && nextSec) {
        btnB.addEventListener("click", () => {
            nextSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 3. Motor de Parallax Suaver (requestAnimationFrame)
    const layers = document.querySelectorAll(".layer");

    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        layers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute("data-speed"));
            if (isNaN(speed) || speed === 0) return;

            const parentSection = layer.closest('.sec-parallax');
            if (parentSection) {
                const sectionTop = parentSection.offsetTop;
                const relativeScroll = scrollY - sectionTop;
                const move = relativeScroll * speed;
                
                layer.style.transform = `translateY(${move}px)`;
            }
        });
        requestAnimationFrame(updateParallax);
    }

    // Iniciar loop de parallax
    requestAnimationFrame(updateParallax);

    // 4. Animaciones de Texto al hacer Scroll (Intersection Observer)
    const animElements = document.querySelectorAll('.animate-text, .animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    animElements.forEach(el => observer.observe(el));

    // 5. Brillo que sigue el cursor en la ventana del avión (Hero)
    const heroSec = document.getElementById('hero-parallax');
    const lightOverlay = document.querySelector('.light-overlay');

    if (heroSec && lightOverlay) {
        heroSec.addEventListener('mousemove', (e) => {
            const rect = heroSec.getBoundingClientRect();
            // Calcular porcentaje respecto al tamaño del contenedor
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Actualizar variables CSS
            lightOverlay.style.setProperty('--mouseX', `${x}%`);
            lightOverlay.style.setProperty('--mouseY', `${y}%`);
        });
    }

    // 6. Animación de Hojas Cayendo (Exclusiva Sección 2 + Realismo Pro)
    const memoryContainer = document.querySelector('#memory-parallax .parallax-container');
    
    if (memoryContainer) {
        // Agregar perspectiva para que las rotaciones 3D se vean reales
        memoryContainer.style.perspective = "1000px";

        const leavesContainer = document.createElement('div');
        leavesContainer.style.position = 'absolute';
        leavesContainer.style.top = '0';
        leavesContainer.style.left = '0';
        leavesContainer.style.width = '100%';
        leavesContainer.style.height = '100%';
        leavesContainer.style.pointerEvents = 'none';
        leavesContainer.style.zIndex = '15';
        leavesContainer.style.overflow = 'hidden';
        memoryContainer.appendChild(leavesContainer);

        class Leaf {
            constructor() {
                this.el = document.createElement('div');
                this.el.style.position = 'absolute';
                
                // Variedad de tamaños
                this.baseSize = Math.random() * 10 + 15; 
                this.el.style.width = this.baseSize + 'px';
                this.el.style.height = (this.baseSize * (Math.random() * 0.3 + 0.5)) + 'px';
                
                const leafColors = ['#4a5d23', '#8b7d3a', '#a67c52', '#5e6b3f', '#7d8a43'];
                const color = leafColors[Math.floor(Math.random() * leafColors.length)];
                
                // Gradiente para volumen y vena central
                this.el.style.background = `linear-gradient(135deg, ${color} 0%, ${color} 48%, rgba(0,0,0,0.2) 50%, ${color} 52%, ${color} 100%)`;
                
                // Variar la forma para que no todas sean iguales
                const br = Math.random() > 0.5 ? '2px 100% 2px 100%' : '5px 80% 5px 80%';
                this.el.style.borderRadius = br; 
                
                this.el.style.opacity = Math.random() * 0.4 + 0.6;
                this.el.style.boxShadow = '1px 2px 5px rgba(0,0,0,0.2)';
                
                leavesContainer.appendChild(this.el);
                this.reset(true);
            }
            
            reset(initial = false) {
                const containerWidth = leavesContainer.offsetWidth || window.innerWidth;
                const containerHeight = leavesContainer.offsetHeight || window.innerHeight;
                
                this.x = initial ? Math.random() * containerWidth : -40; 
                this.y = initial ? Math.random() * containerHeight : Math.random() * containerHeight * 0.7 - 50; 
                
                // Velocidades orgánicas
                this.vx = Math.random() * 1.8 + 1.2; 
                this.vy = Math.random() * 0.8 + 1.0; 
                
                // Ejes de rotación 3D
                this.rotX = Math.random() * 360;
                this.rotY = Math.random() * 360;
                this.rotZ = Math.random() * 360;
                
                this.rvX = (Math.random() - 0.5) * 5;
                this.rvY = (Math.random() - 0.5) * 10;
                this.rvZ = (Math.random() - 0.5) * 2;
                
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            }
            
            update() {
                const containerWidth = leavesContainer.offsetWidth || window.innerWidth;
                const containerHeight = leavesContainer.offsetHeight || window.innerHeight;

                this.x += this.vx;
                this.y += this.vy;
                
                // Actualizar rotaciones 3D
                this.rotX += this.rvX;
                this.rotY += this.rvY;
                this.rotZ += this.rvZ;
                
                this.wobble += this.wobbleSpeed;
                
                // Efecto de planeo (oscilación)
                const driftX = Math.sin(this.wobble) * 30;
                const driftY = Math.cos(this.wobble * 0.7) * 10;
                
                const currentX = this.x + driftX;
                const currentY = this.y + driftY;
                
                this.el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotateX(${this.rotX}deg) rotateY(${this.rotY}deg) rotateZ(${this.rotZ}deg)`;
                
                // Salida de límites
                if (this.x > containerWidth + 60 || this.y > containerHeight + 60) {
                    this.reset();
                }
            }
        }
        
        const leavesList = [];
        const leafCount = 15; // Menos hojas pero con más movimiento 3D
        for (let i = 0; i < leafCount; i++) {
            leavesList.push(new Leaf());
        }
        
        function animateLeaves() {
            leavesList.forEach(leaf => leaf.update());
            requestAnimationFrame(animateLeaves);
        }
        
        animateLeaves();
    }

    // 7. Animación interactiva de título Hero
    const heroTitle = document.querySelector('.oraz-hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        
        // Split in letters
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // preserve spaces
            span.style.display = 'inline-block';
            span.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s';
            span.style.animation = `fadeInUp 0.5s ease forwards ${i * 0.05}s`;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.cursor = 'default';
            
            span.addEventListener('mouseenter', () => {
                span.style.transform = 'translateY(-10px) scale(1.1)';
                span.style.color = '#ffffff'; // Brilla blanco temporalmente
                span.style.textShadow = '0 0 10px #fcd5a3, 0 0 20px #e59f20, 0 0 40px #e59f20';
            });
            
            span.addEventListener('mouseleave', () => {
                span.style.transform = 'translateY(0) scale(1)';
                span.style.color = '#e59f20'; // Vuelve a dorado
                span.style.textShadow = '2px 2px 15px rgba(0, 0, 0, 0.7)';
            });
            
            heroTitle.appendChild(span);
        });
    }

    // 8. Efecto 3D Tilt para Tarjetas de Canciones
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        const inner = card.querySelector('.tilt-card-inner');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (centerY - y) / 10;
            const rotateY = (x - centerX) / 10;
            
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // 9. Observer para Revelación Escalonada (Stagger) y Trazos Gráficos
    const staggerElements = document.querySelectorAll('.stagger-reveal, .graphic-stroke');
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Pequeño delay opcional para el efecto de cascada si hay varios
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    // 10. Lógica de Reproductor de Música In-Page
    const musicCards = document.querySelectorAll('.oraz-song-card');
    let currentPlayingMedia = null;
    let currentPlayingBtn = null;

    musicCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const btn = card.querySelector('.js-music-btn');
            const audioId = btn.getAttribute('data-audio-id');
            const media = document.getElementById(audioId);

            if (!media) return;

            // Si hay uno sonando y no es este, pausar
            if (currentPlayingMedia && currentPlayingMedia !== media) {
                currentPlayingMedia.pause();
                currentPlayingMedia.currentTime = 0;
                if (currentPlayingBtn) {
                    currentPlayingBtn.textContent = '▶';
                    currentPlayingBtn.classList.remove('playing');
                }
            }

            // Toggle Play/Pause
            if (media.paused) {
                media.play().then(() => {
                    btn.textContent = '⏸';
                    btn.classList.add('playing');
                    currentPlayingMedia = media;
                    currentPlayingBtn = btn;
                }).catch(err => {
                    console.error("Error al reproducir:", err);
                    // Si falla, intentamos cargar y reproducir de nuevo (por si es issue de preload)
                    media.load();
                    media.play().then(() => {
                        btn.textContent = '⏸';
                        btn.classList.add('playing');
                        currentPlayingMedia = media;
                        currentPlayingBtn = btn;
                    });
                });
            } else {
                media.pause();
                btn.textContent = '▶';
                btn.classList.remove('playing');
                currentPlayingMedia = null;
                currentPlayingBtn = null;
            }

            media.onended = () => {
                btn.textContent = '▶';
                btn.classList.remove('playing');
                if (currentPlayingMedia === media) {
                    currentPlayingMedia = null;
                    currentPlayingBtn = null;
                }
            };
        });
    });

    // 11. Countdown Timer Logic
    function updateCountdown() {
        const targetDate = new Date('October 9, 2026 00:00:00').getTime();
        const now = new Date().getTime();
        const gap = targetDate - now;

        if (gap < 0) return; // Event passed

        // Time constants
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        // Calculate
        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        // Update DOM
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.innerText = d.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = h.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = m.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = s.toString().padStart(2, '0');
    }

    if (document.getElementById('days')) {
        setInterval(updateCountdown, 1000);
        updateCountdown(); // Run immediately
    }
});


    // 12. Lógica de Modales Premium (Agenda Cultural)
    const modalOverlay = document.getElementById('premium-modal-overlay');
    const modalBox = document.getElementById('premium-modal-box');
    const closeModal = document.getElementById('close-modal');
    
    const eventData = {
        'ficem': {
            badge: 'Cine y Memoria',
            title: 'Festival Internacional de Cine Evaristo Márquez',
            content: `
                <p>Nace como un homenaje profundo a Evaristo Márquez, el primer actor afrocolombiano en alcanzar la pantalla grande internacional. Este festival no es solo una muestra de cine, es una herramienta de resistencia cultural y empoderamiento para la comunidad de Palenque.</p>
                <h4>¿De qué trata?</h4>
                <p>Proyecciones de cine afro, cortometrajes creados por colectivos locales y documentales internacionales que exploran la identidad negra. Incluye talleres de formación para jóvenes y espacios de debate sobre la memoria histórica.</p>
                <h4>Fechas Aproximadas</h4>
                <p>Generalmente se lleva a cabo entre los meses de septiembre y noviembre, variando según la programación cultural anual.</p>
            `,
            dates: '📅 Septiembre - Noviembre'
        },
        'tambores': {
            badge: 'Tradición Viva',
            title: 'Festival de Tambores y Expresiones Culturales',
            content: `
                <p>Es, sin duda, el corazón latiente de Palenque. Un espacio donde el tambor no se escucha solo como música, sino como un lenguaje ancestral que convoca, comunica y recuerda nuestras raíces africanas.</p>
                <h4>¿Qué sucede aquí?</h4>
                <p>Música tradicional en vivo (bullerengue, son palenquero, mapalé), competencias de danza, muestras gastronómicas y ritualidad sagrada. Es el momento de máxima transmisión generacional de saberes.</p>
                <h4>Fechas Aproximadas</h4>
                <p>Se realiza tradicionalmente cada mes de octubre, coincidiendo con festividades de la hispanidad para reivindicar nuestra propia historia de libertad.</p>
            `,
            dates: '📅 Octubre (Anual)'
        },
        'diaspora-bogota': {
            badge: 'Identidad en la Ciudad',
            title: 'Semana de la Diáspora Palenquera en Bogotá',
            content: `
                <p>Un evento vital que extiende los límites del territorio hasta la capital colombiana. Busca visibilizar la presencia palenquera en contextos urbanos y fortalecer la conexión entre el campo y la ciudad.</p>
                <h4>¿Qué incluye?</h4>
                <p>Presentaciones de grupos como Kombilesa Mi, muestras de dulces tradicionales preparados por palenqueras residentes en Bogotá y conversatorios sobre los desafíos de la migración afro.</p>
                <h4>Fechas Aproximadas</h4>
                <p>Suele coincidir con la Semana de la Afrocolombianidad en mayo o durante festivales culturales en septiembre.</p>
            `,
            dates: '📅 Mayo o Septiembre'
        },
        'alma-sonante': {
            badge: 'Afro Contemporáneo',
            title: 'El Alma Sonante de la Diáspora',
            content: `
                <p>Un proyecto cultural itinerante que explora la diáspora como una identidad compartida y en constante evolución. Conecta las raíces africanas con las realidades del Caribe y el interior de Colombia.</p>
                <h4>¿Qué lo hace especial?</h4>
                <p>Integra lo mejor de los ritmos tradicionales con expresiones urbanas modernas como el rap afro y el "spoken word". Es un espacio donde la oralidad se convierte en memoria viva y resistencia sonora.</p>
                <h4>Fechas Aproximadas</h4>
                <p>Evento itinerante. Se recomienda estar atento a las programaciones de los circuitos culturales afro en Bogotá y otras regiones.</p>
            `,
            dates: '📅 Programación Itinerante'
        }
    };

    document.querySelectorAll('.activity-card-premium, .js-premium-modal-trigger').forEach(card => {
        card.addEventListener('click', () => {
            const eventId = card.getAttribute('data-event-id');
            const data = eventData[eventId];
            
            if (data && modalOverlay) {
                const badgeEl = document.getElementById('modal-badge');
                const titleEl = document.getElementById('modal-title');
                const contentEl = document.getElementById('modal-content');
                const datesEl = document.getElementById('modal-dates');
                
                if (badgeEl) badgeEl.innerText = data.badge;
                if (titleEl) titleEl.innerText = data.title;
                if (contentEl) contentEl.innerHTML = data.content;
                if (datesEl) datesEl.innerText = data.dates;
                
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Evitar scroll
            }
        });
    });

    if (closeModal && modalOverlay) {
        const closeFunc = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
        
        closeModal.addEventListener('click', closeFunc);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeFunc();
        });
    }
