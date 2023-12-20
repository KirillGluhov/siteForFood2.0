import { getWithToken } from '../Methods/Methods.js';
import { get } from '../Methods/Methods.js';
import { post } from '../Methods/Methods.js';
import { postWithToken } from '../Methods/Methods.js';
import { deleteWithToken } from './Methods/Methods.js';

import { createNavbar } from '../Methods/Create.js';

function categoryOfDish(category)
{
    switch (category) {
        case 'Wok':
            return 'Вок';
        case 'Pizza':
            return 'Пицца';
        case 'Soup':
            return 'Суп';
        case 'Dessert':
            return 'Десерт';
        case 'Drink':
            return 'Напиток';
        default:
            return 'Без категории';
    }
}

async function createMainPart(profile=null)
{

    let dishesInCart;

    if (profile !== null)
    {
        dishesInCart = await getWithToken(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);
    }

    let dishes = await get(`https://food-delivery.kreosoft.ru/api/dish`);

    const rowWithCards = document.getElementById("mainPart");

    for (let i = 0; i < dishes['dishes'].length; i++)
    {
        let numberOfDishOneType = 0;

        if (profile !== null)
        {
            for (let j = 0; j < dishesInCart.length; j++)
            {
                if (dishesInCart[j]['id'] === dishes['dishes'][i]['id'])
                {
                    numberOfDishOneType = dishesInCart[j]['amount'];
                }
            }
        }

       const card = document.createElement("div");
       card.className = "card col-lg-3 col-sm-6 col-12 width18 p-3";
       card.id = dishes['dishes'][i]['id'];

       const cardWrapper = document.createElement("div");
       cardWrapper.className = "card h100";

       const cardUp = document.createElement("div");
       cardUp.className = "card border-0";
       cardUp.addEventListener("click", () => {

        window.location['href'] = `http://localhost/item/${dishes['dishes'][i]['id']}`;

       });

       const imageOfDish = document.createElement("img");
       imageOfDish.src = dishes['dishes'][i]['image'];
       imageOfDish.className = "card-img-top img-fluid";
       imageOfDish.alt = "...";

       const overlayForImage = document.createElement("div");
       overlayForImage.className = "card-img-overlay p-1 d-flex flex-column justify-content-end";

       const divForLeaf = document.createElement("div");
       divForLeaf.className = "d-inline ml-auto";

       if (dishes['dishes'][i]['vegetarian'] === true)
       {
            const leaf = document.createElement("i");
            leaf.className = "fa-solid fa-leaf fa-2xl green";

            divForLeaf.appendChild(leaf);
       }

       const cardMiddle = document.createElement("div");
       cardMiddle.className = "card-body";

       cardMiddle.addEventListener("click", () => {

        window.location['href'] = `http://localhost/item/${dishes['dishes'][i]['id']}`;

       });

       const name = document.createElement("h3");
       name.className = "card-title";
       name.textContent = dishes['dishes'][i]['name'].toUpperCase();

       const category = document.createElement("p");
       category.className = "card-text mb-0";
       category.textContent = `Категория блюда - ${categoryOfDish(dishes['dishes'][i]['category'])}`;

       const containerWithStars = document.createElement("div");
       containerWithStars.className = "container border rounded d-flex justify-content-center py-1";

       if (dishes['dishes'][i]['rating'] === null)
       {
            for (let i = 0; i < 10; i++)
            {
                const star = document.createElement("i");
                star.className = "fa-solid fa-star";
                containerWithStars.appendChild(star);
            }
       }
       else
       {
            const numberOfStars = dishes['dishes'][i]['rating'];
            
            for (let i = 0; i < 10; i++)
            {
                if (i < Math.floor(numberOfStars))
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star full";
                    containerWithStars.appendChild(star);
                }
                else if (i > Math.floor(numberOfStars))
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star";
                    containerWithStars.appendChild(star);
                }
                else if (((numberOfStars * 10) % 10) === 0)
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star full";
                    containerWithStars.appendChild(star);
                }
                else
                {
                    const star = document.createElement("i");
                    star.className = `fa fa-star part-${Math.round((numberOfStars * 10) % 10)*10}`;
                    containerWithStars.appendChild(star);
                }
            }
       }

       const description = document.createElement("p");
       description.className = "card-text";
       description.textContent = dishes['dishes'][i]['description'];

       const cardDown = document.createElement("div");
       cardDown.className = "card-footer text-muted d-flex justify-content-between align-items-center";
       cardDown.textContent = `Цена - ${dishes['dishes'][i]['price']}р`;

       if (profile !== null)
       {
            const cartButton = document.createElement("button");
            cartButton.type = "button";
            cartButton.className = "btn btn-primary z1";
            cartButton.textContent = "В корзину";
            
            cardDown.appendChild(cartButton);

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

            cardDown.appendChild(groupToAddDishes);

            if (numberOfDishOneType > 0)
            {
                cartButton.className = "btn btn-primary z1 d-none";
                groupToAddDishes.className = "btn-group border rounded z-1";
            }
            else
            {
                cartButton.className = "btn btn-primary z1";
                groupToAddDishes.className = "btn-group border rounded z-1 d-none";
            }

            cartButton.addEventListener("click", async() => {

                cartButton.className = "btn btn-primary z1 d-none";
                groupToAddDishes.className = "btn-group border rounded z-1";

                const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}`, localStorage['token']).then(() => {

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }
                });
            });

            plus.addEventListener("click", async() => {
                const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}`, localStorage['token']).then(() => {

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }
                });

            });

            minus.addEventListener("click", async() => {

                const deleteDish = await deleteWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}?increase=true`, localStorage['token']).then(() => {

                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) - 1}`;
                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) - 1}`;

                    if (parseInt(numberOfDishes.textContent) <= 0)
                    {
                        cartButton.className = "btn btn-primary z1";
                        groupToAddDishes.className = "btn-group border rounded z-1 d-none";
                    }

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }

                });
            });
       }

       overlayForImage.appendChild(divForLeaf);

       cardUp.appendChild(imageOfDish);
       cardUp.appendChild(overlayForImage);

       cardWrapper.appendChild(cardUp);

       cardMiddle.appendChild(name);
       cardMiddle.appendChild(category);
       cardMiddle.appendChild(containerWithStars);
       cardMiddle.appendChild(description);

       cardWrapper.appendChild(cardMiddle);

       cardWrapper.appendChild(cardDown);

       card.appendChild(cardWrapper);
       rowWithCards.appendChild(card);
    }

    console.log(dishesInCart, 200);
}

async function createMainPartWithPage(profile=null, page=1)
{
    let dishesInCart;
    if (profile !== null)
    {
        dishesInCart = await getWithToken(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);
    }

    let dishes = await get(`https://food-delivery.kreosoft.ru/api/dish?page=${page}`);
    const rowWithCards = document.getElementById("mainPart");

    for (let i = 0; i < dishes['dishes'].length; i++)
    {
        let numberOfDishOneType = 0;

        if (profile !== null)
        {
            for (let j = 0; j < dishesInCart.length; j++)
            {
                if (dishesInCart[j]['id'] === dishes['dishes'][i]['id'])
                {
                    numberOfDishOneType = dishesInCart[j]['amount'];
                }
            }
        }

       const card = document.createElement("div");
       card.className = "card col-lg-3 col-sm-6 col-12 width18 p-3";
       card.id = dishes['dishes'][i]['id'];

       const cardWrapper = document.createElement("div");
       cardWrapper.className = "card h100";

       const cardUp = document.createElement("div");
       cardUp.className = "card border-0";
       cardUp.addEventListener("click", () => {

        window.location['href'] = `http://localhost/item/${dishes['dishes'][i]['id']}`;

       });

       const imageOfDish = document.createElement("img");
       imageOfDish.src = dishes['dishes'][i]['image'];
       imageOfDish.className = "card-img-top img-fluid";
       imageOfDish.alt = "...";

       const overlayForImage = document.createElement("div");
       overlayForImage.className = "card-img-overlay p-1 d-flex flex-column justify-content-end";

       const divForLeaf = document.createElement("div");
       divForLeaf.className = "d-inline ml-auto";

       if (dishes['dishes'][i]['vegetarian'] === true)
       {
            const leaf = document.createElement("i");
            leaf.className = "fa-solid fa-leaf fa-2xl green";

            divForLeaf.appendChild(leaf);
       }

       const cardMiddle = document.createElement("div");
       cardMiddle.className = "card-body";
       cardMiddle.addEventListener("click", () => {

        window.location['href'] = `http://localhost/item/${dishes['dishes'][i]['id']}`;

       });

       const name = document.createElement("h3");
       name.className = "card-title";
       name.textContent = dishes['dishes'][i]['name'].toUpperCase();

       const category = document.createElement("p");
       category.className = "card-text mb-0";
       category.textContent = `Категория блюда - ${categoryOfDish(dishes['dishes'][i]['category'])}`;

       const containerWithStars = document.createElement("div");
       containerWithStars.className = "container border rounded d-flex justify-content-center py-1";

       if (dishes['dishes'][i]['rating'] === null)
       {
            for (let i = 0; i < 10; i++)
            {
                const star = document.createElement("i");
                star.className = "fa-solid fa-star";
                containerWithStars.appendChild(star);
            }
       }
       else
       {
            const numberOfStars = dishes['dishes'][i]['rating'];
            
            for (let i = 0; i < 10; i++)
            {
                if (i < Math.floor(numberOfStars))
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star full";
                    containerWithStars.appendChild(star);
                }
                else if (i > Math.floor(numberOfStars))
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star";
                    containerWithStars.appendChild(star);
                }
                else if (((numberOfStars * 10) % 10) === 0)
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star full";
                    containerWithStars.appendChild(star);
                }
                else
                {
                    const star = document.createElement("i");
                    star.className = `fa fa-star part-${Math.round((numberOfStars * 10) % 10)*10}`;
                    containerWithStars.appendChild(star);
                }
            }
       }

       const description = document.createElement("p");
       description.className = "card-text";
       description.textContent = dishes['dishes'][i]['description'];

       const cardDown = document.createElement("div");
       cardDown.className = "card-footer text-muted d-flex justify-content-between align-items-center";
       cardDown.textContent = `Цена - ${dishes['dishes'][i]['price']}р`;

       if (profile !== null)
       {
            const cartButton = document.createElement("button");
            cartButton.type = "button";
            cartButton.className = "btn btn-primary z1";
            cartButton.textContent = "В корзину";
            
            cardDown.appendChild(cartButton);

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

            cardDown.appendChild(groupToAddDishes);

            if (numberOfDishOneType > 0)
            {
                cartButton.className = "btn btn-primary z1 d-none";
                groupToAddDishes.className = "btn-group border rounded z-1";
            }
            else
            {
                cartButton.className = "btn btn-primary z1";
                groupToAddDishes.className = "btn-group border rounded z-1 d-none";
            }

            cartButton.addEventListener("click", async() => {

                cartButton.className = "btn btn-primary z1 d-none";
                groupToAddDishes.className = "btn-group border rounded z-1";

                const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}`, localStorage['token']).then(() => {

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }
                });
            });

            plus.addEventListener("click", async() => {
                const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}`, localStorage['token']).then(() => {

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }
                });

            });

            minus.addEventListener("click", async() => {

                const deleteDish = await deleteWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}?increase=true`, localStorage['token']).then(() => {

                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) - 1}`;
                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) - 1}`;

                    if (parseInt(numberOfDishes.textContent) <= 0)
                    {
                        cartButton.className = "btn btn-primary z1";
                        groupToAddDishes.className = "btn-group border rounded z-1 d-none";
                    }

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }

                });
            });
       }

       overlayForImage.appendChild(divForLeaf);

       cardUp.appendChild(imageOfDish);
       cardUp.appendChild(overlayForImage);

       cardWrapper.appendChild(cardUp);

       cardMiddle.appendChild(name);
       cardMiddle.appendChild(category);
       cardMiddle.appendChild(containerWithStars);
       cardMiddle.appendChild(description);

       cardWrapper.appendChild(cardMiddle);

       cardWrapper.appendChild(cardDown);

       card.appendChild(cardWrapper);
       rowWithCards.appendChild(card);
    }
}

async function createNavigation(numberOfPage=1)
{
    let maxPage = await get(`https://food-delivery.kreosoft.ru/api/dish`);
    let maxNumberOfPage = maxPage['pagination']["count"];

    const pagination = document.querySelector(".pagination");

    if (numberOfPage === 1 && maxNumberOfPage >= 2)
    {

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage}`;
        });

        const next = document.createElement("li");
        next.className = "page-item";
        const aNext = document.createElement("a");
        aNext.className = "page-link";
        aNext.textContent = numberOfPage+1
        next.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage+1}`;
        });

        const nextClone = document.createElement("li");
        nextClone.className = "page-item";
        const aNextClone = document.createElement("a");
        aNextClone.className = "page-link";
        aNextClone.textContent = "»";
        nextClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage+1}`;
        });

        current.appendChild(aCurrent);
        next.appendChild(aNext);
        nextClone.appendChild(aNextClone);

        pagination.appendChild(current);
        pagination.appendChild(next);
        pagination.appendChild(nextClone);
    }
    else if (numberOfPage === 1)
    {

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage}`;
        });

        current.appendChild(aCurrent);

        pagination.appendChild(current);
    }
    else if (numberOfPage === maxNumberOfPage)
    {

        const previousClone = document.createElement("li");
        previousClone.className = "page-item";
        const aPreviuosClone = document.createElement("a");
        aPreviuosClone.className = "page-link";
        aPreviuosClone.textContent = "«";
        previousClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage-1}`;
        });

        const previous = document.createElement("li");
        previous.className = "page-item";
        const aPreviuos = document.createElement("a");
        aPreviuos.className = "page-link";
        aPreviuos.textContent = numberOfPage-1;
        previous.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage-1}`;
        });

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage}`;
        });

        previousClone.appendChild(aPreviuosClone);
        previous.appendChild(aPreviuos);
        current.appendChild(aCurrent);

        pagination.appendChild(previousClone);
        pagination.appendChild(previous);
        pagination.appendChild(current);
    }
    else
    {

        const previousClone = document.createElement("li");
        previousClone.className = "page-item";
        const aPreviuosClone = document.createElement("a");
        aPreviuosClone.className = "page-link";
        aPreviuosClone.textContent = "«";
        previousClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage-1}`;
        });

        const previous = document.createElement("li");
        previous.className = "page-item";
        const aPreviuos = document.createElement("a");
        aPreviuos.className = "page-link";
        aPreviuos.textContent = numberOfPage-1;
        previous.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage-1}`;
        });

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage}`;
        });

        const next = document.createElement("li");
        next.className = "page-item";
        const aNext = document.createElement("a");
        aNext.className = "page-link";
        aNext.textContent = numberOfPage+1;
        next.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage+1}`;
        });

        const nextClone = document.createElement("li");
        nextClone.className = "page-item";
        const aNextClone = document.createElement("a");
        aNextClone.className = "page-link";
        aNextClone.textContent = "»";
        nextClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?page=${numberOfPage+1}`;
        });

        previousClone.appendChild(aPreviuosClone);
        previous.appendChild(aPreviuos);
        current.appendChild(aCurrent);
        next.appendChild(aNext);
        nextClone.appendChild(aNextClone);

        pagination.appendChild(previousClone);
        pagination.appendChild(previous);
        pagination.appendChild(current);
        pagination.appendChild(next);
        pagination.appendChild(nextClone);
    }
}

async function createNavigationForAttribute(numberOfPage=1, attribute)
{

    let maxPage = await get(`https://food-delivery.kreosoft.ru/api/dish?${attribute}`);
    let maxNumberOfPage = maxPage['pagination']["count"];

    const pagination = document.querySelector(".pagination");

    if (numberOfPage === 1 && maxNumberOfPage >= 2)
    {

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage}`;
        });

        const next = document.createElement("li");
        next.className = "page-item";
        const aNext = document.createElement("a");
        aNext.className = "page-link";
        aNext.textContent = numberOfPage+1
        next.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage+1}`;
        });

        const nextClone = document.createElement("li");
        nextClone.className = "page-item";
        const aNextClone = document.createElement("a");
        aNextClone.className = "page-link";
        aNextClone.textContent = "»";
        nextClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage+1}`;
        });

        current.appendChild(aCurrent);
        next.appendChild(aNext);
        nextClone.appendChild(aNextClone);

        pagination.appendChild(current);
        pagination.appendChild(next);
        pagination.appendChild(nextClone);
    }
    else if (numberOfPage === 1)
    {

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage}`;
        });

        current.appendChild(aCurrent);

        pagination.appendChild(current);
    }
    else if (numberOfPage === maxNumberOfPage)
    {

        const previousClone = document.createElement("li");
        previousClone.className = "page-item";
        const aPreviuosClone = document.createElement("a");
        aPreviuosClone.className = "page-link";
        aPreviuosClone.textContent = "«";
        previousClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage-1}`;
        });

        const previous = document.createElement("li");
        previous.className = "page-item";
        const aPreviuos = document.createElement("a");
        aPreviuos.className = "page-link";
        aPreviuos.textContent = numberOfPage-1;
        previous.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage-1}`;
        });

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage}`;
        });

        previousClone.appendChild(aPreviuosClone);
        previous.appendChild(aPreviuos);
        current.appendChild(aCurrent);

        pagination.appendChild(previousClone);
        pagination.appendChild(previous);
        pagination.appendChild(current);
    }
    else
    {

        const previousClone = document.createElement("li");
        previousClone.className = "page-item";
        const aPreviuosClone = document.createElement("a");
        aPreviuosClone.className = "page-link";
        aPreviuosClone.textContent = "«";
        previousClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage-1}`;
        });

        const previous = document.createElement("li");
        previous.className = "page-item";
        const aPreviuos = document.createElement("a");
        aPreviuos.className = "page-link";
        aPreviuos.textContent = numberOfPage-1;
        previous.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage-1}`;
        });

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage}`;
        });

        const next = document.createElement("li");
        next.className = "page-item";
        const aNext = document.createElement("a");
        aNext.className = "page-link";
        aNext.textContent = numberOfPage+1;
        next.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage+1}`;
        });

        const nextClone = document.createElement("li");
        nextClone.className = "page-item";
        const aNextClone = document.createElement("a");
        aNextClone.className = "page-link";
        aNextClone.textContent = "»";
        nextClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage+1}`;
        });

        previousClone.appendChild(aPreviuosClone);
        previous.appendChild(aPreviuos);
        current.appendChild(aCurrent);
        next.appendChild(aNext);
        nextClone.appendChild(aNextClone);

        pagination.appendChild(previousClone);
        pagination.appendChild(previous);
        pagination.appendChild(current);
        pagination.appendChild(next);
        pagination.appendChild(nextClone);
    }
}

function selectSortingType(type)
{
    switch (type) {
        case "NameAsc":
            return 0;
        case "NameDesc":
            return 1;
        case "PriceAsc":
            return 2;
        case "PriceDesc":
            return 3;
        case "RatingAsc":
            return 4;
        case "RatingDesc":
            return 5;
        default:
            return 10000;
    }
}


async function changeValuesOfInputs(attributes)
{
    for (let i = 0; i < attributes.length; i++)
    {
        if (attributes[i][0] === "c")
        {
            let valueOfTypeOfSorting = attributes[i].split("=");
            document.getElementById(valueOfTypeOfSorting[1]).selected = true;
            $('.selectpicker').selectpicker('refresh');
        }
        else if (attributes[i][0] === "s")
        {
            let valueOfTypeOfSorting = attributes[i].split("=");
            document.getElementById(`sorting`).selectedIndex = selectSortingType(valueOfTypeOfSorting[1]);
            $('.selectpicker').selectpicker('refresh');
        }
        else if (attributes[i][0] === "v")
        {
            let valueOfVegetable = attributes[i].split("=");
            document.getElementById("vegetarian").checked = (valueOfVegetable[1] === "false") ? (false) : true;
        }
    }
}

async function changeValuesOfInput(attribute)
{
    if (attribute[0] === "c")
    {
        let valueOfTypeOfSorting = attribute.split("=");
        document.getElementById(valueOfTypeOfSorting[1]).selected = true;
        $('.selectpicker').selectpicker('refresh');
    }
    else if (attribute[0] === "s")
    {
        let valueOfTypeOfSorting = attribute.split("=");

        document.getElementById(`sorting`).selectedIndex = selectSortingType(valueOfTypeOfSorting[1]);
        $('.selectpicker').selectpicker('refresh');
    }
    else if (attribute[0] === "v")
    {
        let valueOfVegetable = attribute.split("=");
        document.getElementById("vegetarian").checked = (valueOfVegetable[1] === "false") ? (false) : true;
    }
}


async function createMainPartWithAttribute(profile=null, page=1, attribute)
{
    if (attribute.split("&").length > 1)
    {
        changeValuesOfInputs(attribute.split("&"));
    }
    else
    {
        changeValuesOfInput(attribute);
    }

    let dishesInCart;
    if (profile !== null)
    {
        dishesInCart = await getWithToken(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);
    }

    let dishes = await get(`https://food-delivery.kreosoft.ru/api/dish?${attribute}`);
    const rowWithCards = document.getElementById("mainPart");

    for (let i = 0; i < dishes['dishes'].length; i++)
    {
        let numberOfDishOneType = 0;

        if (profile !== null)
        {
            for (let j = 0; j < dishesInCart.length; j++)
            {
                if (dishesInCart[j]['id'] === dishes['dishes'][i]['id'])
                {
                    numberOfDishOneType = dishesInCart[j]['amount'];
                }
            }
        }

       const card = document.createElement("div");
       card.className = "card col-lg-3 col-sm-6 col-12 width18 p-3";
       card.id = dishes['dishes'][i]['id'];

       const cardWrapper = document.createElement("div");
       cardWrapper.className = "card h100";

       const cardUp = document.createElement("div");
       cardUp.className = "card border-0";
       cardUp.addEventListener("click", () => {

        window.location['href'] = `http://localhost/item/${dishes['dishes'][i]['id']}`;

       });

       const imageOfDish = document.createElement("img");
       imageOfDish.src = dishes['dishes'][i]['image'];
       imageOfDish.className = "card-img-top img-fluid";
       imageOfDish.alt = "...";

       const overlayForImage = document.createElement("div");
       overlayForImage.className = "card-img-overlay p-1 d-flex flex-column justify-content-end";

       const divForLeaf = document.createElement("div");
       divForLeaf.className = "d-inline ml-auto";

       if (dishes['dishes'][i]['vegetarian'] === true)
       {
            const leaf = document.createElement("i");
            leaf.className = "fa-solid fa-leaf fa-2xl green";

            divForLeaf.appendChild(leaf);
       }

       const cardMiddle = document.createElement("div");
       cardMiddle.className = "card-body";
       cardMiddle.addEventListener("click", () => {

        window.location['href'] = `http://localhost/item/${dishes['dishes'][i]['id']}`;

       });

       const name = document.createElement("h3");
       name.className = "card-title";
       name.textContent = dishes['dishes'][i]['name'].toUpperCase();

       const category = document.createElement("p");
       category.className = "card-text mb-0";
       category.textContent = `Категория блюда - ${categoryOfDish(dishes['dishes'][i]['category'])}`;

       const containerWithStars = document.createElement("div");
       containerWithStars.className = "container border rounded d-flex justify-content-center py-1";

       if (dishes['dishes'][i]['rating'] === null)
       {
            for (let i = 0; i < 10; i++)
            {
                const star = document.createElement("i");
                star.className = "fa-solid fa-star";
                containerWithStars.appendChild(star);
            }
       }
       else
       {
            const numberOfStars = dishes['dishes'][i]['rating'];
            
            for (let i = 0; i < 10; i++)
            {
                if (i < Math.floor(numberOfStars))
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star full";
                    containerWithStars.appendChild(star);
                }
                else if (i > Math.floor(numberOfStars))
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star";
                    containerWithStars.appendChild(star);
                }
                else if (((numberOfStars * 10) % 10) === 0)
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star full";
                    containerWithStars.appendChild(star);
                }
                else
                {
                    const star = document.createElement("i");
                    star.className = `fa fa-star part-${Math.round((numberOfStars * 10) % 10)*10}`;
                    containerWithStars.appendChild(star);
                }
            }
       }

       const description = document.createElement("p");
       description.className = "card-text";
       description.textContent = dishes['dishes'][i]['description'];

       const cardDown = document.createElement("div");
       cardDown.className = "card-footer text-muted d-flex justify-content-between align-items-center";
       cardDown.textContent = `Цена - ${dishes['dishes'][i]['price']}р`;

       if (profile !== null)
       {
            const cartButton = document.createElement("button");
            cartButton.type = "button";
            cartButton.className = "btn btn-primary z1";
            cartButton.textContent = "В корзину";
            
            cardDown.appendChild(cartButton);

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

            cardDown.appendChild(groupToAddDishes);

            if (numberOfDishOneType > 0)
            {
                cartButton.className = "btn btn-primary z1 d-none";
                groupToAddDishes.className = "btn-group border rounded z-1";
            }
            else
            {
                cartButton.className = "btn btn-primary z1";
                groupToAddDishes.className = "btn-group border rounded z-1 d-none";
            }

            cartButton.addEventListener("click", async() => {

                cartButton.className = "btn btn-primary z1 d-none";
                groupToAddDishes.className = "btn-group border rounded z-1";

                const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}`, localStorage['token']).then(() => {

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }
                });
            });

            plus.addEventListener("click", async() => {
                const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}`, localStorage['token']).then(() => {

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }
                });

            });

            minus.addEventListener("click", async() => {

                const deleteDish = await deleteWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}?increase=true`, localStorage['token']).then(() => {

                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) - 1}`;
                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) - 1}`;

                    if (parseInt(numberOfDishes.textContent) <= 0)
                    {
                        cartButton.className = "btn btn-primary z1";
                        groupToAddDishes.className = "btn-group border rounded z-1 d-none";
                    }

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }

                });
            });
       }

       overlayForImage.appendChild(divForLeaf);

       cardUp.appendChild(imageOfDish);
       cardUp.appendChild(overlayForImage);

       cardWrapper.appendChild(cardUp);

       cardMiddle.appendChild(name);
       cardMiddle.appendChild(category);
       cardMiddle.appendChild(containerWithStars);
       cardMiddle.appendChild(description);

       cardWrapper.appendChild(cardMiddle);

       cardWrapper.appendChild(cardDown);

       card.appendChild(cardWrapper);
       rowWithCards.appendChild(card);
    }
}

async function createMainPartWithAttributeAndPage(profile=null, page=1, attribute)
{

    if (attribute.split("&").length > 1)
    {
        changeValuesOfInputs(attribute.split("&"));
    }
    else
    {
        changeValuesOfInput(attribute);
    }

    let dishesInCart;
    if (profile !== null)
    {
        dishesInCart = await getWithToken(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);
    }

    let dishes = await get(`https://food-delivery.kreosoft.ru/api/dish?${attribute}&page=${page}`);
    const rowWithCards = document.getElementById("mainPart");

    for (let i = 0; i < dishes['dishes'].length; i++)
    {
        let numberOfDishOneType = 0;

        if (profile !== null)
        {
            for (let j = 0; j < dishesInCart.length; j++)
            {
                if (dishesInCart[j]['id'] === dishes['dishes'][i]['id'])
                {
                    numberOfDishOneType = dishesInCart[j]['amount'];
                }
            }
        }
  
       const card = document.createElement("div");
       card.className = "card col-lg-3 col-sm-6 col-12 width18 p-3";
       card.id = dishes['dishes'][i]['id'];

       const cardWrapper = document.createElement("div");
       cardWrapper.className = "card h100";

       const cardUp = document.createElement("div");
       cardUp.className = "card border-0";
       cardUp.addEventListener("click", () => {

        window.location['href'] = `http://localhost/item/${dishes['dishes'][i]['id']}`;

       });

       const imageOfDish = document.createElement("img");
       imageOfDish.src = dishes['dishes'][i]['image'];
       imageOfDish.className = "card-img-top img-fluid";
       imageOfDish.alt = "...";

       const overlayForImage = document.createElement("div");
       overlayForImage.className = "card-img-overlay p-1 d-flex flex-column justify-content-end";

       const divForLeaf = document.createElement("div");
       divForLeaf.className = "d-inline ml-auto";

       if (dishes['dishes'][i]['vegetarian'] === true)
       {
            const leaf = document.createElement("i");
            leaf.className = "fa-solid fa-leaf fa-2xl green";

            divForLeaf.appendChild(leaf);
       }

       const cardMiddle = document.createElement("div");
       cardMiddle.className = "card-body";
       cardMiddle.addEventListener("click", () => {

        window.location['href'] = `http://localhost/item/${dishes['dishes'][i]['id']}`;

       });

       const name = document.createElement("h3");
       name.className = "card-title";
       name.textContent = dishes['dishes'][i]['name'].toUpperCase();

       const category = document.createElement("p");
       category.className = "card-text mb-0";
       category.textContent = `Категория блюда - ${categoryOfDish(dishes['dishes'][i]['category'])}`;

       const containerWithStars = document.createElement("div");
       containerWithStars.className = "container border rounded d-flex justify-content-center py-1";

       if (dishes['dishes'][i]['rating'] === null)
       {
            for (let i = 0; i < 10; i++)
            {
                const star = document.createElement("i");
                star.className = "fa-solid fa-star";
                containerWithStars.appendChild(star);
            }
       }
       else
       {
            const numberOfStars = dishes['dishes'][i]['rating'];
            
            for (let i = 0; i < 10; i++)
            {
                if (i < Math.floor(numberOfStars))
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star full";
                    containerWithStars.appendChild(star);
                }
                else if (i > Math.floor(numberOfStars))
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star";
                    containerWithStars.appendChild(star);
                }
                else if (((numberOfStars * 10) % 10) === 0)
                {
                    const star = document.createElement("i");
                    star.className = "fa-solid fa-star full";
                    containerWithStars.appendChild(star);
                }
                else
                {
                    const star = document.createElement("i");
                    star.className = `fa fa-star part-${Math.round((numberOfStars * 10) % 10)*10}`;
                    containerWithStars.appendChild(star);
                }
            }
       }

       const description = document.createElement("p");
       description.className = "card-text";
       description.textContent = dishes['dishes'][i]['description'];

       const cardDown = document.createElement("div");
       cardDown.className = "card-footer text-muted d-flex justify-content-between align-items-center";
       cardDown.textContent = `Цена - ${dishes['dishes'][i]['price']}р`;

       if (profile !== null)
       {
            const cartButton = document.createElement("button");
            cartButton.type = "button";
            cartButton.className = "btn btn-primary z1";
            cartButton.textContent = "В корзину";
            
            cardDown.appendChild(cartButton);

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

            cardDown.appendChild(groupToAddDishes);

            if (numberOfDishOneType > 0)
            {
                cartButton.className = "btn btn-primary z1 d-none";
                groupToAddDishes.className = "btn-group border rounded z-1";
            }
            else
            {
                cartButton.className = "btn btn-primary z1";
                groupToAddDishes.className = "btn-group border rounded z-1 d-none";
            }

            cartButton.addEventListener("click", async() => {

                cartButton.className = "btn btn-primary z1 d-none";
                groupToAddDishes.className = "btn-group border rounded z-1";

                const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}`, localStorage['token']).then(() => {

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }
                });

            });

            plus.addEventListener("click", async() => {
                const addDish = await postWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}`, localStorage['token']).then(() => {

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }
                });

            });

            minus.addEventListener("click", async() => {

                const deleteDish = await deleteWithToken(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishes['dishes'][i]['id']}?increase=true`, localStorage['token']).then(() => {

                    numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) - 1}`;
                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) - 1}`;

                    if (parseInt(numberOfDishes.textContent) <= 0)
                    {
                        cartButton.className = "btn btn-primary z1";
                        groupToAddDishes.className = "btn-group border rounded z-1 d-none";
                    }

                    if (parseInt(document.querySelector(".badge.badge-success").textContent) === 0)
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-none";
                    }
                    else
                    {
                        document.getElementById("numberOfDish").className = "badge badge-success ml-1 d-visible";
                    }

                });
            });

       }

       overlayForImage.appendChild(divForLeaf);

       cardUp.appendChild(imageOfDish);
       cardUp.appendChild(overlayForImage);

       cardWrapper.appendChild(cardUp);

       cardMiddle.appendChild(name);
       cardMiddle.appendChild(category);
       cardMiddle.appendChild(containerWithStars);
       cardMiddle.appendChild(description);

       cardWrapper.appendChild(cardMiddle);

       cardWrapper.appendChild(cardDown);

       card.appendChild(cardWrapper);
       rowWithCards.appendChild(card);
    }
}





async function createNavigationForAttributeAndPage(numberOfPage, attribute)
{

    let maxPage = await get(`https://food-delivery.kreosoft.ru/api/dish?${attribute}&page=${numberOfPage}`);
    let maxNumberOfPage = maxPage['pagination']["count"];

    const pagination = document.querySelector(".pagination");

    if (numberOfPage === 1 && maxNumberOfPage >= 2)
    {

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage}`;
        });

        const next = document.createElement("li");
        next.className = "page-item";
        const aNext = document.createElement("a");
        aNext.className = "page-link";
        aNext.textContent = numberOfPage+1
        next.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage+1}`;
        });

        const nextClone = document.createElement("li");
        nextClone.className = "page-item";
        const aNextClone = document.createElement("a");
        aNextClone.className = "page-link";
        aNextClone.textContent = "»";
        nextClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage+1}`;
        });

        current.appendChild(aCurrent);
        next.appendChild(aNext);
        nextClone.appendChild(aNextClone);

        pagination.appendChild(current);
        pagination.appendChild(next);
        pagination.appendChild(nextClone);
    }
    else if (numberOfPage === 1)
    {

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage}`;
        });

        current.appendChild(aCurrent);

        pagination.appendChild(current);
    }
    else if (numberOfPage === maxNumberOfPage)
    {

        const previousClone = document.createElement("li");
        previousClone.className = "page-item";
        const aPreviuosClone = document.createElement("a");
        aPreviuosClone.className = "page-link";
        aPreviuosClone.textContent = "«";
        previousClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage-1}`;
        });

        const previous = document.createElement("li");
        previous.className = "page-item";
        const aPreviuos = document.createElement("a");
        aPreviuos.className = "page-link";
        aPreviuos.textContent = numberOfPage-1;
        previous.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage-1}`;
        });

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage}`;
        });

        previousClone.appendChild(aPreviuosClone);
        previous.appendChild(aPreviuos);
        current.appendChild(aCurrent);

        pagination.appendChild(previousClone);
        pagination.appendChild(previous);
        pagination.appendChild(current);
    }
    else
    {

        const previousClone = document.createElement("li");
        previousClone.className = "page-item";
        const aPreviuosClone = document.createElement("a");
        aPreviuosClone.className = "page-link";
        aPreviuosClone.textContent = "«";
        previousClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage-1}`;
        });

        const previous = document.createElement("li");
        previous.className = "page-item";
        const aPreviuos = document.createElement("a");
        aPreviuos.className = "page-link";
        aPreviuos.textContent = numberOfPage-1;
        previous.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage-1}`;
        });

        const current = document.createElement("li");
        current.className = "page-item active";
        const aCurrent = document.createElement("a");
        aCurrent.className = "page-link";
        aCurrent.textContent = numberOfPage;
        current.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage}`;
        });

        const next = document.createElement("li");
        next.className = "page-item";
        const aNext = document.createElement("a");
        aNext.className = "page-link";
        aNext.textContent = numberOfPage+1;
        next.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage+1}`;
        });

        const nextClone = document.createElement("li");
        nextClone.className = "page-item";
        const aNextClone = document.createElement("a");
        aNextClone.className = "page-link";
        aNextClone.textContent = "»";
        nextClone.addEventListener("click", () => {

            window.location['href'] = "http://localhost/" + `?${attribute}&page=${numberOfPage+1}`;
        });

        previousClone.appendChild(aPreviuosClone);
        previous.appendChild(aPreviuos);
        current.appendChild(aCurrent);
        next.appendChild(aNext);
        nextClone.appendChild(aNextClone);

        pagination.appendChild(previousClone);
        pagination.appendChild(previous);
        pagination.appendChild(current);
        pagination.appendChild(next);
        pagination.appendChild(nextClone);
    }
}


function chooseType(type)
{
    switch (type) {
        case "Вок":
            return "Wok";
        case "Пицца":
            return "Pizza";
        case "Суп":
            return "Soup";
        case "Десерт":
            return "Dessert";
        case "Напиток":
            return "Drink";
        default:
            return "";
    }
}

function chooseSorting(sorting)
{
    switch (sorting) {
        case "А-Я":
            return "NameAsc";
        case "Я-А":
            return "NameDesc";
        case "↑ цены":
            return "PriceAsc";
        case "↓ цены":
            return "PriceDesc";
        case "↑ рейтинг":
            return "RatingAsc";
        case "↓ рейтинг":
            return "RatingDesc";
        default:
            return "";
    }
}

async function createStringForRequest(type, sorting, vegetarian, profile)
{
    let typeOfDish = [];

    for (let i = 0; i < type.length; i++)
    {
        if (type[i].selected)
        {
            typeOfDish.push(chooseType(type[i].value));
        }
    }
    const sortingOfDish = chooseSorting(sorting);

    let locationWithAttributes = "";

    for (let i = 0; i < typeOfDish.length; i++)
    {
        locationWithAttributes += `categories=${typeOfDish[i]}&`;
    }
    locationWithAttributes += `vegetarian=${vegetarian}&`;
    locationWithAttributes += `sorting=${sortingOfDish}&`;
    locationWithAttributes = locationWithAttributes.slice(0, -1);

    window.location['href'] = `http://localhost/?` + locationWithAttributes + '&page=1';
}


document.addEventListener("DOMContentLoaded", async() => {

    let profile;
    let token;
    let tokenExpiry = localStorage.getItem("tokenExpiry");

    if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) 
    {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
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

    const showButton = document.getElementById("show");

    const locationOfSite = window.location['href'].slice(16);

    showButton.addEventListener("click", async () => {

        const type = document.getElementById("typeOfFood");
        const sorting = document.getElementById("sorting");
        const vegetarian = document.getElementById("vegetarian");

        let stringForRequest = await createStringForRequest(type.options, sorting.value, vegetarian.checked, profile);
    });


    let partOfURL = window.location['href'].slice(16).split("&");

    if (partOfURL.length == 1)
    {
        if (partOfURL[0] === "/")
        {
            createMainPart(profile);
            createNavigation();
        }
        else if (partOfURL[0][2] === "p")
        {
            let numberAndName = partOfURL[0].split("=");
            let number = parseInt(numberAndName[1]);

            createMainPartWithPage(profile, number);
            createNavigation(number);
        }
        else if (partOfURL[0][2] !== "p")
        {
            let URLWithoutTrash = partOfURL[0].slice(2);
            createMainPartWithAttribute(profile, 1, URLWithoutTrash);
            createNavigationForAttribute(1, URLWithoutTrash);
        }
    }
    else
    {
        if (partOfURL[partOfURL.length-1][0] !== "p")
        {
            partOfURL[0] = partOfURL[0].slice(2);

            let slippedString = partOfURL[0];
            for (let i = 1; i < partOfURL.length; i++)
            {
                slippedString += "&" + partOfURL[i];
            }

            createMainPartWithAttribute(profile, 1, slippedString);
            createNavigationForAttribute(1, slippedString);
        }
        else
        {
            partOfURL[0] = partOfURL[0].slice(2);

            let slippedString = partOfURL[0];
            for (let i = 1; i < partOfURL.length-1; i++)
            {
                slippedString += "&" + partOfURL[i];
            }

            let numberAndName = partOfURL[partOfURL.length-1].split("=");
            let number = parseInt(numberAndName[1]);

            createMainPartWithAttributeAndPage(profile, number, slippedString);
            createNavigationForAttributeAndPage(number, slippedString);
        }
    }
});