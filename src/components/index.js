import '../index.css';
// import { initialCards } from './cards.js';
import { deleteCard, createCard, likeCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getInitialCards, getUserData, updateUserData, addNewCard } from './api.js';

const cardContainer = document.querySelector('.places__list');
const editProfilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopap = document.querySelector('.popup_type_image');
const imagePopapPicture = imagePopap.querySelector('.popup__image');
const imagePopapCaption = imagePopap.querySelector('.popup__caption');
const closeButtons = document.querySelectorAll('.popup__close');
const allPopups = document.querySelectorAll('.popup');
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

document.querySelector('.profile__edit-button').addEventListener('click', () => {
    openModal(editProfilePopup);
    const inputName = document.querySelector('[name="name"]');
    const inputDescription = document.querySelector('[name="description"]');
    const currentName = document.querySelector('.profile__title').textContent;
    const currentDescription = document.querySelector('.profile__description').textContent;
    inputName.value = currentName;
    inputDescription.value = currentDescription;
    enableValidation(validationConfig);
});
document.querySelector('.profile__add-button').addEventListener('click', () => {
    openModal(newCardPopup);
    enableValidation(validationConfig);
});

function imageClick(imageLink, imageCaption) {
    imagePopapPicture.src = imageLink;
    imagePopapPicture.alt = imageCaption;
    imagePopapCaption.textContent = imageCaption;
    openModal(imagePopap);
}

function closeAllPopups() {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
        closeModal(openedPopup);
        clearValidation(openedPopup, validationConfig);
    }
}

closeButtons.forEach(button => {
    button.addEventListener('click', closeAllPopups);
});

allPopups.forEach(popup => {
    popup.addEventListener('mousedown', (event) => {
        if (event.target === popup) {
            closeAllPopups();
        }
    });
});

document.forms['new-place'].addEventListener('submit', function (evt) {
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
    addNewCard(placeName, link);
    
});

document.forms['edit-profile'].addEventListener('submit', function (evt) {
    evt.preventDefault();
    const inputName = document.querySelector('[name="name"]');
    const inputDescription = document.querySelector('[name="description"]');
    let currentName = document.querySelector('.profile__title');
    let currentDescription = document.querySelector('.profile__description');
    currentName.textContent = inputName.value;
    currentDescription.textContent = inputDescription.value;
    userUpdateData();
    closeAllPopups();
});

function showCards(user, cards) {
    cards.forEach(item => {
        cardContainer.append(createCard(user, item, { deleteCard, likeCard, imageClick }));
    });
}

const initialCards = await getInitialCards();
console.log(initialCards);
// const userData = await getUserData();

async function userLoadData(){
    const userData = await getUserData();
    let currentName = document.querySelector('.profile__title');
    let currentDescription = document.querySelector('.profile__description');
    let currentAvatar = document.querySelector('.profile__image');
    currentName.textContent = userData.name;
    currentDescription.textContent = userData.about;
    currentAvatar.src = userData.avatar;
}

function userUpdateData(){
    let currentName = document.querySelector('.profile__title');
    let currentDescription = document.querySelector('.profile__description');
    let currentAvatar = document.querySelector('.profile__image');
    updateUserData(currentName.textContent, currentAvatar.src, currentDescription.textContent);
    userLoadData();
}

userLoadData();
showCards(initialCards);