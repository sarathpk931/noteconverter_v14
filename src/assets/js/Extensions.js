function keyboardClose() {
    if (typeof EIP_CloseEmbeddedKeyboard === 'function') {
        EIP_CloseEmbeddedKeyboard(); //dismiss device keyboard
    }
}
