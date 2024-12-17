export function openModal(modalElement) {
    modalElement.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeByEscape);
}

export function closeModal(modalElement) {
    modalElement.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeByEscape);
}

function closeByEscape (evt) {
    if (evt.key === 'Escape') {
        closeModal(document.querySelector('.popup_is-opened'));
    }
}
