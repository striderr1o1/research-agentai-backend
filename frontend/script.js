document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const queryInput = document.getElementById('query-input');
    const pdfUpload = document.getElementById('pdf-upload');
    const chatMessages = document.getElementById('chat-messages');

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
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        appendMessage('user', query);
        queryInput.value = '';
        pdfUpload.value = '';

        fetch('http://127.0.0.1:8000/run', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            appendMessage('assistant', data.result);
        })
        .catch(error => {
            console.error('Error:', error);
            console.error('Response:', error.response);
            appendMessage('assistant', 'Sorry, something went wrong.');
        });
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'assistant-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});