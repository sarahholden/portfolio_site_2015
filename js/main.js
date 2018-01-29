'use strict';

// MINIMAL EMAIL FORM --------------------------

const transEndEventNames = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd',
  msTransition: 'MSTransitionEnd',
  transition: 'transitionend'
};
const transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];
const support = { transitions: Modernizr.csstransitions };

let currentQuestionIndex = 0;
const questions = document.querySelectorAll('ol.questions > li');
const questionsLength = questions.length;

const contactForm = document.querySelector('#minimalForm');
const progressBar = document.querySelector('.progress');
const nextButton = document.querySelector('.next');
const currentNum = document.querySelector('.number-current');
const totalQuestionNum = document.querySelector('.number-total');
const errorMessage = document.querySelector('.error-message');
const firstInput = questions[currentQuestionIndex].querySelector('input');

// Get the form set up
questions[0].classList.add('current');

function updateQuestionNumber () {
  currentNum.innerHTML = Number(currentQuestionIndex + 1);
  totalQuestionNum.innerHTML = Number(questionsLength);
}

function onFocusShowNext () {
  firstInput.removeEventListener('focus', onFocusShowNext);
  nextButton.classList.add('show');
}

function showError (err) {
  let message = '';
  switch (err) {
    case 'EMPTYSTR':
      message = 'Please fill the field before continuing';
      break;
    case 'INVALIDEMAIL':
      message = 'Please fill a valid email address';
      break;
    default:
      message = '';
  }
  errorMessage.innerHTML = message;
  errorMessage.classList.add('show');
}

function clearError () {
  errorMessage.classList.remove('show');
}

function submit () {
  // hide form
  contactForm.querySelector('.contact-form-inner').classList.add('hide');

  const messageEl = contactForm.querySelector('.final-message');

  $.ajax({
    url: "contactengine.php",
    type: "POST",
    data: $('#minimalForm').serialize(),
    success () {
      console.log('working!');
      messageEl.innerHTML = `Thanks for your message! I&rsquo;ll be in touch shortly.`;
      messageEl.classList.add('show');
    },
    error () {
      messageEl.innerHTML = `Oops! There has been an error. If you'd like to reach me try reaching out directly at sarahbethholden@gmail.com`;
      messageEl.classList.add('show');
    }
  });
}

function validade () {
  // current question´s input
  const field = questions[currentQuestionIndex].querySelector('input') || questions[currentQuestionIndex].querySelector('textarea');
  const userInput = field.value;
  if (userInput === '') {
    showError('EMPTYSTR');
    return false;
  }
  if (field.type === 'email' && !(/(.+)@(.+){2,}\.(.+){2,}/.test(userInput))) {
    showError('INVALIDEMAIL');
    return false;
  }

  return true;
}


// updates the progressBar bar by setting its width
function updateProgressBar () {
  progressBar.style.width = `${currentQuestionIndex * (100 / questionsLength)}%`;
}


function showNextQuestion () {
  let isFilled = false;
  if (!validade()) {
    return false;
  }

  // check if form is filled
  if (currentQuestionIndex === questionsLength - 1) {
    isFilled = true;
  }

  // clear any previous error messages
  clearError();

  // current question
  const currentQuestion = questions[currentQuestionIndex];

  // increment current question iterator
  ++currentQuestionIndex;

  // update progress bar
  updateProgressBar();

  if (!isFilled) {
    // change the current question number/status
    updateQuestionNumber();

    // add class "show-next" to form element (start animations)
    contactForm.classList.add('show-next');

    // remove class "current" from current question and add it to the next one
    // current question
    var nextQuestion = questions[currentQuestionIndex];
    currentQuestion.classList.remove('current');
    nextQuestion.classList.add('current');
  }

  // after animation ends, remove class "show-next" from form element and
  // change current question placeholder
  function onEndTransitionFn(ev) {
    if (support.transitions) {
      this.removeEventListener(transEndEventName, onEndTransitionFn);
    }
    if (isFilled) {
      submit();
    } else {
      contactForm.classList.remove('show-next');
      const nextQuestionNum = document.createElement('span');
      nextQuestionNum.className = 'number-next';
      nextQuestionNum.innerHTML = Number(currentQuestionIndex + 1);
      currentNum.innerHTML = nextQuestionNum.innerHTML;
      // force the focus on the next input
      const field = questions[currentQuestionIndex].querySelector('input') || questions[currentQuestionIndex].querySelector('textarea');
      field.focus();
    }
  }

  if (support.transitions) {
    progressBar.addEventListener(transEndEventName, onEndTransitionFn);
  } else {
    onEndTransitionFn();
  }
}

// show the next button the first time the input gets focused
firstInput.addEventListener('focus', onFocusShowNext);

// show next question
nextButton.addEventListener('click', (ev) => {
  ev.preventDefault();
  showNextQuestion();
});


// pressing enter will jump to next question
document.addEventListener('keydown', (ev) => {
  const keyCode = ev.keyCode || ev.which;
  // enter
  if (keyCode === 13) {
    ev.preventDefault();
    showNextQuestion();
  } else if (keyCode === 9) {
    ev.preventDefault();
  }
});


updateQuestionNumber();


// Hamburger Menu --------------------------
document.querySelector('.burger').addEventListener('click', (ev) => {
  ev.preventDefault();
  document.querySelector('.nav-links').classList.add('mobile-nav-showing');
});

function closeMobileNav () {
  document.querySelector('.nav-links').classList.remove('mobile-nav-showing');
}

document.querySelector('.close-burger').addEventListener('click', (ev) => {
  ev.preventDefault();
  closeMobileNav();
});


// Smooth scroll this mother! -------------
let sectionToScrollTo = '#header';

function scrollToSection () {
  const targetOffset = $(sectionToScrollTo).offset().top;
  // use jQuery.animate() to animate the body's
  // scrollTop to the targetOffest
  $('html, body').animate({
    scrollTop: targetOffset - 58
  }, 600);
}


$('.nav-links a:not(.close-burger), .fo-sho-thats-me').on('click', function (ev) {
  ev.preventDefault();
  sectionToScrollTo = $(this).attr('href');
  closeMobileNav();
  scrollToSection();
});


setTimeout(() => {
  document.querySelector('header').classList.add('good-to-go');
}, 100);

// Morphing Header Background

class MorphingBG {
  constructor(el) {
    this.DOM = {};
    this.DOM.el = el;
    this.DOM.paths = Array.from(this.DOM.el.querySelectorAll('path'));
    this.animate();
  }
  animate() {
    this.DOM.paths.forEach((path) => {
      setTimeout(() => {
        anime({
          targets: path,
          duration: anime.random(3000,5000),
          easing: [0.5, 0, 0.5, 1],
          d: path.getAttribute('pathdata:id'),
          loop: true,
          direction: 'alternate'
        });
      }, anime.random(0,1000));
    });
  }
};

new MorphingBG(document.querySelector('.header-bg'));
new MorphingBG(document.querySelector('.play-bg'));
new MorphingBG(document.querySelector('.divider-1'));
new MorphingBG(document.querySelector('.divider-2'));
