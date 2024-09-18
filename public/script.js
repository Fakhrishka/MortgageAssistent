document.addEventListener('DOMContentLoaded', () => {


    // LOADING DASHBOARD
    const dashboard = document.getElementById('dashboard');
    console.log(dashboard);
    if(dashboard)
    {
        const token = localStorage.getItem('token');
        console.log(token);

        axios.defaults.headers.common['Authorization'] = token;
        if (!token) {
            window.location.href = 'login.html'; // Перенаправляем на страницу логина, если нет токена
        }

        async function loadDashboard()
        {
            try
            {
                const response = await axios.get('http://localhost:3001/api/dashboard');
                console.log(response.data);
                // const data = await response.json();

                document.getElementById('dashboard').innerHTML = `<p>${response.data.message}</p>`;
            }
            catch (error)
            {
                console.error('Error loading dashboard:', error);
            }
        };
        loadDashboard();
    }


    // LOGOUT
    const logOut = document.getElementById('logOut');
    if (logOut)
    {
        logOut.addEventListener('submit', async (e) => {
            e.preventDefault();

        axios.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        })
    }

    // Register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const login = document.getElementById('login').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;;


            console.log("login is" + login);

//            console.log(doc) 
            try {
                const response = await axios.post('http://localhost:3001/api/auth/register', {
                    login,
                    email,
                    password,
                    role,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log(response);
                localStorage.setItem('token', response.data.token);
                // Перенаправляем на личный кабинет
                window.location.href = 'dashboard.html';
            
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed!');
            }
        });
    }

    // Логин
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await axios.post('http://localhost:3001/api/auth/login', {
                    email,
                    password
                });
                
                console.log(response);
                localStorage.setItem('token', response.data.token);
                // Перенаправляем на личный кабинет
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed!');
            }
        });
    }
});
