import '../index.css';
import { initialCards } from './cards.js'; 
import { deleteCard, createCard, likeCard } from './card.js'; 
import { openModal, closeModal } from './modal.js'; 

const cardContainer = document.querySelector('.places__list');
const editProfilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopap = document.querySelector('.popup_type_image');
const imagePopapPicture = imagePopap.querySelector('.popup__image');
const imagePopapCaption = imagePopap.querySelector('.popup__caption');
const closeButtons = document.querySelectorAll('.popup__close');

document.querySelector('.profile__edit-button').addEventListener('click', () => { 
    openModal(editProfilePopup); 
    const inputName = document.querySelector('[name="name"]');
    const inputDescription = document.querySelector('[name="description"]');
    const currentName = document.querySelector('.profile__title').textContent;
    const currentDescription = document.querySelector('.profile__description').textContent;
    inputName.value = currentName;
    inputDescription.value = currentDescription;
});
document.querySelector('.profile__add-button').addEventListener('click', () => openModal(newCardPopup));

function closeAllPopups() {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
        closeModal(openedPopup);
    }
}

closeButtons.forEach(button => {
    button.addEventListener('click', closeAllPopups);
});

const popups = document.querySelectorAll('.popup');
popups.forEach(popup => {
    popup.addEventListener('mousedown', (event) => {
        if (event.target === popup) {
            closeAllPopups();
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeAllPopups();
    }
});

document.forms['new-place'].addEventListener('submit', function(evt) {
    evt.preventDefault();
    const placeName = document.querySelector('[name="place-name"]').value;
    const link = document.querySelector('[name="link"]').value;
    const data = {
        name: placeName,
        link: link,
    };
    cardContainer.prepend(createCard(data, { deleteCard, likeCard, imageClick })); 
    document.forms['new-place'].reset();
    closeAllPopups();
});

document.forms['edit-profile'].addEventListener('submit', function(evt) {
    evt.preventDefault();
    const inputName = document.querySelector('[name="name"]');
    const inputDescription = document.querySelector('[name="description"]');
    let currentName = document.querySelector('.profile__title');
    let currentDescription = document.querySelector('.profile__description');
    currentName.textContent = inputName.value;
    currentDescription.textContent = inputDescription.value;
    closeAllPopups();
});

function imageClick(imageLink, imageCaption) {
    imagePopapPicture.src = imageLink;
    imagePopapPicture.alt = imageCaption;
    imagePopapCaption.textContent = imageCaption;
    openModal(imagePopap);
}

function showCards(initialCards) {
    initialCards.forEach(item => {
        cardContainer.append(createCard(item, { deleteCard, likeCard, imageClick }));
    });
}
showCards(initialCards);

