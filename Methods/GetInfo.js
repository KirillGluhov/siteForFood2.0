export async function getMainInformation(token, profile, dishesInCart = null)
{
    if (localStorage.getItem("tokenExpiry") && new Date().getTime() > parseInt(localStorage.getItem("tokenExpiry"))) 
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

            if (dishesInCart !== null)
            {
                dishesInCart = await getWithToken(`https://food-delivery.kreosoft.ru/api/basket`, localStorage['token']);
            }
        }
    }
}