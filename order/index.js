import { getWithToken } from '../Methods/Methods.js';
import { post } from '../Methods/Methods.js';
import { postWithToken } from '../Methods/Methods.js';

import { createNavbar } from '../Methods/Create.js';

async function createMain(profile=null)
{
    const partOfAdress = window.location['href'].split("/");

    const orderInfo = await getWithToken(`https://food-delivery.kreosoft.ru/api/order/${partOfAdress[partOfAdress.length-1]}`, localStorage['token']);
    const adressInfo = await getWithToken(`https://food-delivery.kreosoft.ru/api/address/chain?objectGuid=${orderInfo['address']}`, localStorage['token']);

    const orderOfOrders = await getWithToken(`https://food-delivery.kreosoft.ru/api/order`, localStorage['token']);

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

            const result = await postWithToken(`https://food-delivery.kreosoft.ru/api/order/${orderInfo['id']}/status`, localStorage['token']).then((data) => {

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