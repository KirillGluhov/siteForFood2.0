import { getWithToken } from "../Methods/Methods.js";
import { postWithToken } from "../Methods/Methods.js";
import { get } from "../Methods/Methods.js";

export async function createNavbarForUnauthorized()
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
    aElementSecond.className = "nav-link";
    aElementSecond.href = "http://localhost/";
    aElementSecond.textContent = "Меню";

    liElementSecond.appendChild(aElementSecond);
    ulElementSecond.appendChild(liElementSecond);
}

export async function createNavbarForAuthorized(profile)
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
        let unauthorization = await postWithToken(`https://food-delivery.kreosoft.ru/api/account/logout`, token);
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

export async function createNavbar(profile=null)
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

export async function createFieldToInput(adresses)
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

export async function recursiveCreationOfFields(adresses, numberOfIndex = 0)
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

export async function createRecursiveNewPart(adresses, numberOfIndex = 0)
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

export async function createInfoFields(adresses, allPartsOfAddress)
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