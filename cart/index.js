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

async function createNavbar(profile=null, dishesInCart=null)
{
    if (profile === null)
    {
        createNavbarForUnauthorized();
    }
    else
    {
        createNavbarForAuthorized(profile, dishesInCart);
    }
}

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
            const addDish = await postWithHeaders(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishesInCart[i]['id']}`, localStorage['token']).then(() => {

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

            const deleteDish = await deleteWithHeaders(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishesInCart[i]['id']}?increase=true`, localStorage['token']).then(() => {

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

            const deleteDish = await deleteWithHeaders(`https://food-delivery.kreosoft.ru/api/basket/dish/${dishesInCart[i]['id']}`, localStorage['token']).then(() => {
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
    let tokenExpiry = localStorage.getItem("tokenExpiry");
    let dishesInCart

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
            dishesInCart = await getWithHeaders(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);
        }
    }

    

    createNavbar(profile, dishesInCart);
    createMainPart(profile, dishesInCart);
});