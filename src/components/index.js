import '../index.css';
import { createCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getInitialCards, getUserData, updateUserData, addNewCard, deleteMyCard, setLike, unSetLike, updateProfileAvatar } from './api.js';

const cardContainer = document.querySelector('.places__list');
const editProfilePopup = document.querySelector('.popup_type_edit');
const deleteCardPopup = document.querySelector('.popup_type_delete-card');
const updateAvatarPopup = document.querySelector('.popup_type_edit-avatar');
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

function changeButtonTitleOnSave(button) {
    console.log("Сохранение");
    button.textContent = "Сохранение...";
}

function changeButtonTitleAfterSave(button) {
    button.textContent = "Сохранить";
}

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

async function deleteCard(cardId) {
    openModal(deleteCardPopup);
    document.forms['delete-card'].addEventListener('submit', async function (evt) {
        evt.preventDefault();
        await deleteMyCard(cardId);
        userLoadData();
        closeAllPopups();
    });
}

document.querySelector('.profile__image').addEventListener('click', () => {
    openModal(updateAvatarPopup);
});

async function likeCard(item) {
    const userData = await getUserData();
    if (item.likes.some(like => like._id === userData._id)) {
        await unSetLike(item._id);
        showCards();
    } else {
        await setLike(item._id);
        showCards();
    }
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

document.forms['new-place'].addEventListener('submit', async function (evt) {
    evt.preventDefault();
    changeButtonTitleOnSave(document.forms['new-place'].querySelector('.button'));
    const placeName = document.querySelector('[name="place-name"]').value;
    const link = document.querySelector('[name="link"]').value;
    await addNewCard(placeName, link);
    showCards();
    document.forms['new-place'].reset();
    closeAllPopups();
    changeButtonTitleAfterSave(document.forms['new-place'].querySelector('.button'));
});

document.forms['edit-profile-avatar'].addEventListener('submit', async function (evt) {
    evt.preventDefault();
    changeButtonTitleOnSave(document.forms['edit-profile-avatar'].querySelector('.button'));
    const link = document.querySelector('[name="avatar-link"]').value;
    document.forms['edit-profile-avatar'].reset();
    await updateProfileAvatar(link);
    userUpdateData();
    closeAllPopups();
    changeButtonTitleAfterSave(document.forms['edit-profile-avatar'].querySelector('.button'));
});

document.forms['edit-profile'].addEventListener('submit', function (evt) {
    evt.preventDefault();
    changeButtonTitleOnSave(document.forms['edit-profile'].querySelector('.button'));
    const inputName = document.querySelector('[name="name"]');
    const inputDescription = document.querySelector('[name="description"]');
    let currentName = document.querySelector('.profile__title');
    let currentDescription = document.querySelector('.profile__description');
    currentName.textContent = inputName.value;
    currentDescription.textContent = inputDescription.value;
    userUpdateData();
    closeAllPopups();
    changeButtonTitleAfterSave(document.forms['edit-profile'].querySelector('.button'));
});

async function showCards() {
    const initialCards = await getInitialCards();
    const userData = await getUserData();

    const allCards = cardContainer.querySelectorAll('.places__item');
    if (allCards != null) {
        allCards.forEach(item => {
            cardContainer.removeChild(item);
        });
    }

    initialCards.forEach(item => {
        cardContainer.append(createCard(userData, item, { deleteCard, likeCard, imageClick }));
    });
}

async function userLoadData() {
    const userData = await getUserData();
    let currentName = document.querySelector('.profile__title');
    let currentDescription = document.querySelector('.profile__description');
    let currentAvatar = document.querySelector('.profile__image');
    currentName.textContent = userData.name;
    currentDescription.textContent = userData.about;
    currentAvatar.style.backgroundImage = `url("${userData.avatar}")`;
    showCards();
}

function userUpdateData() {
    let currentName = document.querySelector('.profile__title');
    let currentDescription = document.querySelector('.profile__description');
    let currentAvatar = document.querySelector('.profile__image');
    updateUserData(currentName.textContent, currentAvatar.src, currentDescription.textContent);
    userLoadData();
}

userLoadData();
showCards();