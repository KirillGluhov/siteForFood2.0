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

// method - метод, требующий наличие url - то, куда отправляется запрос, data - тело запроса и token - токен

export async function get(url) 
{
    return fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
    }).then(response => response.json());
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

export async function put(url, data, token)
{
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }),
    });
}