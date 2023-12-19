import { getWithToken } from '../Methods/Methods.js';
import { post } from '../Methods/Methods.js';
import { postWithToken } from '../Methods/Methods.js';

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

async function createMain(profile)
{
    const dishesInCart = await getWithToken(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);
    const allOrders = await getWithToken(`https://food-delivery.kreosoft.ru/api/order`, localStorage['token']);


    if (dishesInCart.length > 0)
    {
        document.getElementById("order").className = "container border rounded d-visible";
        document.getElementById("empty").className = "d-none";
    }
    else
    {
        document.getElementById("order").className = "container border rounded d-none";
        document.getElementById("empty").className = "d-visible";
    }

    document.getElementById("checkout").addEventListener("click", () => {

        window.location['href'] = "http://localhost/purchase";
    });

    const listWithOrders = document.querySelector(".list-group");

    for (let i = 0; i < allOrders.length; i++)
    {
        const cardWithOrder = document.createElement("li");
        cardWithOrder.className = "list-group-item";
        cardWithOrder.id = allOrders[i]['id'];

        const wrapperForAllPartOfCard = document.createElement("div");
        wrapperForAllPartOfCard.className = "d-flex justify-content-between";

        const nameStatusAndDeliveryTimeInfo = document.createElement("div");
        nameStatusAndDeliveryTimeInfo.className = "d-flex";

        const nameStatusAndDeliveryTimeInfoInnerWrapper = document.createElement("div");
        nameStatusAndDeliveryTimeInfoInnerWrapper.className = "d-inline-flex flex-column";

        const timeOfOrder = document.createElement("p");
        timeOfOrder.className = "mb-0 clickableLink";
        let timeOrder = allOrders[i]['orderTime'].split("T");
        let partOfDate = timeOrder[0].split("-");
        timeOfOrder.innerHTML = `<u class="font-weight-bold">Заказ от ${partOfDate[2]}.${partOfDate[1]}.${partOfDate[0]}</u>`;

        const statusOfDelivery = document.createElement("p");
        statusOfDelivery.className = "mb-0";

        const deliver = document.createElement("p");
        deliver.className = "mb-0";

        const costAndMaybeConfirmDelivery = document.createElement("div");
        costAndMaybeConfirmDelivery.className = "d-flex";

        const costAndMaybeConfirmDeliveryInnerWrapper = document.createElement("div");

        const costOfDelivery = document.createElement("p");
        costOfDelivery.innerHTML = `<span class="font-weight-bold">Стоимость заказа</span>: ${allOrders[i]['price']} руб.`;
        costOfDelivery.className = "mb-0";

        if (allOrders[i]['status'] === 'InProcess')
        {
            statusOfDelivery.textContent = `Статус заказа - В обработке`;
            costAndMaybeConfirmDeliveryInnerWrapper.className = "d-inline-flex flex-column justify-content-between";

            let timeDeliver = allOrders[i]['deliveryTime'].split("T");
            let partOfDate = timeDeliver[0].split("-");

            var dateCurrent = new Date();
            var dateDelivery = new Date(allOrders[i]['deliveryTime']);
            const currentTime = dateCurrent.toISOString().split("T");

            const buttonToConfirm = document.createElement('button');
            buttonToConfirm.type = "button";
            buttonToConfirm.className = "btn btn-outline-success";
            buttonToConfirm.textContent = "Подтвердить доставку";
            buttonToConfirm.addEventListener("click", async() => {

                const result = await postWithToken(`https://food-delivery.kreosoft.ru/api/order/${allOrders[i]['id']}/status`, localStorage['token']).then((data) => {

                    if (data['status'] === 200)
                    {
                        statusOfDelivery.textContent = `Статус заказа - Доставлен`;

                        deliver.textContent = `Доставлен: ${partOfDate[2]}.${partOfDate[1]}.${partOfDate[0]} ${timeDeliver[1].slice(0, 5)}`;

                        buttonToConfirm.className = "btn btn-outline-success d-none";

                        costAndMaybeConfirmDeliveryInnerWrapper.className = "d-inline-flex flex-column justify-content-end";
                    }
                });

                
            });

            costAndMaybeConfirmDeliveryInnerWrapper.appendChild(buttonToConfirm);

            if (currentTime[0] === timeDeliver[0])
            {
                deliver.textContent = `Доставка ожидается в ${timeDeliver.slice(0, 5)}`;
            }
            else if (dateCurrent > dateDelivery)
            {
                deliver.textContent = `Доставлен: ${partOfDate[2]}.${partOfDate[1]}.${partOfDate[0]} ${timeDeliver[1].slice(0, 5)}`;
            }
            else if (dateCurrent < dateDelivery)
            {
                deliver.textContent = `Будет доставлен: ${partOfDate[2]}.${partOfDate[1]}.${partOfDate[0]} ${timeDeliver[1].slice(0, 5)}`;
            }
        }
        else
        {
            statusOfDelivery.textContent = `Статус заказа - Доставлен`;
            costAndMaybeConfirmDeliveryInnerWrapper.className = "d-inline-flex flex-column justify-content-end";

            let timeDeliver = allOrders[i]['deliveryTime'].split("T");
            let partOfDate = timeDeliver[0].split("-");
            deliver.textContent = `Доставлен: ${partOfDate[2]}.${partOfDate[1]}.${partOfDate[0]} ${timeDeliver[1].slice(0, 5)}`;
        }

        nameStatusAndDeliveryTimeInfoInnerWrapper.appendChild(timeOfOrder);
        nameStatusAndDeliveryTimeInfoInnerWrapper.appendChild(statusOfDelivery);
        nameStatusAndDeliveryTimeInfoInnerWrapper.appendChild(deliver);

        nameStatusAndDeliveryTimeInfo.appendChild(nameStatusAndDeliveryTimeInfoInnerWrapper);

        costAndMaybeConfirmDeliveryInnerWrapper.appendChild(costOfDelivery);

        costAndMaybeConfirmDelivery.appendChild(costAndMaybeConfirmDeliveryInnerWrapper);

        wrapperForAllPartOfCard.appendChild(nameStatusAndDeliveryTimeInfo);
        wrapperForAllPartOfCard.appendChild(costAndMaybeConfirmDelivery);

        cardWithOrder.appendChild(wrapperForAllPartOfCard);

        listWithOrders.appendChild(cardWithOrder);

        timeOfOrder.addEventListener("click", () => {

            window.location['href'] = `http://localhost/order/${allOrders[i]['id']}`;
        })
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

    createNavbar(profile);
    createMain(profile);
});