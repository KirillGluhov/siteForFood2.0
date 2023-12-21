import { getWithToken } from '../Methods/Methods.js';
import { postWithToken } from '../Methods/Methods.js';

import { createNavbar } from '../Methods/Create.js';

import { getMainInformation } from '../Methods/GetInfo.js';

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

    let json = await getMainInformation(token, profile);

    profile = json["profile"];
    token = json["token"];

    createNavbar(profile);
    createMain(profile);
});