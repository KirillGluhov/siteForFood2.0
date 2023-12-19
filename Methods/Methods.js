// methodWithToken - метод, требующий наличие url - то, куда отправляется запрос и token - токен пользователя

export async function getWithToken(url, token)
{
    return fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }),
    }).then(response => response.json());
}

export async function postWithToken(url, token)
{
    return fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }),
    });
}

export async function deleteWithToken(url, token)
{
    return fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }),
    });
}

// methodWithTokenAndData - метод, требующий наличие url - то, куда отправляется запрос, data - тело запроса и token - токен пользователя

export async function postWithTokenAndData(url, data, token)
{
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }),
    });
}

// method - метод, требующий наличие url - то, куда отправляется запрос и опционально data - тело запроса

export async function get(url) 
{
    try 
    {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } 
    catch (error) 
    {
        console.error(error);
        throw error;
    }
}

export async function post(url, data=null)
{
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    }).then(response => response.json());
}