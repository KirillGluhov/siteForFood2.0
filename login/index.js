async function post(url, data)
{
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    }).then(response => response.json());
}

/////////

async function correct(option)
{
    option.className = "form-control";
    option.setAttribute('data-toggle', '');
    option.setAttribute('data-placement', '');
    option.setAttribute('title', '');
}

async function incorrect(option, message)
{
    option.className = "form-control is-invalid";
    option.setAttribute('data-toggle', 'tootip');
    option.setAttribute('data-placement', 'right');
    option.setAttribute('title', message);
}

function isHavingNumber(option)
{
    for (let i = 0; i < option.value.length; i++)
    {
        if (!isNaN(option.value[i]))
        {
            return true;
        }
    }

    return false;
}

async function passwordCheck(option)
{
    if (option.value === null || option.value === "")  
    {
        incorrect(option, "Это поле не должно быть пустым");
        return false;
    } 
    else if (option.value.length < 6)
    {
        incorrect(option, "Пароль должен состоять хотя бы из 6 символов");
        return false;
    }
    else if (!isHavingNumber(option))
    {
        incorrect(option, "В пароле должна быть хотя бы одна цифра");
        return false;
    }
    else 
    {
        correct(option);
        return true;
    }

}

async function isCorrect(option, regularExpression, length = 10)
{
    let regex = new RegExp(regularExpression)
    let stringWithoutSpaces = option.value.trim();

    if (stringWithoutSpaces.length > 0)
    {
        if (stringWithoutSpaces.match(regularExpression) !== null)
        {
            correct(option);
            return true;
        }
        else
        {
            incorrect(option, "Некорректное значение");
            return false;
        }

    }
    else if (length < 1)
    {
        incorrect(option, "Некорректное значение");
        return false;
    }
    else
    {
        correct(option);
        return true;
    }
}

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
                        localStorage.setItem("email", email.value);
                        localStorage.setItem("password", password.value);
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