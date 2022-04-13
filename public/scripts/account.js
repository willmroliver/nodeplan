const updateAccount = document.getElementById('updateAccount');
const updateAccountPopup = document.getElementById('updateAccountPopup');

updateAccount.addEventListener('click', () => {
    updateAccountPopup.classList.replace('contents-hidden', 'edit-event-popup');
})

const inputUsername = document.getElementById('inputUsername');
const inputEmail = document.getElementById('inputEmail');

inputUsername.defaultValue = document.getElementById('ejsUsername').innerText;
inputEmail.defaultValue = document.getElementById('ejsEmail').innerText;

const changePassword = document.getElementById('changePassword');
const updateDetailsBack = document.getElementById('updateDetailsBack');

updateDetailsBack.addEventListener('click', () => {
    updateAccountPopup.classList.replace('edit-event-popup', 'contents-hidden');
})