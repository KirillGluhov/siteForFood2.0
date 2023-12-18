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

async function postWithHeaders(url, token)
{
    return fetch(url, {
        method: 'POST',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        }),
    });
}

async function deleteWithHeaders(url, token)
{
    return fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        }),
    });
}

/////////////////

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
    badge.id = "mainBadge";

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

async function createDish(profile)
{
    const allPartOfURL = window.location['href'].split("/");
    const dish = await get(`https://food-delivery.kreosoft.ru/api/dish/${allPartOfURL[allPartOfURL.length-1]}`);
    let isCanUserRateDish;

    if (profile !== null)
    {
        isCanUserRateDish = await getWithToken(`https://food-delivery.kreosoft.ru/api/dish/${allPartOfURL[allPartOfURL.length-1]}/rating/check`, localStorage['token']);
    }
    else
    {
        isCanUserRateDish = false;
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

    document.getElementById("starsToRate").className = `${(isCanUserRateDish === true) ? ("container d-flex py-1 justify-content-center") : ("d-none")}`;
    document.getElementById("rating").className = `${(isCanUserRateDish === true) ? ("card-text") : ("card-text d-none")}`;
    document.getElementById("description").textContent = `${dish['description']}`;
    document.getElementById("price").textContent = `${dish['price']}`;

    document.querySelectorAll(".rate").forEach((element, index) => {

        element.addEventListener("click", async() => {
            const choosenValueOfRate = 9 - index;

            const rateDish = await postWithHeaders(`https://food-delivery.kreosoft.ru/api/dish/${allPartOfURL[allPartOfURL.length-1]}/rating?ratingScore=${choosenValueOfRate}`, localStorage['token']).then((data) => {

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

            const addDish = await postWithHeaders(`https://food-delivery.kreosoft.ru/api/basket/dish/${dish['id']}`, localStorage['token']).then(() => {

                if (parseInt(numberOfDishes.textContent) === 0)
                {
                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    document.getElementById("mainBadge").className = "badge badge-success ml-1 d-visible";
                }
                numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;
            });

            

        });

        plus.addEventListener("click", async() => {
            const addDish = await postWithHeaders(`https://food-delivery.kreosoft.ru/api/basket/dish/${dish['id']}`, localStorage['token']).then(() => {

                if (parseInt(numberOfDishes.textContent) === 0)
                {
                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
                    document.getElementById("mainBadge").className = "badge badge-success ml-1 d-visible";
                    
                }
                numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) + 1}`;
                document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) + 1}`;
            });

        });

        minus.addEventListener("click", async() => {

            const deleteDish = await deleteWithHeaders(`https://food-delivery.kreosoft.ru/api/basket/dish/${dish['id']}?increase=true`, localStorage['token']).then(() => {

                numberOfDishes.textContent = `${parseInt(numberOfDishes.textContent) - 1}`;

                if (parseInt(numberOfDishes.textContent) <= 0)
                {
                    buttonToOrder.className = "btn btn-primary z1";
                    groupToAddDishes.className = "btn-group border rounded z-1 d-none";

                    document.querySelector(".badge.badge-success").textContent = `${parseInt(document.querySelector(".badge.badge-success").textContent) - 1}`;
                    document.getElementById("mainBadge").className = "badge badge-success ml-1 d-none";
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
    createDish(profile);
});