// Membuat partikel background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size, position, and animation delay
        const size = Math.random() * 20 + 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Membuat efek Matrix Rain
function createMatrixRain() {
    const matrixContainer = document.getElementById('matrixRain');
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
    const columnCount = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.classList.add('matrix-column');
        
        // Random position and animation delay
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 5 + Math.random() * 10;
        
        column.style.left = `${left}%`;
        column.style.animationDelay = `${delay}s`;
        column.style.animationDuration = `${duration}s`;
        
        // Add random characters
        const charCount = 20 + Math.floor(Math.random() * 20);
        for (let j = 0; j < charCount; j++) {
            const char = document.createElement('span');
            char.textContent = characters.charAt(Math.floor(Math.random() * characters.length));
            char.style.opacity = Math.random() * 0.5 + 0.5;
            column.appendChild(char);
            column.appendChild(document.createElement('br'));
        }
        
        matrixContainer.appendChild(column);
    }
}

// Animasi saat scroll menggunakan Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars when skills section is visible
                if (entry.target.classList.contains('skills') || entry.target.closest('.about-content')) {
                    const skillBars = document.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = `${width}%`;
                        }, 300);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll('.section-title, .about-text, .skills, .contact-content, .project-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Smooth scroll untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.getElementById('navLinks').classList.remove('active');
                document.getElementById('menuToggle').classList.remove('active');
            }
        }
    });
});

// Scroll to top functionality
document.querySelector('.scroll-to-top').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Efek glitch acak pada judul
function randomGlitch() {
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(element => {
        if (Math.random() > 0.7) {
            element.style.animation = 'glitch 0.3s';
            setTimeout(() => {
                element.style.animation = '';
            }, 300);
        }
    });
    
    setTimeout(randomGlitch, 2000 + Math.random() * 3000);
}

// Mobile menu toggle
document.getElementById('menuToggle').addEventListener('click', function() {
    this.classList.toggle('active');
    document.getElementById('navLinks').classList.toggle('active');
});

// Interactive Terminal
const interactiveTerminal = document.getElementById('interactiveTerminal');
const terminalInput = document.getElementById('terminalInput');
const terminalBody = document.getElementById('terminalBody');
const terminalClose = document.querySelector('.interactive-terminal .terminal-controls .close');
const terminalMinimize = document.querySelector('.interactive-terminal .terminal-controls .minimize');
const terminalMaximize = document.querySelector('.interactive-terminal .terminal-controls .maximize');
const terminalHeader = document.getElementById('terminalHeader');

let isTerminalMaximized = false;
let isTerminalMinimized = false;

const createCommands = (body) => ({
    help: () => {
        return `Perintah yang tersedia:
- help: Menampilkan daftar perintah
- about: Informasi tentang saya
- skills: Skill yang saya miliki
- projects: Proyek yang telah dibuat
- contact: Informasi kontak
- clear: Membersihkan terminal
- date: Menampilkan tanggal dan waktu saat ini
- echo [text]: Menampilkan teks yang dimasukkan
- med: menampilkan nama saya
- sekolah: sekolah saya
- halem: Menampilkan pesan rahasia`;
    },
    about: () => {
        return `Saya adalah seorang siswa kelas IX RPL A SML AL BASTHOMI yang baru memulai dunia percodingan. Saya baru bisa HTML, CSS, dan JavaScript.`;
    },
    skills: () => {
        return `Skill yang saya miliki:
- HTML: 75%
- CSS: 65%
- JavaScript: 20%
- Python: 1%
- SQL/Database: 0%`;
    },
    projects: () => {
        return `Proyek yang telah saya buat:
1. Home page sederhana
2. Biodata diri
3. Game sederhana menggunakan JavaScript`;
    },
    contact: () => {
        return `Anda dapat menghubungi saya melalui:
- Email: menzpro8@gmail.com
- WhatsApp: +6287822706235
- GitHub: menzpro8-crypto
- Instagram: medz_gtc`;
    },
    clear: () => {
        const outputs = body.querySelectorAll('.terminal-output');
        outputs.forEach(output => output.remove());
        return '';
    },
    date: () => {
        return new Date().toString();
    },
    echo: (args) => {
        return args.join(' ');
    },
    halem: () => {
        return "HALEM GANTENKKK";
    },
    med: () => {
        return "Muhammad Hamid Rasydan";
    },
    sekolah: () => {
        return "SMK AL BASTHOMI"
    }
});

// Terminal functionality
// Terminal is visible by default

terminalClose.addEventListener('click', () => {
    interactiveTerminal.style.display = 'none';
});

terminalMinimize.addEventListener('click', () => {
    if (isTerminalMinimized) {
        terminalBody.style.display = 'block';
        isTerminalMinimized = false;
    } else {
        terminalBody.style.display = 'none';
        isTerminalMinimized = true;
    }
});

terminalMaximize.addEventListener('click', () => {
    if (isTerminalMaximized) {
        interactiveTerminal.style.width = '400px';
        interactiveTerminal.style.height = '300px';
        interactiveTerminal.style.right = '20px';
        interactiveTerminal.style.bottom = '20px';
        interactiveTerminal.style.transform = 'translate3d(0, 0, 0)';
    } else {
        interactiveTerminal.style.width = '90%';
        interactiveTerminal.style.height = '80%';
        interactiveTerminal.style.right = '5%';
        interactiveTerminal.style.bottom = '10%';
        interactiveTerminal.style.transform = 'translate3d(0, 0, 0)';
    }
    isTerminalMaximized = !isTerminalMaximized;
});

// Make terminal draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

terminalHeader.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    
    if (e.target === terminalHeader || e.target.classList.contains('terminal-title')) {
        isDragging = true;
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        xOffset = currentX;
        yOffset = currentY;
        
        setTranslate(currentX, currentY, interactiveTerminal);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

// Terminal input handling
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value.trim();
        terminalInput.value = '';
        
        // Add input to terminal
        const inputLine = document.createElement('div');
        inputLine.classList.add('terminal-output');
        inputLine.innerHTML = `<span class="terminal-prompt">hamid@portfolio:~$</span> ${input}`;
        terminalBody.insertBefore(inputLine, terminalBody.lastElementChild);
        
        // Process command
        let output = '';
        const [command, ...args] = input.split(' ');
        const cmds = createCommands(terminalBody);
        
        if (cmds[command]) {
            output = cmds[command](args);
        } else if (input) {
            output = `Perintah tidak dikenali: ${input}. Ketik 'help' untuk melihat daftar perintah.`;
        }
        
        // Add output to terminal
        if (output) {
            const outputLine = document.createElement('div');
            outputLine.classList.add('terminal-output');
            outputLine.textContent = output;
            terminalBody.insertBefore(outputLine, terminalBody.lastElementChild);
        }
        
        // Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

// Inisialisasi saat halaman dimuat
window.addEventListener('load', function() {
    createParticles();
    createMatrixRain();
    initScrollAnimations();
    randomGlitch();
    
    // Animate header on load
    document.querySelector('.hero-content').style.opacity = '1';
});

// Event listener untuk scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('active');
    } else {
        scrollToTopBtn.classList.remove('active');
    }
});

// Efek ketik pada terminal
function typeTerminalText() {
    const terminalBody = document.querySelector('.terminal-body');
    const lines = terminalBody.querySelectorAll('p');
    
    lines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    if (index === lines.length - 1) {
                        line.innerHTML = text + '<span class="terminal-cursor"></span>';
                    }
                }
            }, 50);
        }, index * 1000);
    });
}

// Jalankan efek ketik setelah halaman dimuat
setTimeout(typeTerminalText, 3000);

// Handle about terminal input
const terminalInputAbout = document.getElementById('terminalInputAbout');
const terminalBodyAbout = document.querySelector('.about .terminal-body');

terminalInputAbout.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInputAbout.value.trim();
        terminalInputAbout.value = '';

        // Add input to terminal
        const inputLine = document.createElement('div');
        inputLine.classList.add('terminal-output');
        inputLine.innerHTML = `<span class="terminal-prompt">hamid@portfolio:~$</span> ${input}`;
        terminalBodyAbout.insertBefore(inputLine, terminalBodyAbout.lastElementChild);

        // Process command
        let output = '';
        const [command, ...args] = input.split(' ');
        const cmds = createCommands(terminalBodyAbout);

        if (cmds[command]) {
            output = cmds[command](args);
        } else if (input) {
            output = `Perintah tidak dikenali: ${input}. Ketik 'help' untuk melihat daftar perintah.`;
        }

        // Add output to terminal
        if (output) {
            const outputLine = document.createElement('div');
            outputLine.classList.add('terminal-output');
            outputLine.textContent = output;
            terminalBodyAbout.insertBefore(outputLine, terminalBodyAbout.lastElementChild);
        }

        // Scroll to bottom
        terminalBodyAbout.scrollTop = terminalBodyAbout.scrollHeight;
    }
});

// Handle window resize untuk perbaikan landscape
window.addEventListener('resize', function() {
    // Jika dalam mode landscape dengan tinggi terbatas, sesuaikan padding
    if (window.innerHeight < 500 && window.innerWidth > window.innerHeight) {
        document.querySelectorAll('section').forEach(section => {
            section.style.padding = '40px 0';
        });
    }
});
