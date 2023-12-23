import { getWithToken } from '../Methods/Methods.js';
import { get } from '../Methods/Methods.js';
import { postWithTokenAndData } from '../Methods/Methods.js';

import { createNavbar } from '../Methods/Create.js';
import { createFieldToInput } from '../Methods/Create.js';
import { createInfoFields } from '../Methods/Create.js';

import { getMainInformation } from '../Methods/GetInfo.js';

async function createMainPart(profile)
{
    document.getElementById("telephone").value = profile['phoneNumber'];
    document.getElementById("email").value = profile['email'];

    const adress = await get("https://food-delivery.kreosoft.ru/api/address/search");
    const dishesInCart = await getWithToken(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);
    let guidOfBuilding;

    const listWithDishes = document.querySelector(".list-group");

    let priceOfAllDishes = 0;

    for (let i = 0; i < dishesInCart.length; i++)
    {
        const dishCard = document.createElement("li");
        dishCard.className = "list-group-item";
        dishCard.id = dishesInCart[i]['id'];

        const rowElement = document.createElement("div");
        rowElement.className = "d-sm-flex d-block align-items-end justify-content-between flex-sm-row flex-colomn";

        const leftPart = document.createElement("div");
        leftPart.className = "d-flex";

        const image = document.createElement("img");
        image.src = dishesInCart[i]['image'];
        image.className = "card-img-top img-fluid mr-3";
        image.alt = "...";
        image.style = "height: 80px; width: 120px; background-size: cover; background-position: center center; border-radius: 15% / 50%;";

        const nameAndPriceWithNumber = document.createElement("div");
        nameAndPriceWithNumber.className = "d-inline-flex flex-column ml-3 mr-3 justify-content-between";

        const nameOfDishInCard = document.createElement("h5");
        nameOfDishInCard.className = "m-0";
        nameOfDishInCard.style = "color: black;";
        nameOfDishInCard.textContent = dishesInCart[i]['name'];

        const priceOfDish = document.createElement("p");
        priceOfDish.className = "m-0";
        priceOfDish.textContent = `Цена: ${dishesInCart[i]['price']} руб.`

        const numberOfDishesInCard = document.createElement("p");
        numberOfDishesInCard.className = "m-0";
        numberOfDishesInCard.textContent = `Количество: ${dishesInCart[i]['amount']} шт.`;

        const rightPart = document.createElement("div");
        rightPart.className = "flex-column flex-row-sm-reverse d-flex";

        const totalPrice = document.createElement("p");
        totalPrice.className = "m-0";
        totalPrice.innerHTML = `<b>Стоимость:</b> ${dishesInCart[i]['totalPrice']} руб.`;

        nameAndPriceWithNumber.appendChild(nameOfDishInCard);
        nameAndPriceWithNumber.appendChild(priceOfDish);
        nameAndPriceWithNumber.appendChild(numberOfDishesInCard);

        rightPart.appendChild(totalPrice);

        leftPart.appendChild(image);
        leftPart.appendChild(nameAndPriceWithNumber);

        rowElement.appendChild(leftPart);
        rowElement.appendChild(rightPart);

        dishCard.appendChild(rowElement);

        listWithDishes.appendChild(dishCard);

        priceOfAllDishes += dishesInCart[i]['totalPrice'];
    }

    document.getElementById("price").innerHTML = `<b>Стоимость заказа:</b> ${priceOfAllDishes} руб.`;

    document.getElementById("confirm").addEventListener("click", () => {

        const childNodesForAdress = document.getElementById("adressBlock").childNodes;

        if (guidOfBuilding === profile['address'] && childNodesForAdress[childNodesForAdress.length-1].childNodes[0].getAttribute("for") == "unknown")
        {
            const adresInfo = document.getElementById("adressBlock");

            adresInfo.style = "color: red";
            adresInfo.className = "container border rounded mb-1 is-invalid";
            adresInfo.setAttribute('data-toggle', 'tootip');
            adresInfo.setAttribute('data-placement', 'right');
            adresInfo.setAttribute('title', "Вы не ввели адрес до конца");
        }
        else
        {
            const adresInfo = document.getElementById("adressBlock");

            adresInfo.style = "";
            adresInfo.className = "container border rounded mb-1";
            adresInfo.setAttribute('data-toggle', '');
            adresInfo.setAttribute('data-placement', '');
            adresInfo.setAttribute('title', '');
        }

        const orderInfo = {
            "deliveryTime": document.getElementById("date").value,
            "addressId" : guidOfBuilding || null
        }

        postWithTokenAndData(`https://food-delivery.kreosoft.ru/api/order`, orderInfo, localStorage['token']).then((data) => {
            
        if (data['status'] == 200)
        {
            const dateTime = document.getElementById("date");
            dateTime.className = "form-control";
            dateTime.setAttribute('data-toggle', '');
            dateTime.setAttribute('data-placement', '');
            dateTime.setAttribute('title', '');
            
            window.location['href'] = 'http://localhost/orders';
        }
        else
        {
            const dateTime = document.getElementById("date");
            dateTime.className = "form-control is-invalid";
            dateTime.setAttribute('data-toggle', 'tootip');
            dateTime.setAttribute('data-placement', 'right');
            dateTime.setAttribute('title', 'Некорректная дата');
        }

        });
    });

    if (profile["address"] !== null)
    {
        let allPartsOfAddress;
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

    let json = await getMainInformation(token, profile);

    profile = json["profile"];
    token = json["token"];

    console.log(profile);

    createNavbar(profile);
    createMainPart(profile);
});