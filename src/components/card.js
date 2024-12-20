export function deleteCard(cardElement) {
    cardElement.remove();
}

export function likeCard(cardElement) {
    cardElement.classList.toggle('card__like-button_is-active');
}

export function createCard(user ,item, {deleteCard, likeCard, imageClick}) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    const cardLike = cardElement.querySelector('.card__like-button');
    const cardLikeCount = cardElement.querySelector('.card__like-count');

    if(user._id !== item.owner._id){
        cardElement.removeChild(cardDeleteButton);
    } 

    cardTitle.textContent = item.name;
    cardImage.src = item.link;
    cardImage.alt = item.name;
    cardLikeCount.textContent = item.likes.length;

    cardDeleteButton.addEventListener('click', () => deleteCard(cardElement));
    cardLike.addEventListener('click', () => likeCard(cardLike));
    cardImage.addEventListener('click', () => {
        imageClick(cardImage.src, cardImage.alt);
    });

    return cardElement;
}