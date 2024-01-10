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
            await axios.post('/login', { username, password });
            //Debug
            console.log(username);
            console.log(password);
            
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async function() {
        const name = document.querySelector('#name').value;
        //const password = document.querySelector('#loginPassword').value;

        try {
            await axios.post('/dashboard', { name});
            
            

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
    if (submitBtn) {
        submitBtn.addEventListener('click', handleSubmit);
    };
});