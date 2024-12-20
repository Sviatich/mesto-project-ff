const config = {
    baseUrl: 'https://nomoreparties.co/v1/cohort-mag-4',
    headers: {
        authorization: '3ffb6802-4c7a-451e-898d-36a6a6a948a2',
        'Content-Type': 'application/json'
    }
}

export const getInitialCards = async () => {
    try {
        const response = await fetch(`${config.baseUrl}/cards`, { headers: config.headers });
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getUserData = async () => {
    try {
        const response = await fetch(`${config.baseUrl}/users/me`, { headers: config.headers });
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const updateUserData = async (userName, userAvatar, userDescription) => {
    try {
        const response = await fetch(`${config.baseUrl}/users/me`, { method: 'PATCH', headers: config.headers, body: JSON.stringify({ name: userName, about: userDescription, avatar: userAvatar }) });
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const addNewCard = async (cardName, cardLink) => {
    try {
        const response = await fetch(`${config.baseUrl}/cards`, { method: 'POST', headers: config.headers, body: JSON.stringify({ name: cardName, link: cardLink }) });
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// export const deleteMyCard = async (cardId) => {
//     try {
//         const response = await fetch(`${config.baseUrl}/cards/${cardId}`, { method: 'DELETE', headers: config.headers });
//         if (!response.ok) {
//             throw new Error('Ошибка загрузки данных');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// };

