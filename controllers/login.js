document.addEventListener('DOMContentLoaded', function() {
    console.log('login.js loaded successfully!');

    const registerBtn = document.querySelector('#registerBtn');
    const loginBtn = document.querySelector('#loginBtn');

    const handleRegister = async function() {
        const username = document.querySelector('#registerUsername').value;
        const password = document.querySelector('#registerPassword').value;
        try {
            await axios.post('/register', { username, password });
            console.log('User registered successfully!');

        } catch (error) {
            console.error(error);
        };
    };

    const handleLogin = async function() {
        const username = document.querySelector('#loginUsername').value;
        const password = document.querySelector('#loginPassword').value;

        try {
            await axios.post('/signup', { username, password });
        } catch (error) {
            console.error(error);
        }
    };

    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    };

    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    };
});