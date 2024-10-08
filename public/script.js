document.addEventListener('DOMContentLoaded', () => {

    const newChatRequest = document.getElementById('newchatrequest');
    if(newChatRequest)
    {
        const token = getToken();
            if (!token) window.location.href = 'login.html'; // Перенаправляем на страницу логина, если нет токена
        
        window.addEventListener('load', async (e) => {
            e.preventDefault();

            try
            {
                const allUsers = await getUsersByRole(token);
                const tableBody = document.querySelector('#users-table tbody');

  // Проходим по каждому пользователю и добавляем строку в таблицу
    
                for (const [key,value] of Object.entries(allUsers))
                {
                    const row = 
                        `<tr>
                          <td>${key}</td>
                          <td>${value}</td> 
                          <button type='submit' class='login-button' value='${key}'> Request </button>
                          <br>                        
                        </tr>`;
                    tableBody.innerHTML += row;
                 }
            }
            catch(err){
                console.log('error: '+err.message);
            }
        });

        const newRequest = document.getElementById('chatRequest');
        if(newRequest)
        {

            window.addEventListener('load', async (e) => {
                const loginButtons = document.querySelectorAll('.login-button');
                console.log('asdfasd');

                // console.log(loginButtons[])


                loginButtons.forEach(button => {
                    button.addEventListener('click', async(e) => {
                        e.preventDefault();

                        const user1 = await axios.post('http://localhost:3001/api/auth/getUserData',{
                            token
                        });

                        const login = document.getElementById('login').value;
                        console.log(login);
                        const user2 = await axios.post('http://localhost:3001/api/auth/getUserDataByLogin', {
                            login
                        });

                        // console.log(user2.data._id);

                        sendChatRequest(user1.data.id, user2.data._id); // 1st input is FROM , 2nd is TO
                    });
                });                
            });
            // console.log(document.body.innerHTML);

            // chatRequest.addEventListener('submit', async (e) => {
            // });
        }
    }



    // get Chat Requests 
//     const chatRequests = document.getElementById('chatRequests');
//     if(chatRequests)
//     {
//         window.addEventListener('load', async (e) => {
//             const token = getToken();
//             try
//             {
//                 const UserInfo = await axios.post('http://localhost:3001/api/auth/getUserData',{
//                     token
//                 });

//                 console.log(UserInfo.data.id);

//                 to = UserInfo.data.id; 
//                 console.log(to);

// // console.log(to);
//                 const chatRequests = await axios.post('http://localhost:3001/api/chatRequest/getAllChatRequestsByUserId',{
//                     to
//                 });

//                 console.log(chatRequests.data);

//             }
//             catch(e){

//                 console.log(e);
//             }
//         });
//     }
            

    async function getUsersByRole(token)
    {
        const response = await axios.post('http://localhost:3001/api/auth/getUsersByRole',{
            token
        });

        let allUsers = {};
        for (const [key,value] of Object.entries(response.data))
        {
            if(value.login != undefined)
            {
                allUsers[value.login] = value.email;
            }
        }
        return allUsers;
    }

    async function sendChatRequest(fromUserId, toUserId) // sending chat request
    {
        try
        {
            const response = await axios.post('http://localhost:3001/api/chatrequest/chat-request', {
              from: fromUserId,
              to: toUserId
            });
            console.log('??');
            alert(response.data.msg);
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }

    async function respondChatRequest(requestId, status) { // sending respond
    try
    {
        const response = await axios.post('/api/respond-chat-request', {
          requestId,
          status
        });
        alert(response.data.msg);
    } catch (error) {
        console.error('Ошибка при ответе на запрос:', error.response.data.msg);
        }
    }


    async function sendMessage(fromUserId, toUserId, content) {
    try {
        const response = await axios.post('/api/send-message', {
          from: fromUserId,
          to: toUserId,
          content: content
        });
        console.log('Сообщение отправлено:', response.data.message);
      } catch (error) {
        console.error('Ошибка при отправке сообщения:', error.response.data.msg);
      }
    }   


    function getToken() // sending token to backend
    {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;

        return token;
    };


    // LOADING DASHBOARD
    const dashboard = document.getElementById('dashboard');
    if(dashboard)
    {
        const token = getToken();
        if (!token) {
            window.location.href = 'login.html'; // Перенаправляем на страницу логина, если нет токена
        }

        async function loadDashboard()
        {
            try
            {
                const response1 = await axios.get('http://localhost:3001/api/dashboard');

                console.log(response1);
                const requestsResponse = await axios.get('http://localhost:3001/api/request/');

                // const data = await response.json();

                const tableBody = document.querySelector('#data-table tbody');

  // Проходим по каждому пользователю и добавляем строку в таблицу
                requestsResponse.data.forEach(user => {
                const row = 
                        `<tr>
                          <td>${user.name}</td>
                          <td>${user.salary}</td>
                          <td>${user.emiratesID}</td>
                        </tr>`;
                tableBody.innerHTML += row;
                });



                document.getElementById('dashboard').innerHTML = `<p>${response1.data.message}</p>`;
            }
            catch (error)
            {
                if(error.status === 401) window.location.href = 'login.html';
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
    console.log(loginForm);
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


    const addRequest = document.getElementById('addrequest');

    if(addRequest)
    {
        const token = getToken();
        if (!token) {
            window.location.href = 'login.html'; // Перенаправляем на страницу логина, если нет токена
        }


        addRequest.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('hello bro');

            const name = document.getElementById('name').value;
            const salary = document.getElementById('salary').value;
            const emiratesID = document.getElementById('emiratesID').value;
            const birthdate = document.getElementById('birthdate').value;


            try {
                const response = await axios.post('http://localhost:3001/api/request/newrequest', {
                    name,
                    salary,
                    emiratesID,
                    birthdate,
                });
                
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Cant create new request', error);
                alert('Create request failed!');
            }
        });
    }
});
