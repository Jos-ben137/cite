/* js/neural.js */
(function() {
    'use strict';
    
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, centerX, centerY, scale;
    
    // Configuración Base
    let config = {
        particleCount: 30,
        connectionDist: 160,
        baseSpeed: 0.001, // Velocidad pacífica
        // Colores por defecto (se actualizarán dinámicamente)
        color: '30, 41, 59',
        highlight: '15, 61, 48',
        accent: '212, 160, 23',
        lineAlpha: 0.1
    };

    // Función para actualizar colores según el tema
    function updateThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            // Configuración MODO OSCURO
            config.color = '255, 255, 255';    // Nodos blancos
            config.highlight = '0, 212, 255';  // Cyan
            config.accent = '0, 212, 255';     // Acento Cyan
            config.lineAlpha = 0.08;
        } else {
            // Configuración MODO CLARO
            config.color = '15, 61, 48';       // Nodos Verde Marca Oscuro
            config.highlight = '51, 65, 85';   // Slate
            config.accent = '15, 61, 48';      // Acento Verde Marca
            config.lineAlpha = 0.06;           // Líneas muy sutiles
        }
    }

    // Observador para detectar cambios de tema en tiempo real
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateThemeColors();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
    
    // Inicializar colores
    updateThemeColors();

    const nodes = [];
    let pulses = [];

    function resize() {
        const parent = canvas.parentElement;
        width = canvas.width = parent.offsetWidth;
        height = canvas.height = parent.offsetHeight;
        scale = Math.min(width, height) / 1000;

        // Ajuste Responsive
        if (window.innerWidth > 768) {
            centerX = width * 0.75; 
            config.particleCount = 40;
        } else {
            // En móvil bajamos el centro para no tapar el texto
            centerX = width * 0.5;
            centerY = height * 0.55; 
            config.particleCount = 20;
        }
        
        if (window.innerWidth > 768) centerY = height * 0.5;
        createNetwork();
    }

    class Node {
        constructor(x, y, layer) {
            this.baseX = x; this.baseY = y;
            this.x = x; this.y = y;
            this.layer = layer;
            this.radius = layer === 0 ? 5 : (layer === 1 ? 3 : 1.5);
            this.connections = [];
            this.floatPhase = Math.random() * Math.PI * 2;
            this.floatSpeed = config.baseSpeed + Math.random() * 0.001;
            this.floatRadius = 15 + Math.random() * 10;
        }
        update(time) {
            this.x = this.baseX + Math.sin(time * this.floatSpeed + this.floatPhase) * this.floatRadius;
            this.y = this.baseY + Math.cos(time * this.floatSpeed * 0.8 + this.floatPhase) * this.floatRadius;
        }
        draw() {
            const r = this.radius * scale;
            ctx.beginPath();
            ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
            
            // Opacidad elegante
            const alpha = this.layer === 0 ? 0.8 : (this.layer === 1 ? 0.4 : 0.2);
            ctx.fillStyle = `rgba(${config.color}, ${alpha})`;
            ctx.fill();
        }
    }

    class Pulse {
        constructor(start, end) {
            this.start = start; this.end = end;
            this.progress = 0;
            this.speed = 0.008; 
        }
        update() { this.progress += this.speed; return this.progress < 1; }
        draw() {
            const x = this.start.x + (this.end.x - this.start.x) * this.progress;
            const y = this.start.y + (this.end.y - this.start.y) * this.progress;
            ctx.beginPath();
            ctx.arc(x, y, 2 * scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${config.accent})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgb(${config.accent})`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function createNetwork() {
        nodes.length = 0;
        nodes.push(new Node(centerX, centerY, 0));
        
        const r1 = 140 * scale;
        for (let i = 0; i < 7; i++) {
            const a = (i / 7) * Math.PI * 2;
            nodes.push(new Node(centerX + Math.cos(a) * r1, centerY + Math.sin(a) * r1, 1));
        }
        const r2 = 300 * scale;
        for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2 + 0.3;
            nodes.push(new Node(centerX + Math.cos(a) * r2, centerY + Math.sin(a) * r2, 2));
        }
        for (let i = 1; i <= 7; i++) {
            nodes[0].connections.push(nodes[i]);
            // Conectar hijos
            const t1 = 8 + ((i * 2) % 14);
            const t2 = 8 + ((i * 2 + 1) % 14);
            if(nodes[t1]) nodes[i].connections.push(nodes[t1]);
            if(nodes[t2]) nodes[i].connections.push(nodes[t2]);
        }
    }

    function drawConnections() {
        ctx.lineWidth = 0.8; 
        nodes.forEach(node => {
            node.connections.forEach(target => {
                const dist = Math.hypot(node.x - target.x, node.y - target.y);
                const alpha = Math.max(0.01, config.lineAlpha - dist / 1500);
                
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(target.x, target.y);
                ctx.strokeStyle = `rgba(${config.color}, ${alpha})`;
                ctx.stroke();
            });
        });
    }

    function spawnPulse() {
        if (Math.random() < 0.03) { 
            const source = nodes[Math.floor(Math.random() * nodes.length)];
            if (source && source.connections.length > 0) {
                const target = source.connections[Math.floor(Math.random() * source.connections.length)];
                pulses.push(new Pulse(source, target));
            }
        }
    }

    let time = 0;
    function animate() {
        ctx.clearRect(0, 0, width, height);
        time++;
        nodes.forEach(n => { n.update(time); n.draw(); });
        drawConnections();
        spawnPulse();
        pulses = pulses.filter(p => { const alive = p.update(); p.draw(); return alive; });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    setTimeout(resize, 100);
    animate();
})();