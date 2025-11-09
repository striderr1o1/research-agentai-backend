document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const queryInput = document.getElementById('query-input');
    const pdfUpload = document.getElementById('pdf-upload');
    const chatMessages = document.getElementById('chat-messages');
    const loadingIndicator = document.getElementById('loading-indicator');

    sendButton.addEventListener('click', sendMessage);
    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const query = queryInput.value.trim();
        const files = pdfUpload.files;

        if (query === '' && files.length === 0) {
            return;
        }

        const formData = new FormData();
        formData.append('query', query);
        let fileNames = [];
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
            fileNames.push(files[i].name);
        }

        let userMessage = query;
        if (fileNames.length > 0) {
            userMessage += `\n[Attached files: ${fileNames.join(', ')}]`;
        }
        appendMessage('user', userMessage);

        queryInput.value = '';
        pdfUpload.value = '';

        const thinkingMessageElement = appendMessage('assistant', 'Thinking...');
        if(loadingIndicator) loadingIndicator.style.display = 'block';

        fetch('http://127.0.0.1:8000/run', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (thinkingMessageElement) {
                chatMessages.removeChild(thinkingMessageElement);
            }
            appendMessage('assistant', data.result);
        })
        .catch(error => {
            console.error('Error:', error);
            if (thinkingMessageElement) {
                chatMessages.removeChild(thinkingMessageElement);
            }
            appendMessage('assistant', 'Sorry, something went wrong. Please check the console for details.');
        })
        .finally(() => {
            if(loadingIndicator) loadingIndicator.style.display = 'none';
        });
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'assistant-message');

        let content = '';
        if (typeof message === 'string') {
            content = message;
        } else if (message && message.result) {
            content = message.result;
        } else if (message) {
            content = JSON.stringify(message, null, 2);
        } else {
            // Don't append empty messages
            return null;
        }

        messageElement.innerText = content; // Use innerText to prevent HTML injection
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageElement;
    }
});