import { post } from '../Methods/Methods.js';

import { correct } from '../Methods/ChangeValidity.js';
import { incorrect } from '../Methods/ChangeValidity.js';
import { isCorrect } from '../Methods/ChangeValidity.js';

import { passwordCheck } from '../Methods/ChangeValidity.js';

document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("entry");

    button.addEventListener("click", async () => {

        const password = document.getElementById('Password');
        const email = document.getElementById('Email');

        let flag = true;

        flag = await passwordCheck(password);
        flag = await isCorrect(email, "^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+$", email.value.length);

        if (flag === true)
        {
            const data = {
                "email": email.value,
                "password": password.value,
            };

            post('https://food-delivery.kreosoft.ru/api/account/login', data).then((data) => {

                if ((data['message'] !== undefined || data['status'] !== 200) && data['token'] === undefined)
                {
                    incorrect(password, "Войти не удалось, возможно неверные данные");
                    incorrect(email, "Войти не удалось, возможно неверные данные");
                }
                else
                {
                    correct(password);
                    correct(email);

                    if (data['token'] !== undefined)
                    {
                        localStorage.setItem("token", `${data['token']}`);
                        localStorage.setItem("tokenExpiry", new Date().getTime() + 30 * 60 * 1000);
                        location.assign("http://localhost/");
                    }

                }

            })
            .catch((error) => {
                console.log(error);
            });
        }
    });
});