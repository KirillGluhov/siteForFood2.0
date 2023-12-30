import { get } from '../Methods/Methods.js';
import { put } from '../Methods/Methods.js';

import { createNavbar } from '../Methods/Create.js';
import { createFieldToInput } from '../Methods/Create.js';
import { createInfoFields } from '../Methods/Create.js';

import { getMainInformation } from '../Methods/GetInfo.js';

async function createMainPart(profile)
{
    const fullname = document.getElementById("inputFullname");
    fullname.value = profile["fullName"];

    const gender = document.getElementById("staticGender");
    gender.value = ((profile["gender"] === "Male") ? ("мужской") : ("женский"));

    const email = document.getElementById("staticEmail");
    email.value = profile["email"];

    const birthday = document.getElementById("birthDate");

    if (profile["birthDate"] !== null)
    {
        birthday.value = profile["birthDate"].slice(0, 10);
    }

    const phone = document.getElementById("phone");

    IMask(
        document.getElementById('phone'),
        {
          mask: '+{7} (000) 000-00-00'
        }
    )

    if (profile["phoneNumber"] !== null)
    {
        phone.value = profile["phoneNumber"];
    }

    const adress = await get("https://food-delivery.kreosoft.ru/api/address/search");
    let guidOfBuilding;

    document.getElementById("save").addEventListener("click", () => {
        const infoAboutUser = {
            "fullName": fullname.value,
            "birthDate": birthday.value || null,
            "gender": `${(gender.value === "мужской") ? ("Male") : ("Female")}`,
            "addressId": guidOfBuilding || null,
            "phoneNumber": phone.value || null,
        }
    
        put("https://food-delivery.kreosoft.ru/api/account/profile", infoAboutUser, localStorage['token']).then((data) => {

            if (data['status'] = 200)
            {
                localStorage['isDisplay'] = true;
                localStorage['isCorrect'] = true;
                window.location['href'] = 'http://localhost/profile/';
            }
            else
            {
                localStorage['isDisplay'] = true;
                localStorage['isCorrect'] = false;
                window.location['href'] = 'http://localhost/profile/';
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

    if (localStorage['isDisplay'] === "true")
    {
        if (localStorage['isCorrect'] === "true")
        {
            document.querySelector(".alert.alert-primary").className = "alert alert-primary visible";
            document.querySelector(".alert.alert-primary").innerHTML = "Изменения сохранены <button type='button' class='close' aria-label='Закрыть'><span aria-hidden='true'>&times;</span></button>";
        }
        else
        {
            document.querySelector(".alert.alert-primary").className = "alert alert-primary visible";
            document.querySelector(".alert.alert-primary").innerHTML = "Изменения не сохранены  <button type='button' class='close' aria-label='Закрыть'><span aria-hidden='true'>&times;</span></button>";
        }
    }
    else
    {
        document.querySelector(".alert.alert-primary").className = "alert alert-primary d-none";
    }

    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".alert.alert-primary").className = "alert alert-primary d-none";
        localStorage['isDisplay'] = false;
    });


    createNavbar(profile);
    createMainPart(profile);

});