import { get } from '../Methods/Methods.js';
import { post } from '../Methods/Methods.js';

import { correct } from '../Methods/ChangeValidity.js';
import { incorrect } from '../Methods/ChangeValidity.js';
import { isCorrect } from '../Methods/ChangeValidity.js';
import { passwordCheck } from '../Methods/ChangeValidity.js';

import { createFieldToInput } from '../Methods/Create.js';

async function notNullCheck(option)
{
    if (option.value === null || option.value === "")  
    {
        incorrect(option, "Это поле не должно быть пустым");
        return false;
    } 
    else 
    {
        correct(option);
        return true;
    }
}

async function adresCheck(guid)
{
    if (guid === undefined)
    {
        incorrectAdress(document.getElementById("address"), "Некорректный адрес");
        return false;
    }
    else
    {
        correctAdress(document.getElementById("address"));
        return true;
    }
}

async function correctAdress(option)
{
    document.getElementById("adressAll").style = "";
    option.className = "container border rounded mb-1";
    option.setAttribute('data-toggle', '');
    option.setAttribute('data-placement', '');
    option.setAttribute('title', '');
}

async function incorrectAdress(option, message)
{
    document.getElementById("adressAll").style = "color: red";
    option.className = "container border rounded mb-1 is-invalid";
    option.setAttribute('data-toggle', 'tootip');
    option.setAttribute('data-placement', 'right');
    option.setAttribute('title', message);
}

async function isCorrectBirthday(birthday)
{
    if (birthday.value !== "")
    {
        const dateOfBirthday = new Date(birthday.value);
        if (dateOfBirthday > new Date(1900, 0, 1) && dateOfBirthday < new Date(9999, 11, 31))
        {
            correct(birthday);
            return true;
        }
        else
        {
            incorrect(birthday, "Дата рождения не может выходить за диапазон от 1900 до 9999");
            return false;
        }
    }
    else
    {
        return true;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const adress = await get("https://food-delivery.kreosoft.ru/api/address/search");
    let guidOfBuilding;
    IMask(
        document.getElementById('Phone'),
        {
          mask: '+{7} (000) 000-00-00'
        }
      )

    const buttonToRegister = document.getElementById('register');

    buttonToRegister.addEventListener("click", async () => {

        const fullName = document.getElementById("FullName");
        const gender = document.getElementById("Gender");
        const telephone = document.getElementById("Phone");
        const birthday = document.getElementById("BirthDate");
        const email = document.getElementById("Email");
        const password = document.getElementById("Password");

        let flag = true;

        flag = await notNullCheck(fullName);
        flag = await notNullCheck(gender);
        flag = await passwordCheck(password);
        flag = await adresCheck(guidOfBuilding);

        flag = await isCorrect(telephone, "^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$");
        flag = await isCorrect(email, "^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+$", email.value.length);
        flag = await isCorrectBirthday(birthday);

        if (flag === true)
        {
            
            let registerRequest = {
                "fullName": fullName.value,
                "password": password.value,
                "email": email.value,
                "addressId": guidOfBuilding,
                "birthDate": birthday.value || null,
                "gender": `${(gender.value == "мужской") ? ("Male") : ("Female")}`,
                "phoneNumber": telephone.value.trim() || null,
            }

            post('https://food-delivery.kreosoft.ru/api/account/register', registerRequest).then((data) => {

                if (data['errors'] !== undefined)
                {
                    if (data['errors']['BirthDate'] !== undefined)
                    {
                        incorrect(birthday, "Год рождения должен входить в диапазон от 1900 до 9999 года");
                    }
                    else
                    {
                        correct(birthday);
                    }
                }
                else
                {
                    correct(birthday);
                }

                if (data['token'] !== undefined)
                {
                    localStorage.setItem("token", `${data['token']}`);
                    localStorage.setItem("tokenExpiry", new Date().getTime() + 30 * 60 * 1000);
                    location.assign("http://localhost/");
                }

            })
            .catch((error) => {

                console.log(error);

            });
        }
    });

    guidOfBuilding = await createFieldToInput(adress);

});