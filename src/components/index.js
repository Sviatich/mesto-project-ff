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
const currentAvatar = document.querySelector('.avatar-image');
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
    changeButtonTitle(addNewCardForm.querySelector('.button'), "Сохранение...");
    const placeName = document.querySelector('[name="place-name"]').value;
    const link = document.querySelector('[name="link"]').value;
    try {
        const newCard = await addNewCard(placeName, link);
        cardContainer.prepend(createCard(newCard.owner._id, newCard, { deleteCard, likeCard, imageClick }));
        closeAllPopups();
        addNewCardForm.reset();
    } catch (error) {
        console.error('Ошибка при создании новой карточки:', error);
    } finally {
        changeButtonTitle(addNewCardForm.querySelector('.button'), "Сохранить");
    }
});

editProfileAvatarForm.addEventListener('submit', async function (evt) {
    evt.preventDefault();
    changeButtonTitle(editProfileAvatarForm.querySelector('.button'), "Сохранение...");
    const link = document.querySelector('[name="avatar-link"]').value;
    try {
        const userData = await updateProfileAvatar(link);
        currentAvatar.src = userData.avatar;
        closeAllPopups();
        editProfileAvatarForm.reset();
    } catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
    } finally {
        changeButtonTitle(editProfileAvatarForm.querySelector('.button'), "Сохранить");
    }
});


editProfileForm.addEventListener('submit', async function (evt) {
    evt.preventDefault();
    changeButtonTitle(editProfileForm.querySelector('.button'), "Сохранение...");
    const inputName = document.querySelector('[name="name"]');
    const currentAvatar = document.querySelector('.avatar-image');
    const inputDescription = document.querySelector('[name="description"]');
    let currentName = document.querySelector('.profile__title');
    let currentDescription = document.querySelector('.profile__description');
    try {
        await updateUserData(inputName.value, currentAvatar.src, inputDescription.value);
        currentName.textContent = inputName.value;
        currentDescription.textContent = inputDescription.value;
        closeAllPopups();
    } catch (error) {
        console.error('Ошибка при обновлении данных пользователя:', error);
    } finally {
        changeButtonTitle(editProfileForm.querySelector('.button'), "Сохранить");
    }
});

editAvatarButton.addEventListener('click', () => {
    openModal(updateAvatarPopup);
    const openedPopup = document.querySelector('.popup_is-opened');
    clearValidation(openedPopup, validationConfig);
});

editProfileButton.addEventListener('click', () => {
    openModal(editProfilePopup);
    const openedPopup = document.querySelector('.popup_is-opened');
    clearValidation(openedPopup, validationConfig);
    const inputName = document.querySelector('[name="name"]');
    const inputDescription = document.querySelector('[name="description"]');
    let currentName = document.querySelector('.profile__title').textContent;
    let currentDescription = document.querySelector('.profile__description').textContent;
    inputName.value = currentName;
    inputDescription.value = currentDescription;
});

addCardButton.addEventListener('click', () => {
    openModal(newCardPopup);
    const openedPopup = document.querySelector('.popup_is-opened');
    clearValidation(openedPopup, validationConfig);
});

function changeButtonTitle(button, text) {
    button.textContent = text;
}

function imageClick(imageLink, imageCaption) {
    imagePopapPicture.src = imageLink;
    imagePopapPicture.alt = imageCaption;
    imagePopapCaption.textContent = imageCaption;
    openModal(imagePopap);
}

function deleteCard(cardId, cardElement) {
    openModal(deleteCardPopup);
    const form = document.forms['delete-card'];
    form.onsubmit = async function (evt) {
        evt.preventDefault();
        const submitButton = form.querySelector('.button');
        changeButtonTitle(submitButton, "Удаление...");
        try {
            await deleteMyCard(cardId);
            cardElement.remove();
            closeModal(deleteCardPopup);
        } catch (error) {
            console.error('Ошибка при удалении карточки:', error);
        } finally {
            changeButtonTitle(submitButton, "Да");
        }
    };
}

async function likeCard(item, cardLike, cardLikeCount) {
    if (cardLike.classList.contains('card__like-button_is-active')) {
        try {
            const likeCount = await unSetLike(item._id);
            cardLike.classList.remove('card__like-button_is-active');
            cardLikeCount.textContent = likeCount.likes.length;
        } catch (error) {
            console.error('Ошибка при снятии лайка:', error);
        }
    } else {
        try {
            const likeCount = await setLike(item._id);   
            cardLike.classList.add('card__like-button_is-active');
            cardLikeCount.textContent = likeCount.likes.length;
        } catch (error) {
            console.error('Ошибка при установке лайка:', error);
        }
    }
}

function closeAllPopups() {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
        closeModal(openedPopup);
    }
}

async function showCards(user, initialCards) {
    const allCards = cardContainer.querySelectorAll('.places__item');
    if (allCards != null) {
        allCards.forEach(item => {
            cardContainer.removeChild(item);
        });
    }

    initialCards.forEach(item => {
        cardContainer.append(createCard(user._id, item, { deleteCard, likeCard, imageClick }));
    });
}

async function renderData() {
    try {
        const [userData, initialCards] = await Promise.all([
            getUserData(),
            getInitialCards()
        ]);
        currentName.textContent = userData.name;
        currentDescription.textContent = userData.about;
        currentAvatar.src = userData.avatar;
        showCards(userData, initialCards);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

renderData();
enableValidation(validationConfig);