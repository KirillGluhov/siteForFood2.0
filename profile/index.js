import { getWithToken } from '../Methods/Methods.js';

async function post(url, data=null)
{
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    }).then(response => response.json());
}

async function postWithHeaders(url, token)
{
    return fetch(url, {
        method: 'POST',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        }),
    });
}

async function get(site) 
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

async function put(url, data, token)
{
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }),
    });
}

/////////////////////

async function createNavbarForUnauthorized()
{
    const ulElement = document.querySelector(".navbar-nav.mr-0");

    const liElement = document.createElement("li");
    liElement.className = "nav-item active";

    const buttonEnter = document.createElement("button");
    buttonEnter.className = "btn btn-light"
    buttonEnter.type = "button";
    buttonEnter.onclick = "";
    buttonEnter.id = "enter";
    buttonEnter.textContent = "Войти";
    buttonEnter.addEventListener("click", async() => {

        location.assign("http://localhost/login/");
    });

    liElement.appendChild(buttonEnter);
    ulElement.appendChild(liElement);

    const ulElementSecond = document.querySelector(".navbar-nav.mr-auto");

    const liElementSecond = document.createElement("li");
    liElementSecond.className = "nav-item active";

    const aElementSecond = document.createElement("a");
    aElementSecond.className = "nav-link bebra";
    aElementSecond.href = "http://localhost/";
    aElementSecond.textContent = "Меню";

    liElementSecond.appendChild(aElementSecond);
    ulElementSecond.appendChild(liElementSecond);
    
}

async function createNavbarForAuthorized(profile)
{
    let dishesInCart = await getWithToken(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);

    const ulElement = document.querySelector(".navbar-nav.mr-auto");

    const liOrders = document.createElement("li");
    liOrders.className = "nav-item active";
    const aOrders = document.createElement("a");
    aOrders.className = "nav-link";
    aOrders.href = "http://localhost/orders/";
    aOrders.textContent = "Заказы";

    const liCart = document.createElement("li");
    liCart.className = "nav-item active";

    const aCart = document.createElement("a");
    aCart.className = "nav-link";
    aCart.href = "http://localhost/cart/";
    aCart.textContent = "Корзина";

    const badge = document.createElement("span");
    badge.id = "numberOfDish";
    badge.className = "badge badge-success ml-1 d-visible";

    let numberOfDishesInCart = 0;
    for (let i = 0; i < dishesInCart.length; i++)
    {
        numberOfDishesInCart += dishesInCart[i]['amount'];
    }
    badge.textContent = numberOfDishesInCart;

    if (numberOfDishesInCart === 0)
    {
        badge.className = "badge badge-success ml-1 d-none";
    }
    else
    {
        badge.className = "badge badge-success ml-1 d-visible";
    }

    const liMenu = document.createElement("li");
    liMenu.className = "nav-item active";
    const aMenu = document.createElement("a");
    aMenu.className = "nav-link aboba";
    aMenu.href = "http://localhost/";
    aMenu.textContent = "Меню";

    aCart.appendChild(badge);

    liMenu.appendChild(aMenu);
    liOrders.appendChild(aOrders);
    liCart.appendChild(aCart);

    ulElement.appendChild(liMenu);
    ulElement.appendChild(liOrders);
    ulElement.appendChild(liCart);

    const ulElementSecond = document.querySelector(".navbar-nav.mr-0");

    const liMail = document.createElement("li");
    liMail.className = "nav-item active";
    const aMail = document.createElement("a");
    aMail.className = "nav-link";
    aMail.href = "http://localhost/profile/";
    aMail.textContent = `${profile['email']}`;

    const liExit = document.createElement("li");
    liExit.className = "nav-item active";
    const buttonExit = document.createElement("button");
    buttonExit.className = "btn btn-light"
    buttonExit.type = "button";
    buttonExit.onclick = "";
    buttonExit.id = "exit";
    buttonExit.textContent = "Выйти";
    buttonExit.addEventListener("click", async() => {

        let token = localStorage.getItem("token");
        let unauthorization = await postWithHeaders(`https://food-delivery.kreosoft.ru/api/account/logout`, token);
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("password");
        localStorage.removeItem("email");
        location.assign("http://localhost/login/");
    });

    liMail.appendChild(aMail);
    liExit.appendChild(buttonExit);

    
    ulElementSecond.appendChild(liMail);
    ulElementSecond.appendChild(liExit);
}

async function createNavbar(profile=null)
{
    if (profile === null)
    {
        createNavbarForUnauthorized();
    }
    else
    {
        createNavbarForAuthorized(profile);
    }
}

async function recursiveCreationOfFields(adresses, numberOfIndex = 0)
{
    const partOfAdress = await get(`https://food-delivery.kreosoft.ru/api/address/search?parentObjectId=${adresses[numberOfIndex]['objectId']}`);
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


async function createRecursiveNewPart(adresses, numberOfIndex = 0)
{

    const partOfAdress = await get(`https://food-delivery.kreosoft.ru/api/address/search?parentObjectId=${adresses}`);
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
                choose.id = `${partOfAdress[i]['objectGuid']}`;
                adressPart.id = `#${partOfAdress[i]['objectGuid']}`;
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




async function createInfoFields(adresses, allPartsOfAddress)
{

    const adressPartInForm = document.querySelector(".container.border.rounded");

    return new Promise(async(resolve, reject) => {
        for (let i = 0; i < allPartsOfAddress.length; i++)
        {
            if (i > 0)
            {
                adresses = await get(`https://food-delivery.kreosoft.ru/api/address/search?parentObjectId=${allPartsOfAddress[i-1]['objectId']}`);
            }

            const adressPart = document.createElement("div");
            adressPart.className = "form-group";

            const namePartOfAdress = document.createElement("label");
            namePartOfAdress.setAttribute('for', `${allPartsOfAddress[i]['objectLevel']}`);
            namePartOfAdress.textContent = `${allPartsOfAddress[i]['objectLevelText']}`;

            const choose = document.createElement("select");
            choose.className = "form-control";
            choose.id = `${allPartsOfAddress[i]['objectLevel']}`;

            for (let j = 0; j < adresses.length; j++)
            {
                const option = document.createElement("option");
                option.textContent = adresses[j]['text'];
                option.id = adresses[j]['objectId'];
                option.setAttribute('guid', adresses[j]['objectGuid']);
                if (adresses[j]['text'] === allPartsOfAddress[i]['text'])
                {
                    option.selected = "selected";
                }
                choose.appendChild(option);
            }

            choose.addEventListener("change", async(event) => {

                const selectedOption = event.target.options[event.target.selectedIndex];
                
                let adres = await get(`https://food-delivery.kreosoft.ru/api/address/getaddresschain?objectGuid=${selectedOption.getAttribute('guid')}`);

                for (let j = adressPartInForm.childNodes.length-1; j > i+3; j--)
                {
                    adressPartInForm.removeChild(adressPartInForm.childNodes[j]);
                }
                
                adressPartInForm.childNodes[i+3].childNodes[0].setAttribute("for", `${adres[adres.length-1]['objectLevel']}`);
                adressPartInForm.childNodes[i+3].childNodes[1].id = `${adres[adres.length-1]['objectLevel']}`;
                adressPartInForm.childNodes[i+3].childNodes[0].textContent = `${adres[adres.length-1]['objectLevelText']}`;



                if (adressPartInForm.childNodes[i+3].childNodes[1].id === "Building")
                {
                    resolve(selectedOption.getAttribute('guid'));
                }
                else
                {
                    resolve(createRecursiveNewPart(selectedOption.id, i+3));
                }

            });

            adressPart.appendChild(namePartOfAdress);
            adressPart.appendChild(choose);

            adressPartInForm.appendChild(adressPart);
        }
    });

}

async function createMainPart(profile)
{
    const fullname = document.getElementById("inputFullname");
    fullname.value = profile["fullName"];
    const gender = document.getElementById("staticGender");
    gender.value = ((profile["gender"] === "Male") ? ("мужской") : ("женский"));
    const email = document.getElementById("staticEmail");
    email.value = profile["email"];
    const birthday = document.getElementById("birthDate");

    if (profile["birthDate"] !== null)
    {
        birthday.value = profile["birthDate"].slice(0, 10);
    }

    const phone = document.getElementById("phone");

    if (profile["phoneNumber"] !== null)
    {

        IMask(
            document.getElementById('phone'),
            {
              mask: '+{7} (000) 000-00-00'
            }
          )

          phone.value = profile["phoneNumber"];
    }
    else
    {
        IMask(
            document.getElementById('phone'),
            {
              mask: '+{7} (000) 000-00-00'
            }
          )
    }

    const adress = await get("https://food-delivery.kreosoft.ru/api/address/search");
    let guidOfBuilding;

    document.getElementById("save").addEventListener("click", () => {

        const infoAboutUser = {
            "fullName": fullname.value,
            "birthDate": birthday.value || null,
            "gender": `${(gender.value === "мужской") ? ("Male") : ("Female")}`,
            "addressId": guidOfBuilding || null,
            "phoneNumber": phone.value || null,
        }
    
        put("https://food-delivery.kreosoft.ru/api/account/profile", infoAboutUser, localStorage['token']).then((data) => {

            if (data['status'] = 200)
            {
                localStorage['isDisplay'] = true;
                localStorage['isCorrect'] = true;
                window.location['href'] = 'http://localhost/profile/';
            }
            else
            {
                localStorage['isDisplay'] = true;
                localStorage['isCorrect'] = false;
                window.location['href'] = 'http://localhost/profile/';
            }
        });


    });

    if (profile["address"] !== null)
    {
        guidOfBuilding = profile["address"];
        allPartsOfAddress = await get(`https://food-delivery.kreosoft.ru/api/address/getaddresschain?objectGuid=${profile["address"]}`);
        guidOfBuilding = await createInfoFields(adress, allPartsOfAddress);
    }
    else
    {
        guidOfBuilding = await createFieldToInput(adress);
    }
}

document.addEventListener("DOMContentLoaded", async() => {

    let profile;
    let token;
    let tokenExpiry = localStorage.getItem("tokenExpiry");

    if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) 
    {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");

        const data = {
            "email": localStorage.getItem("email"),
            "password": localStorage.getItem("password"),
        }

        await post('https://food-delivery.kreosoft.ru/api/account/login', data).then(async(data) => {
            if (data['token'] !== undefined)
            {
                token = data['token'];
                tokenExpiry = new Date().getTime() + 30 * 60 * 1000;
                localStorage.setItem("token", token);
                localStorage.setItem("tokenExpiry", tokenExpiry);
                profile = await getWithToken(`https://food-delivery.kreosoft.ru/api/account/profile`, token);
                
            }
            else
            {
                profile = null;
            }
        });
    }
    else
    {
        token = localStorage.getItem("token");

        if (token === null)
        {
            profile = null;
        }
        else
        {
            profile  = await getWithToken(`https://food-delivery.kreosoft.ru/api/account/profile`, token);
        }
    }

    if (localStorage['isDisplay'] === "true")
    {
        if (localStorage['isCorrect'] === "true")
        {
            document.querySelector(".alert.alert-primary").className = "alert alert-primary visible";
            document.querySelector(".alert.alert-primary").innerHTML = "Изменения сохранены <button type='button' class='close' aria-label='Закрыть'><span aria-hidden='true'>&times;</span></button>";
        }
        else
        {
            document.querySelector(".alert.alert-primary").className = "alert alert-primary visible";
            document.querySelector(".alert.alert-primary").innerHTML = "Изменения не сохранены  <button type='button' class='close' aria-label='Закрыть'><span aria-hidden='true'>&times;</span></button>";
        }
    }
    else
    {
        document.querySelector(".alert.alert-primary").className = "alert alert-primary d-none";
    }

    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".alert.alert-primary").className = "alert alert-primary d-none";
        localStorage['isDisplay'] = false;
    });


    createNavbar(profile);
    createMainPart(profile);

});