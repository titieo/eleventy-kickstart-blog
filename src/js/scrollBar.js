const listOfLightThemes = [
    'light',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'retro',
    'cyberpunk',
    'valentine',
    'garden',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
];
const themeMode = document
    .getElementsByTagName('html')[0]
    .getAttribute('data-theme');

const getTheme = () => {
    const selectedTheme = document.querySelector('[data-choose-theme]').value;
    const theme =
        listOfLightThemes.indexOf(selectedTheme) > -1
            ? 'os-theme-dark'
            : 'os-theme-light';

    console.log('OverlayScrollbars Theme:', theme);
    return theme;
};

const osInstance = OverlayScrollbars(document.getElementsByTagName('body'), {
    className: getTheme(),
});

const changed = () => {
    osInstance.options({ className: getTheme() });
};

window.changed = changed;
