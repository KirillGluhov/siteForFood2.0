import { getWithToken } from '../Methods/Methods.js';
import { get } from '../Methods/Methods.js';
import { postWithToken } from '../Methods/Methods.js';
import { deleteWithToken } from '../Methods/Methods.js';

import { createNavbar } from '../Methods/Create.js';

import { getMainInformation } from '../Methods/GetInfo.js';

async function createDish(profile)
{
    const allPartOfURL = window.location['href'].split("/");
    const dish = await get(`https://food-delivery.kreosoft.ru/api/dish/${allPartOfURL[allPartOfURL.length-1]}`);
    let canUserRateDish;

    if (profile !== null)
    {
        canUserRateDish = await getWithToken(`https://food-delivery.kreosoft.ru/api/dish/${allPartOfURL[allPartOfURL.length-1]}/rating/check`, localStorage['token']);
    }
    else
    {
        canUserRateDish = false;
    }

    document.getElementById("name").textContent = `${dish['name'].toUpperCase()}`;
    document.getElementById("image").setAttribute('src', `${dish['image']}`);

    if (dish['vegetarian'])
    {
        const leaf = document.createElement("i");
        leaf.className = "fa-solid fa-leaf fa-2xl green";

        document.getElementById("leaf").appendChild(leaf);
        document.getElementById("vegetarian").textContent = "Вегетарианское";
    }
    else
    {
        document.getElementById("vegetarian").textContent = "Не вегетарианское";
    }

    document.getElementById("category").textContent = `Категория блюда - ${dish['category']}`;

    document.getElementById("starsToRate").className = `${(canUserRateDish === true) ? ("container d-flex py-1 justify-content-center") : ("d-none")}`;
    document.getElementById("rating").className = `${(canUserRateDish === true) ? ("card-text") : ("card-text d-none")}`;
    document.getElementById("description").textContent = `${dish['description']}`;
    document.getElementById("price").textContent = `${dish['price']}`;

    document.querySelectorAll(".rate").forEach((element, index) => {

        element.addEventListener("click", async() => {
            const choosenValueOfRate = 9 - index;

            const rateDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/dish/${allPartOfURL[allPartOfURL.length-1]}/rating?ratingScore=${choosenValueOfRate}`, localStorage['token']).then((data) => {

                if (data['status'] === 200)
                {
                    const parent = element.parentNode;
                    const childNodes = parent.childNodes;

                    let indexOfElement = -1;

                    for (let i = childNodes.length-1; i >= 0; i--)
                    {
                        if (childNodes[i] === element)
                        {
                            childNodes[i].className = "full fa-solid fa-star rate";
                            indexOfElement = i;
                        }
                        else if (i < indexOfElement && indexOfElement !== -1)
                        {
                            childNodes[i].className = "fa-solid fa-star rate";
                        }
                        else
                        {
                            childNodes[i].className = "full fa-solid fa-star rate";
                        }

                    }
                }
            });
        });
    });

    const stars = document.getElementById("stars");

    if (dish['rating'] === null)
    {
        for (let i = 0; i < 10; i++)
        {
            const star = document.createElement("i");
            star.className = "fa-solid fa-star";
            stars.appendChild(star);
        }
    }
    else
    {
        const numberOfStars = dish['rating'];
        
        for (let i = 0; i < 10; i++)
        {
            if (i < Math.floor(numberOfStars))
            {
                const star = document.createElement("i");
                star.className = "fa-solid fa-star full";
                stars.appendChild(star);
            }
            else if (i > Math.floor(numberOfStars))
            {
                const star = document.createElement("i");
                star.className = "fa-solid fa-star";
                stars.appendChild(star);
            }
            else if (((numberOfStars * 10) % 10) === 0)
            {
                const star = document.createElement("i");
                star.className = "fa-solid fa-star full";
                stars.appendChild(star);
            }
            else
            {
                const star = document.createElement("i");
                star.className = `fa fa-star part-${Math.round((numberOfStars * 10) % 10)*10}`;
                stars.appendChild(star);
            }
        }
    }

    const wrapperForButton = document.createElement("div");
    wrapperForButton.className = "row justify-content-end mb-3 mr-2";

    const buttonToOrder = document.createElement("button");

    if (profile !== null)
    {
        dishesInCart = await getWithToken(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);

        let numberOfDishOneType = 0;

        for (let j = 0; j < dishesInCart.length; j++)
        {
            if (dishesInCart[j]['id'] === dish['id'])
            {
                numberOfDishOneType = dishesInCart[j]['amount'];
            }
        }
        buttonToOrder.type = "button";
        buttonToOrder.className = "btn btn-primary z1";
        buttonToOrder.textContent = "В корзину";

        const groupToAddDishes = document.createElement("div");
        groupToAddDishes.className = "btn-group border rounded d-none z-1";
        groupToAddDishes.role = "group";
        groupToAddDishes.setAttribute('aria-label', "AddToCart");

        const minus = document.createElement("button");
        minus.type = "button";
        minus.className = "btn btn-light";
        minus.textContent = "-";

        const numberOfDishes = document.createElement("button");
        numberOfDishes.type = "button";
        numberOfDishes.className = "btn btn-light";
        numberOfDishes.textContent = `${numberOfDishOneType}`;

        const plus = document.createElement("button");
        plus.type = "button";
        plus.className = "btn btn-light";
        plus.textContent = "+";

        groupToAddDishes.appendChild(minus);
        groupToAddDishes.appendChild(numberOfDishes);
        groupToAddDishes.appendChild(plus);

        wrapperForButton.appendChild(buttonToOrder);
        wrapperForButton.appendChild(groupToAddDishes);

        if (numberOfDishOneType > 0)
        {
            buttonToOrder.className = "btn btn-primary z1 d-none";
            groupToAddDishes.className = "btn-group border rounded z-1";
        }
        else
        {
            buttonToOrder.className = "btn btn-primary z1";
            groupToAddDishes.className = "btn-group border rounded z-1 d-none";
        }

        buttonToOrder.addEventListener("click", async() => {

            buttonToOrder.className = "btn btn-primary z1 d-none";
            groupToAddDishes.className = "btn-group border rounded z-1";

            const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dish['id']}`, localStorage['token']).then(() => {

                if (parseInt(numberOfDishes.textContent) === 0)
                {
                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                }
                numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;
            });

            

        });

        plus.addEventListener("click", async() => {
            const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dish['id']}`, localStorage['token']).then(() => {

                if (parseInt(numberOfDishes.textContent) === 0)
                {
                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    
                }
                numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;
                document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
            });

        });

        minus.addEventListener("click", async() => {

            const deleteDish = await deleteWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dish['id']}?increase=true`, localStorage['token']).then(() => {

                numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) - 1}`;

                if (parseInt(numberOfDishes.textContent) <= 0)
                {
                    buttonToOrder.className = "btn btn-primary z1";
                    groupToAddDishes.className = "btn-group border rounded z-1 d-none";

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) - 1}`;
                    document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                }

                document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) - 1}`;

            });
        });
    }

    document.querySelector(".container.border.rounded").appendChild(wrapperForButton);

}

document.addEventListener("DOMContentLoaded", async() => {

    let profile;
    let token;

    let json = await getMainInformation(token, profile);

    profile = json["profile"];
    token = json["token"];

    createNavbar(profile);
    createDish(profile);
});