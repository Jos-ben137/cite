/* js/chat.js */
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    const chatMinimize = document.getElementById('chatMinimize');
    const openIcon = chatToggle.querySelector('.chat-icon-open');
    const closeIcon = chatToggle.querySelector('.chat-icon-close');

    // URL de tu Backend (Proxy Python)
    const API_URL = "https://fime.ici-labs.com/api/chat";
    
    // Generar ID de usuario único
    let userId = localStorage.getItem('chat_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chat_user_id', userId);
    }

    function updateChatViewport() {
        const isMobile = window.matchMedia('(max-width: 480px)').matches;
        if (!isMobile) {
            document.documentElement.style.setProperty('--chat-vh', '1vh');
            document.documentElement.style.setProperty('--chat-keyboard-offset', '0px');
            return;
        }

        const viewport = window.visualViewport;
        const height = viewport ? viewport.height : window.innerHeight;
        const offsetTop = viewport ? viewport.offsetTop : 0;
        const keyboardOffset = Math.max(0, window.innerHeight - height - offsetTop);

        document.documentElement.style.setProperty('--chat-vh', `${height * 0.01}px`);
        document.documentElement.style.setProperty('--chat-keyboard-offset', `${keyboardOffset}px`);
    }

    function setChatOpen(isOpen) {
        chatWindow.classList.toggle('active', isOpen);
        if (isOpen) {
            openIcon.style.display = 'none';
            closeIcon.style.display = 'block';
            chatInput.focus();
            setTimeout(() => {
                updateChatViewport();
                scrollToBottom();
            }, 50);
        } else {
            openIcon.style.display = 'block';
            closeIcon.style.display = 'none';
            updateChatViewport();
        }
    }

    // Toggle Chat
    chatToggle.addEventListener('click', () => {
        const isOpen = !chatWindow.classList.contains('active');
        setChatOpen(isOpen);
    });

    if (chatMinimize) {
        chatMinimize.addEventListener('click', () => {
            setChatOpen(false);
        });
    }

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if(this.value === '') this.style.height = 'auto';
    });

    chatInput.addEventListener('focus', () => {
        setTimeout(() => {
            updateChatViewport();
            scrollToBottom();
        }, 50);
    });

    chatInput.addEventListener('blur', () => {
        setTimeout(updateChatViewport, 50);
    });

    // Enviar mensaje
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // UI: Mostrar mensaje usuario
        appendMessage('user', text);
        chatInput.value = '';
        chatInput.style.height = 'auto';
        chatInput.disabled = true;
        chatSend.disabled = true;

        // UI: Crear burbuja del bot vacía para el streaming
        const botMessageDiv = appendMessage('bot', '<span class="typing-dots">...</span>');
        let fullResponse = "";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userId
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: text }],
                    stream: true
                })
            });

            if (!response.ok) throw new Error("Error de red");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let isFirstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    try {
                        const json = JSON.parse(line);
                        if (json.message && json.message.content) {
                            if (isFirstChunk) {
                                botMessageDiv.innerHTML = ""; // Quitar puntos suspensivos
                                isFirstChunk = false;
                            }
                            // Efecto simple de escritura
                            const content = json.message.content;
                            fullResponse += content;
                            
                            // Reemplazar saltos de línea con <br>
                            botMessageDiv.innerHTML = fullResponse.replace(/\n/g, '<br>');
                            scrollToBottom();
                        }
                    } catch (e) {
                        console.error("Error parsing JSON chunk", e);
                    }
                }
            }

        } catch (error) {
            botMessageDiv.innerHTML = "Lo siento, hubo un error de conexión. Intenta de nuevo.";
            botMessageDiv.style.color = "red";
        } finally {
            chatInput.disabled = false;
            chatSend.disabled = false;
            chatInput.focus();
        }
    }

    // Helpers
    function appendMessage(role, htmlContent) {
        const div = document.createElement('div');
        div.className = `message message--${role}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message__content';
        contentDiv.innerHTML = htmlContent;
        
        div.appendChild(contentDiv);
        chatMessages.appendChild(div);
        scrollToBottom();
        return contentDiv; // Retornamos para actualizar en streaming
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    updateChatViewport();
    window.addEventListener('resize', updateChatViewport);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateChatViewport);
        window.visualViewport.addEventListener('scroll', updateChatViewport);
    }

    // Event Listeners para enviar
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
