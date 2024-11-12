const cardContainer = document.querySelector('.places__list');

function deleteCard(cardElement) {
    cardElement.remove();
}

function showCards(cardName, cardImageLink) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  
    cardElement.querySelector('.card__title').textContent = cardName;
    cardElement.querySelector('.card__image').setAttribute('src', cardImageLink);
    cardDeleteButton.addEventListener('click', () => deleteCard(cardElement));

    cardContainer.append(cardElement);
}

initialCards.forEach(element => {
    showCards(element.name, element.link);
});

