async function getRequest(site) 
{
  try 
  {
    const response = await fetch(site);
    const data = await response.json();
    return data;
  } 
  catch (error) 
  {
    console.error(error);
    throw error;
  }
}

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

async function recursiveCreationOfFields(adresses, numberOfIndex = 0)
{
    const partOfAdress = await getRequest(`https://food-delivery.kreosoft.ru/api/address/search?parentObjectId=${adresses[numberOfIndex]['objectId']}`);
    const adressPartInForm = document.querySelector(".container.border.rounded");
    const adressPart = document.createElement("div");
    adressPart.className = "form-group";

    const namePartOfAdress = document.createElement("label");
    namePartOfAdress.setAttribute('for', `unknown`);
    namePartOfAdress.textContent = `Следующий элемент адреса`;

    const choose = document.createElement("select");
    choose.className = "form-control";
    choose.id = `unknown`;

    for (let i = 0; i < partOfAdress.length; i++)
    {
        const option = document.createElement("option");
        option.textContent = partOfAdress[i]['text'];
        choose.appendChild(option);
    }

    adressPart.appendChild(namePartOfAdress);
    adressPart.appendChild(choose);

    adressPartInForm.appendChild(adressPart);

    return new Promise((resolve, reject) => {choose.addEventListener("change", async function() {
        const selectedOption = choose.options[choose.selectedIndex];
        let indexOfElement;

        for (let i = 0; i < partOfAdress.length; i++)
        {
            if (partOfAdress[i]['text'] == selectedOption.value)
            {
                namePartOfAdress.setAttribute('for', `${partOfAdress[i]['objectLevel']}`);
                namePartOfAdress.textContent = `${partOfAdress[i]['objectLevelText']}`;
                choose.id = `${partOfAdress[i]['objectId']}`;
                adressPart.id = `#${partOfAdress[i]['objectId']}`;
                indexOfElement = i;
            }
        }

        let indexOfMiddle = -1;

        for (let i = 0; i < adressPartInForm.childNodes.length; i++)
        {
            if (adressPartInForm.childNodes[i].id == adressPart.id)
            {
                indexOfMiddle = i;
            }

            if (indexOfMiddle != -1 && indexOfMiddle+1 < adressPartInForm.childNodes.length)
            {
                adressPartInForm.removeChild(adressPartInForm.childNodes[indexOfMiddle+1]);
            }
        }

        if (partOfAdress[indexOfElement]['objectLevel'] != "Building")
        {
            const result = await recursiveCreationOfFields(partOfAdress, indexOfElement);
            resolve(result);
        }
        else
        {
            resolve(partOfAdress[indexOfElement]['objectGuid']);
        }

    });});
}

async function createFieldToInput(adresses)
{
    const adressPartInForm = document.querySelector(".container.border.rounded");
    const adressPart = document.createElement("div");
    adressPart.className = "form-group";

    const namePartOfAdress = document.createElement("label");
    namePartOfAdress.setAttribute('for', `${adresses[0]['objectLevel']}`);
    namePartOfAdress.textContent = `${adresses[0]['objectLevelText']}`;

    const choose = document.createElement("select");
    choose.className = "form-control";
    choose.id = `${adresses[0]['objectLevel']}`;

    for (let i = 0; i < adresses.length; i++)
    {
        const option = document.createElement("option");
        option.textContent = adresses[i]['text'];
        choose.appendChild(option);
    }

    adressPart.appendChild(namePartOfAdress);
    adressPart.appendChild(choose);

    adressPartInForm.appendChild(adressPart);

    choose.addEventListener("change", function() {
        const selectedOption = choose.options[choose.selectedIndex];
    });

    return recursiveCreationOfFields(adresses, 0)

}

document.addEventListener("DOMContentLoaded", async () => {
    const adress = await getRequest("https://food-delivery.kreosoft.ru/api/address/search");
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
                    localStorage.setItem("email", email.value);
                    localStorage.setItem("password", password.value);
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