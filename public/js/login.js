document.addEventListener('DOMContentLoaded', function() {
    console.log('login.js loaded successfully!');

    const registerBtn = document.querySelector('#registerBtn');
    const loginBtn = document.querySelector('#loginBtn');

    const handleRegister = async function() {
        const username = document.querySelector('#registerUsername').value;
        const password = document.querySelector('#registerPassword').value;
        try {
            await axios.post('/login', { username, password });
            console.log('User registered successfully!');
        } catch (error) {
            console.error(error);
        };
    };

    const handleLogin = async function() {
        const username = document.querySelector('#loginUsername').value;
        const password = document.querySelector('#loginPassword').value;
        try {
            const response = await axios.post('/login', { username, password });
            //Debug
            const user=user.find(user.username= req.body.username)
            if (user == null){
                return response.status(400).send('cannot find user')
            }
            try{
                if(await bcrypt.compare(req.body.password, user.password)) {
                    res.send('Sucess')
                }else {
                    res.send('not allowed')
                }

            } catch {
                response.status(500).send()
            }
                
            console.log(username);
            console.log(password);
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