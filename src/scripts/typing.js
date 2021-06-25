/* eslint-disable quotes */
// Can also be included with a regular script tag
const options = {
    strings: [
        "Hi there. I'm a student.",
        'I enjoy coding in my freetime<i class="fas fa-laptop-code"></i>.',
    ],
    typeSpeed: 40,
    loop: true,
};

const typed = new Typed('#description', options);

typed();
