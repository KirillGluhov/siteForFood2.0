export async function correct(option)
{
    option.className = "form-control";
    option.setAttribute('data-toggle', '');
    option.setAttribute('data-placement', '');
    option.setAttribute('title', '');
}

export async function incorrect(option, message)
{
    option.className = "form-control is-invalid";
    option.setAttribute('data-toggle', 'tootip');
    option.setAttribute('data-placement', 'right');
    option.setAttribute('title', message);
}

export async function isCorrect(option, regularExpression, length = 10)
{
    let regex = new RegExp(regularExpression)
    let stringWithoutSpaces = option.value.trim();

    if (stringWithoutSpaces.length > 0)
    {
        if (stringWithoutSpaces.match(regularExpression) !== null)
        {
            correct(option);
            return true;
        }
        else
        {
            incorrect(option, "Некорректное значение");
            return false;
        }

    }
    else if (length < 1)
    {
        incorrect(option, "Некорректное значение");
        return false;
    }
    else
    {
        correct(option);
        return true;
    }
}

export async function passwordCheck(option)
{
    if (option.value === null || option.value === "")  
    {
        incorrect(option, "Это поле не должно быть пустым");
        return false;
    } 
    else if (option.value.length < 6)
    {
        incorrect(option, "Пароль должен состоять хотя бы из 6 символов");
        return false;
    }
    else if (!isHavingNumber(option))
    {
        incorrect(option, "В пароле должна быть хотя бы одна цифра");
        return false;
    }
    else 
    {
        correct(option);
        return true;
    }

}

export function isHavingNumber(option)
{
    for (let i = 0; i < option.value.length; i++)
    {
        if (!isNaN(option.value[i]))
        {
            return true;
        }
    }

    return false;
}