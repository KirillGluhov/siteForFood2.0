export async function createNavbarForUnauthorized()
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