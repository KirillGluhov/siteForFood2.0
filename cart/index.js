import { postWithToken } from '../Methods/Methods.js';
import { deleteWithToken } from '../Methods/Methods.js';

import { createNavbar } from '../Methods/Create.js';
import { getMainInformation } from '../Methods/GetInfo.js';

async function createMainPart(profile, dishesInCart)
{
    if (dishesInCart.length === 0)
    {
        document.getElementById('empty').className = "d-visible";
    }
    else
    {
        document.getElementById('empty').className = "d-none";
    }

    for (let i = 0; i < dishesInCart.length; i++)
    {
        const item = document.createElement("li");
        item.className = "list-group-item";
        item.id = `${dishesInCart[i]['id']}`;

        const wrapper = document.createElement("div");
        wrapper.className = "d-flex align-items-md-start justify-content-md-between align-items-end flex-md-row flex-column";

        const wrapperForMostPart = document.createElement("div");
        wrapperForMostPart.className = "d-flex flex-row";

        const orderOfElement = document.createElement("div");
        orderOfElement.className = "d-inline-flex flex-column align-items-start mr-3";
        orderOfElement.textContent = `${i+1}.`;

        const image = document.createElement("img");
        image.src = dishesInCart[i]['image'];
        image.className = "card-img-top img-fluid mr-3";
        image.style = "height: 100px; width: 150px ;background-size: cover;background-position: center; border-radius: 15% 15% / 50% 50% 50% 50%;"
        image.alt = "...";

        const nameAndPrice = document.createElement("div");
        nameAndPrice.className = "d-inline-flex flex-column ml-3 mr-3 justify-content-between";

        const nameOfDish = document.createElement("h5");
        nameOfDish.style = "color: black;";
        nameOfDish.textContent = `${dishesInCart[i]['name']}`;
        nameOfDish.className = "m-0";

        const price = document.createElement("p");
        price.textContent = `Цена/шт: ${dishesInCart[i]['price']} руб.`;
        price.className = "m-0";

        const totalPrice = document.createElement("p");
        totalPrice.textContent = `Стоимость: ${dishesInCart[i]['totalPrice']} руб.`;
        totalPrice.className = "m-0";

        const wrapperForButtonGroup = document.createElement("div");
        wrapperForButtonGroup.className = "d-inline-flex align-items-start";

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "btn-group border rounded";
        buttonGroup.role = "group";
        buttonGroup.setAttribute('aria-label', "chooseNumber");

        const minus = document.createElement("button");
        minus.className = "btn btn-light";
        minus.type = "button";
        minus.textContent = "-";

        const numberOfDishes = document.createElement("button");
        numberOfDishes.className = "btn btn-light";
        numberOfDishes.type = "button";
        numberOfDishes.textContent = `${dishesInCart[i]['amount']}`;

        const plus = document.createElement("button");
        plus.className = "btn btn-light";
        plus.type = "button";
        plus.textContent = "+";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.id = "delete";
        deleteButton.className = "btn btn-danger";
        deleteButton.textContent = "Удалить";

        nameAndPrice.appendChild(nameOfDish);
        nameAndPrice.appendChild(price);
        nameAndPrice.appendChild(totalPrice);

        buttonGroup.appendChild(minus);
        buttonGroup.appendChild(numberOfDishes);
        buttonGroup.appendChild(plus);

        wrapperForButtonGroup.appendChild(buttonGroup);

        wrapperForMostPart.appendChild(orderOfElement);
        wrapperForMostPart.appendChild(image);
        wrapperForMostPart.appendChild(nameAndPrice);
        wrapperForMostPart.appendChild(wrapperForButtonGroup);

        wrapper.appendChild(wrapperForMostPart);
        wrapper.appendChild(deleteButton);

        item.appendChild(wrapper);
        document.querySelector(".list-group").appendChild(item);

        plus.addEventListener("click", async() => {
            const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishesInCart[i]['id']}`, localStorage['token']).then(() => {

            document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
            numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;

            if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
            {
                document.getElementById('empty').className = "d-visible";
                document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
            }
            else
            {
                document.getElementById('empty').className = "d-none";
                document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
            }

            });

        });

        minus.addEventListener("click", async() => {

            const deleteDish = await deleteWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishesInCart[i]['id']}?increase=true`, localStorage['token']).then(() => {

                numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) - 1}`;
                document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) - 1}`;

                if (parseInt(numberOfDishes.textContent) <= 0)
                {
                    item.remove();

                    const elements = document.querySelector(".list-group");

                    for (let j = 1; j < elements.childNodes.length; j++)
                    {
                        elements.childNodes[j].childNodes[0].childNodes[0].childNodes[0].textContent = `${j}.`;
                    }
                }

                if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                {
                    document.getElementById('empty').className = "d-visible";
                    document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                }
                else
                {
                    document.getElementById('empty').className = "d-none";
                    document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                }

            });
        });

        deleteButton.addEventListener("click", async() => {

            const deleteDish = await deleteWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishesInCart[i]['id']}`, localStorage['token']).then(() => {
                document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) - parseInt(numberOfDishes.textContent)}`; //
                item.remove();

                const elements = document.querySelector(".list-group");

                for (let j = 1; j < elements.childNodes.length; j++)
                {
                    elements.childNodes[j].childNodes[0].childNodes[0].childNodes[0].textContent = `${j}.`;
                }

                if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                {
                    document.getElementById('empty').className = "d-visible";
                    document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                }
                else
                {
                    document.getElementById('empty').className = "d-none";
                    document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                }
            });
        })
    }
}

document.addEventListener("DOMContentLoaded", async() => {

    let profile;
    let token;

    let dishesInCart = 1;

    let json = await getMainInformation(token, profile, dishesInCart);

    profile = json["profile"];
    token = json["token"];
    dishesInCart = json["dishesInCart"];

    createNavbar(profile, dishesInCart);
    createMainPart(profile, dishesInCart);
});