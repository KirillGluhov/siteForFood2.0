async function getWithHeaders(url, token)
{
    return fetch(url, {
        method: 'GET',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        }),
    }).then(response => response.json());
}

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

async function postInfo(url, token)
{
    return fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }),
    });
}

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
    let dishesInCart = await getWithHeaders(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);

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

async function createMain(profile=null)
{
    const partOfAdress = window.location['href'].split("/");

    const orderInfo = await getWithHeaders(`https://food-delivery.kreosoft.ru/api/order/${partOfAdress[partOfAdress.length-1]}`, localStorage['token']);
    const adressInfo = await getWithHeaders(`https://food-delivery.kreosoft.ru/api/address/chain?objectGuid=${orderInfo['address']}`, localStorage['token']);

    const orderOfOrders = await getWithHeaders(`https://food-delivery.kreosoft.ru/api/order`, localStorage['token']);

    let indexOfElement;

    for (let i = 0; i < orderOfOrders.length; i++)
    {
        if (orderOfOrders[i]['id'] === orderInfo['id'])
        {
            indexOfElement = i;
        }
    }

    let adressString = "";

    for (let i = 0; i < adressInfo.length; i++)
    {
        adressString += `${adressInfo[i]['text']}, `;
    }

    adressString = adressString.slice(0, adressString.length-2);

    const infoAboutDish = document.querySelector(".card.border.rounded");

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";

    const wrapperForCardTitleAndConfirmButton = document.createElement("div");
    wrapperForCardTitleAndConfirmButton.className = "row m-0 justify-content-between align-items-center";

    const deliveryWithNumber = document.createElement("p");
    deliveryWithNumber.className = "card-title mb-0";
    deliveryWithNumber.style = "font-size: 1.25rem";
    deliveryWithNumber.textContent = `Заказ #${orderOfOrders.length - indexOfElement}`;

    const statusOfOrder = document.createElement("p");
    statusOfOrder.className = "mb-0";

    if (orderInfo['status'] === "InProcess")
    {
        const confirmButton = document.createElement("button");
        confirmButton.type = "button";
        confirmButton.className = "btn btn-outline-success";
        confirmButton.id = "confirm";
        confirmButton.textContent = `Подтвердить доставку`;
        confirmButton.addEventListener("click", async() => {

            const result = await postInfo(`https://food-delivery.kreosoft.ru/api/order/${orderInfo['id']}/status`, localStorage['token']).then((data) => {

                    if (data['status'] === 200)
                    {
                        confirmButton.className = "btn btn-outline-success d-none";
                        statusOfOrder.textContent = `Статус заказа - Доставлен`;
                    }
                });
        });

        statusOfOrder.textContent = `Статус заказа - В обработке`;

        wrapperForCardTitleAndConfirmButton.appendChild(deliveryWithNumber);
        wrapperForCardTitleAndConfirmButton.appendChild(confirmButton);
    }
    else
    {
        wrapperForCardTitleAndConfirmButton.appendChild(deliveryWithNumber);

        statusOfOrder.textContent = `Статус заказа - Доставлен`;
    }


    

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    let timeOrder = orderInfo['orderTime'].split("T");
    let partOfOrderDate = timeOrder[0].split("-");

    let timeDeliver = orderInfo['deliveryTime'].split("T");
    let partOfDeliverDate = timeDeliver[0].split("-");

    const orderTime = document.createElement("p");
    orderTime.className = "mb-0";
    orderTime.textContent = `Дата заказа: ${partOfOrderDate[2]}.${partOfOrderDate[1]}.${partOfOrderDate[0]} ${timeOrder[1].slice(0, 5)}`;

    const deliveryTime = document.createElement("p");
    deliveryTime.className = "mb-0";
    deliveryTime.textContent = `Дата доставки: ${partOfDeliverDate[2]}.${partOfDeliverDate[1]}.${partOfDeliverDate[0]} ${timeDeliver[1].slice(0, 5)}`;

    const adress = document.createElement("p");
    adress.className = "mb-0";
    adress.textContent = `Адрес доставки: ${adressString}`;

    const listOfDishesName = document.createElement("p");
    listOfDishesName.className = "m-0 mt-3";
    listOfDishesName.textContent = `Список блюд:`;

    const listOfDishes = document.createElement("ul");
    listOfDishes.className = "list-group mb-3";

    let priceOfAllDishes = 0;

    for (let i = 0; i < orderInfo['dishes'].length; i++)
    {
        const dishCard = document.createElement("li");
        dishCard.className = "list-group-item";
        dishCard.id = orderInfo['dishes'][i]['id'];

        const rowElement = document.createElement("div");
        rowElement.className = "d-flex align-items-end justify-content-between";

        const leftPart = document.createElement("div");
        leftPart.className = "d-flex";

        const image = document.createElement("img");
        image.src = orderInfo['dishes'][i]['image'];
        image.className = "card-img-top img-fluid mr-3";
        image.alt = "...";
        image.style = "height: 80px; width: 120px; background-size: cover; background-position: center center; border-radius: 15% / 50%;";

        const nameAndPriceWithNumber = document.createElement("div");
        nameAndPriceWithNumber.className = "d-inline-flex flex-column ml-3 mr-3 justify-content-between";

        const nameOfDishInCard = document.createElement("h5");
        nameOfDishInCard.className = "m-0";
        nameOfDishInCard.style = "color: black;";
        nameOfDishInCard.textContent = orderInfo['dishes'][i]['name'];

        const priceOfDish = document.createElement("p");
        priceOfDish.className = "m-0";
        priceOfDish.textContent = `Цена: ${orderInfo['dishes'][i]['price']} руб.`

        const numberOfDishesInCard = document.createElement("p");
        numberOfDishesInCard.className = "m-0";
        numberOfDishesInCard.textContent = `Количество: ${orderInfo['dishes'][i]['amount']} шт.`;

        const rightPart = document.createElement("div");
        rightPart.className = "flex-column flex-row-reverse d-flex";

        const totalPrice = document.createElement("p");
        totalPrice.className = "m-0";
        totalPrice.innerHTML = `<b>Стоимость:</b> ${orderInfo['dishes'][i]['totalPrice']} руб.`;

        nameAndPriceWithNumber.appendChild(nameOfDishInCard);
        nameAndPriceWithNumber.appendChild(priceOfDish);
        nameAndPriceWithNumber.appendChild(numberOfDishesInCard);

        rightPart.appendChild(totalPrice);

        leftPart.appendChild(image);
        leftPart.appendChild(nameAndPriceWithNumber);

        rowElement.appendChild(leftPart);
        rowElement.appendChild(rightPart);

        dishCard.appendChild(rowElement);

        listOfDishes.appendChild(dishCard);

        priceOfAllDishes += orderInfo['dishes'][i]['totalPrice'];
    }

    const purchase = document.createElement("p");
    purchase.className = "m-0";
    purchase.id = "price";
    purchase.innerHTML = `<b>Стоимость заказа:</b> ${priceOfAllDishes} руб.`;

    cardHeader.appendChild(wrapperForCardTitleAndConfirmButton);

    infoAboutDish.appendChild(cardHeader);

    cardBody.appendChild(orderTime);
    cardBody.appendChild(deliveryTime);
    cardBody.appendChild(adress);
    cardBody.appendChild(statusOfOrder);
    cardBody.appendChild(listOfDishesName);
    cardBody.appendChild(listOfDishes);
    cardBody.appendChild(purchase);

    infoAboutDish.appendChild(cardBody);
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
                profile = await getWithHeaders(`https://food-delivery.kreosoft.ru/api/account/profile`, token);
                
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
            profile  = await getWithHeaders(`https://food-delivery.kreosoft.ru/api/account/profile`, token);
        }
    }

    createNavbar(profile);
    createMain(profile);
});