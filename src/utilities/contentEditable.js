//onKeyDown
export const saveContentAfterPressEnter = (e) => {
    if (e.key === 'Enter') {
        e.target.blur();
    }
};

// Select All input value when onClick
export const selectAllInlineText = (e) => {
    e.target.focus();
    e.target.select();
};
