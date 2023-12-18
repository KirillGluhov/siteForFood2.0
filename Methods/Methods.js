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