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
const addCardButton = document.querySelector('.profile__add-button');
const editProfileAvatarForm = document.forms['edit-profile-avatar'];
const editProfileForm = document.forms['edit-profile'];
const addNewCardForm = document.forms['new-place'];
const editAvatarButton = document.querySelector('.profile__image');
const editProfileButton = document.querySelector('.profile__edit-button');
const currentAvatar = document.querySelector('.profile__image');
const currentName = document.querySelector('.profile__title');
const currentDescription = document.querySelector('.profile__description');
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

function changeButtonTitleOnSave(button) {
    button.textContent = "Сохранение...";
}

function changeButtonTitleAfterSave(button) {
    button.textContent = "Сохранить";
}

editProfileButton.addEventListener('click', () => {
    openModal(editProfilePopup);
    const inputName = document.querySelector('[name="name"]');
    const inputDescription = document.querySelector('[name="description"]');
    let currentName = document.querySelector('.profile__title').textContent;
    let currentDescription = document.querySelector('.profile__description').textContent;
    inputName.value = currentName;
    inputDescription.value = currentDescription;
    enableValidation(validationConfig);
});

addCardButton.addEventListener('click', () => {
    openModal(newCardPopup);
    enableValidation(validationConfig);
});

function imageClick(imageLink, imageCaption) {
    imagePopapPicture.src = imageLink;
    imagePopapPicture.alt = imageCaption;
    imagePopapCaption.textContent = imageCaption;
    openModal(imagePopap);
}

function deleteCard(cardId) {
    openModal(deleteCardPopup);
    const form = document.forms['delete-card'];
    form.onsubmit = async function (evt) {
        evt.preventDefault();
        await deleteMyCard(cardId);
        renderData();
        closeModal(deleteCardPopup);
    };
}

editAvatarButton.addEventListener('click', () => {
    openModal(updateAvatarPopup);
});

async function likeCard(item) {
    const userData = await getUserData();
    if (item.likes.some(like => like._id === userData._id)) {
        await unSetLike(item._id);
    } else {
        await setLike(item._id);
    }
    renderData();
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

addNewCardForm.addEventListener('submit', async function (evt) {
    evt.preventDefault();
    changeButtonTitleOnSave(addNewCardForm.querySelector('.button'));
    const placeName = document.querySelector('[name="place-name"]').value;
    const link = document.querySelector('[name="link"]').value;
    await addNewCard(placeName, link);
    renderData();
    addNewCardForm.reset();
    closeAllPopups();
    changeButtonTitleAfterSave(addNewCardForm.querySelector('.button'));
});

editProfileAvatarForm.addEventListener('submit', async function (evt) {
    evt.preventDefault();
    changeButtonTitleOnSave(editProfileAvatarForm.querySelector('.button'));
    const link = document.querySelector('[name="avatar-link"]').value;
    editProfileAvatarForm.reset();
    await updateProfileAvatar(link);
    userUpdateData();
    closeAllPopups();
    changeButtonTitleAfterSave(editProfileAvatarForm.querySelector('.button'));
});

editProfileForm.addEventListener('submit', async function (evt) {
    evt.preventDefault();
    changeButtonTitleOnSave(editProfileForm.querySelector('.button'));
    const inputName = document.querySelector('[name="name"]');
    const inputDescription = document.querySelector('[name="description"]');
    let currentName = document.querySelector('.profile__title');
    let currentDescription = document.querySelector('.profile__description');
    currentName.textContent = inputName.value;
    currentDescription.textContent = inputDescription.value;
    await userUpdateData();
    closeAllPopups();
    changeButtonTitleAfterSave(editProfileForm.querySelector('.button'));
});

async function showCards(user) {
    const initialCards = await getInitialCards();

    const allCards = cardContainer.querySelectorAll('.places__item');
    if (allCards != null) {
        allCards.forEach(item => {
            cardContainer.removeChild(item);
        });
    }

    initialCards.forEach(item => {
        cardContainer.append(createCard(user, item, { deleteCard, likeCard, imageClick }));
    });
}

async function userUpdateData() {
    await updateUserData(currentName.textContent, currentAvatar.src, currentDescription.textContent);
    renderData();
}

async function renderData() {
    try {
        const [userData, initialCards] = await Promise.all([
            getUserData(),
            getInitialCards()
        ]);
        currentName.textContent = userData.name;
        currentDescription.textContent = userData.about;
        currentAvatar.style.backgroundImage = `url("${userData.avatar}")`;
        showCards(userData, initialCards);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

renderData();