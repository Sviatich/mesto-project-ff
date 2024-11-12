const cardContainer = document.querySelector('.places__list');

function deleteCard(cardElement) {
    cardElement.remove();
}

function createCard(item, {deleteCard}) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
  
    cardTitle.textContent = item.name;
    cardImage.src = item.link;
    cardImage.alt = item.name;

    cardDeleteButton.addEventListener('click', () => deleteCard(cardElement));

    return cardElement;
}

function showCards(cardArray) {
    cardArray.forEach(item => {
        cardContainer.append(createCard(item, { deleteCard }));
    });
}

showCards(initialCards);
