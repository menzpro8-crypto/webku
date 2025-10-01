// Reptile Cursor - Kadal Berjalan Natural
console.log('Walking lizard cursor script loaded');

let reptileCursor = null;

class ReptileCursor {
    constructor() {
        console.log('WalkingLizardCursor constructor called');
        
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isActive = true;
        
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        
        // Lizard properties
        this.body = [];
        this.legs = [];
        this.tail = [];
        this.bodyLength = 10;
        this.segmentSize = 8;
        
        // Walking properties
        this.walkCycle = 0;
        this.walkSpeed = 0.1;
        this.isWalking = false;
        this.walkDirection = 0;
        
        this.init();
    }
    
    init() {
        console.log('Creating canvas...');
        
        // Buat canvas
        this.canvas = document.createElement("canvas");
        this.canvas.id = "reptile-cursor";
        document.body.appendChild(this.canvas);
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = "fixed";
        this.canvas.style.left = "0px";
        this.canvas.style.top = "0px";
        this.canvas.style.pointerEvents = "none";
        this.canvas.style.zIndex = "9998";
        this.canvas.style.opacity = "0.8";
        
        this.ctx = this.canvas.getContext("2d");
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup lizard
        this.setupLizard();
        
        // Start animation
        this.startAnimation();
        
        reptileCursor = this;
    }
    
    setupEventListeners() {
        document.addEventListener("mousemove", (event) => {
            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            
            // Detect movement direction and speed
            const dx = this.mouseX - this.lastMouseX;
            const dy = this.mouseY - this.lastMouseY;
            const moveDistance = Math.sqrt(dx * dx + dy * dy);
            
            this.isWalking = moveDistance > 1; // Mulai berjalan jika mouse bergerak
            this.walkDirection = Math.atan2(dy, dx);
            
            if (this.isWalking) {
                this.walkSpeed = Math.min(0.15, moveDistance * 0.02); // Speed berdasarkan kecepatan mouse
            }
        });
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    setupLizard() {
        console.log('Setting up walking lizard...');
        
        // Reset
        this.body = [];
        this.legs = [];
        this.tail = [];
        
        // Create lizard body
        const startX = this.mouseX - 40;
        const startY = this.mouseY;
        
        for (let i = 0; i < this.bodyLength; i++) {
            const width = i < 3 ? 0.8 : (i > 6 ? 0.7 : 1.0);
            this.body.push({
                x: startX + i * this.segmentSize,
                y: startY,
                size: width,
                angle: 0
            });
        }
        
        // Create tail
        let tailX = this.body[this.bodyLength-1].x;
        let tailY = this.body[this.bodyLength-1].y;
        
        for (let i = 0; i < 8; i++) {
            this.tail.push({
                x: tailX + i * this.segmentSize * 0.7,
                y: tailY,
                size: 0.5 - (i * 0.05),
                angle: 0
            });
        }
        
        // Setup legs dengan walking pattern
        this.setupLegs();
        
        console.log('Walking lizard setup complete');
    }
    
    setupLegs() {
        // Front legs - alternating pattern untuk walking
        this.legs.push({
            attachIndex: 2,
            side: -1, // kiri depan
            type: 'front',
            phase: 0,    // Start phase
            length: 16
        });
        
        this.legs.push({
            attachIndex: 2, 
            side: 1,  // kanan depan
            type: 'front',
            phase: Math.PI, // Opposite phase
            length: 16
        });
        
        // Back legs - alternating dengan depan
        this.legs.push({
            attachIndex: 6,
            side: -1, // kiri belakang
            type: 'back', 
            phase: Math.PI, // Sync dengan kanan depan
            length: 18
        });
        
        this.legs.push({
            attachIndex: 6,
            side: 1,  // kanan belakang
            type: 'back',
            phase: 0, // Sync dengan kiri depan
            length: 18
        });
    }
    
    updateLizard() {
        if (this.body.length === 0) return;
        
        const head = this.body[0];
        
        // HEAD: Follow mouse dengan smooth movement
        const headDx = this.mouseX - head.x;
        const headDy = this.mouseY - head.y;
        const headDistance = Math.sqrt(headDx * headDx + headDy * headDy);
        
        let moveSpeed = 0.03; // Default slow speed
        
        if (this.isWalking && headDistance > 10) {
            // Saat berjalan, kecepatan menyesuaikan
            moveSpeed = Math.min(0.08, headDistance * 0.008);
            head.angle = this.walkDirection;
        } else {
            // Saat diam, kepala mengikuti mouse
            head.angle = Math.atan2(headDy, headDx);
        }
        
        head.x += headDx * moveSpeed;
        head.y += headDy * moveSpeed;
        
        // Update walk cycle hanya jika berjalan
        if (this.isWalking) {
            this.walkCycle += this.walkSpeed;
        } else {
            // Slow down walk cycle when stopping
            this.walkCycle *= 0.95;
        }
        
        // BODY: Update dengan walking motion
        for (let i = 1; i < this.body.length; i++) {
            const current = this.body[i];
            const previous = this.body[i - 1];
            
            const dx = current.x - previous.x;
            const dy = current.y - previous.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > this.segmentSize) {
                const moveX = (dx / distance) * this.segmentSize;
                const moveY = (dy / distance) * this.segmentSize;
                
                current.x = previous.x + moveX;
                current.y = previous.y + moveY;
            }
            
            // Body sway saat berjalan
            if (this.isWalking) {
                const sway = Math.sin(this.walkCycle + i * 0.8) * 2;
                current.y += sway * 0.5;
                
                // sedikit rotasi body mengikuti arah jalan
                current.angle = this.walkDirection + sway * 0.1;
            }
        }
        
        // TAIL: Follow body dengan wave motion
        if (this.tail.length > 0) {
            const bodyEnd = this.body[this.body.length - 1];
            this.tail[0].x = bodyEnd.x;
            this.tail[0].y = bodyEnd.y;
            
            for (let i = 1; i < this.tail.length; i++) {
                const current = this.tail[i];
                const previous = this.tail[i - 1];
                
                const dx = current.x - previous.x;
                const dy = current.y - previous.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > this.segmentSize * 0.7) {
                    const moveX = (dx / distance) * this.segmentSize * 0.7;
                    const moveY = (dy / distance) * this.segmentSize * 0.7;
                    
                    current.x = previous.x + moveX;
                    current.y = previous.y + moveY;
                }
                
                // Tail wave motion saat berjalan
                if (this.isWalking) {
                    const tailWave = Math.sin(this.walkCycle * 1.5 + i * 0.7) * 3;
                    current.y += tailWave * 0.4;
                }
            }
        }
    }
    
    drawLizard() {
        if (!this.ctx) return;
        
        this.ctx.strokeStyle = "#00ff41";
        this.ctx.fillStyle = "rgba(0, 255, 65, 0.1)";
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowColor = '#00ff41';
        this.ctx.shadowBlur = 8;
        
        // Draw BODY
        this.ctx.beginPath();
        for (let i = 0; i < this.body.length; i++) {
            const segment = this.body[i];
            const radius = 6 * segment.size;
            
            if (i === 0) {
                this.ctx.moveTo(segment.x + radius, segment.y);
            }
            
            this.ctx.ellipse(
                segment.x, segment.y, 
                radius, radius * 0.6, 
                segment.angle, 0, Math.PI * 2
            );
        }
        this.ctx.stroke();
        this.ctx.fill();
        
        // Draw TAIL
        this.ctx.beginPath();
        this.ctx.moveTo(this.tail[0].x, this.tail[0].y);
        for (let i = 1; i < this.tail.length; i++) {
            this.ctx.lineTo(this.tail[i].x, this.tail[i].y);
        }
        this.ctx.stroke();
        
        // Draw LEGS dengan walking animation
        this.legs.forEach(leg => {
            this.drawWalkingLizardLeg(leg);
        });
        
        // Draw HEAD
        this.drawLizardHead(this.body[0]);
        
        this.ctx.shadowBlur = 0;
    }
    
    drawWalkingLizardLeg(leg) {
        const attachPoint = this.body[leg.attachIndex];
        const cycle = this.walkCycle + leg.phase;
        
        let lift = 0;
        let swing = 0;
        
        if (this.isWalking) {
            // Walking motion: lift and swing
            lift = Math.max(0, Math.sin(cycle)) * 0.8;
            swing = Math.sin(cycle * 0.5) * 0.6;
        } else {
            // Standing position
            lift = 0.1; // Sedikit terangkat
            swing = 0.1;
        }
        
        const upperLength = leg.length;
        const lowerLength = leg.length * 0.7;
        
        // Upper leg
        let upperAngle = leg.type === 'front' ? -Math.PI/3 : -Math.PI/2.2;
        upperAngle += swing * (leg.side === -1 ? 1 : -1);
        
        const upperX = attachPoint.x + Math.cos(upperAngle) * upperLength;
        const upperY = attachPoint.y + Math.sin(upperAngle) * upperLength - lift * 8;
        
        this.ctx.beginPath();
        this.ctx.moveTo(attachPoint.x, attachPoint.y);
        this.ctx.lineTo(upperX, upperY);
        this.ctx.stroke();
        
        // Lower leg
        let lowerAngle = upperAngle + (leg.type === 'front' ? Math.PI/4 : Math.PI/3);
        lowerAngle += swing * 0.3 * (leg.side === -1 ? 1 : -1);
        
        const lowerX = upperX + Math.cos(lowerAngle) * lowerLength;
        const lowerY = upperY + Math.sin(lowerAngle) * lowerLength - lift * 4;
        
        this.ctx.beginPath();
        this.ctx.moveTo(upperX, upperY);
        this.ctx.lineTo(lowerX, lowerY);
        this.ctx.stroke();
        
        // Foot - hanya menyentuh ground saat tidak lift
        const isFootOnGround = lift < 0.3;
        
        this.ctx.beginPath();
        if (isFootOnGround) {
            // Foot flat on ground
            this.ctx.ellipse(lowerX, lowerY + 2, 4, 2, 0, 0, Math.PI * 2);
            
            // Draw toes hanya saat kaki menyentuh ground
            for (let i = 0; i < 4; i++) {
                const toeX = lowerX + (i - 1.5) * 1.5;
                const toeY = lowerY + 3;
                this.ctx.moveTo(lowerX + (i - 1.5) * 1, lowerY + 1);
                this.ctx.lineTo(toeX, toeY);
            }
        } else {
            // Foot lifted - bentuk lebih melengkung
            this.ctx.ellipse(lowerX, lowerY, 3, 1.5, lowerAngle, 0, Math.PI * 2);
        }
        this.ctx.stroke();
    }
    
    drawLizardHead(head) {
        const headSize = 10;
        
        // Head shape
        this.ctx.beginPath();
        this.ctx.ellipse(
            head.x, head.y, 
            headSize, headSize * 0.8, 
            head.angle, 0, Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = "#00ff41";
        const eyeOffset = 4;
        
        this.ctx.beginPath();
        this.ctx.arc(
            head.x + Math.cos(head.angle - Math.PI/4) * eyeOffset,
            head.y + Math.sin(head.angle - Math.PI/4) * eyeOffset,
            2, 0, Math.PI * 2
        );
        this.ctx.arc(
            head.x + Math.cos(head.angle + Math.PI/4) * eyeOffset, 
            head.y + Math.sin(head.angle + Math.PI/4) * eyeOffset,
            2, 0, Math.PI * 2
        );
        this.ctx.fill();
        
        // Mouth - sedikit terbuka saat berjalan
        this.ctx.strokeStyle = "#00ff41";
        this.ctx.beginPath();
        const mouthOpen = this.isWalking ? 0.3 : 0.1;
        this.ctx.arc(
            head.x + Math.cos(head.angle) * headSize * 0.8,
            head.y + Math.sin(head.angle) * headSize * 0.8,
            3 * (1 + mouthOpen), 0, Math.PI
        );
        this.ctx.stroke();
    }
    
    startAnimation() {
        console.log('Starting walking lizard animation...');
        
        const animate = () => {
            if (this.isActive && this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.updateLizard();
                this.drawLizard();
            }
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize
function initReptileCursor() {
    try {
        console.log('Initializing walking lizard cursor...');
        setTimeout(() => {
            new ReptileCursor();
            console.log('✅ Walking lizard cursor initialized!');
        }, 500);
    } catch (error) {
        console.error('❌ Failed to initialize walking lizard cursor:', error);
    }
}

// Start when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReptileCursor);
} else {
    initReptileCursor();
}