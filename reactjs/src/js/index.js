import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';

window.addEventListener('load', () => {
  document.querySelector('article#newLoader p').innerHTML = "We're Ready";

  const fadeSelectors = () => {
    document.getElementById('newLoader').classList.add('fadeOut');
  };

  setTimeout(fadeSelectors, 800);

  const removeSelectors = () => {
    document.getElementById('newLoader').style.display = 'none';
    document.getElementById('newLoader').style.zIndex = '0';
    document.querySelector('article#newLoader section').style.display = 'none';
  };

  setTimeout(removeSelectors, 2000);
});

$(document).ready(() => {
  $(window).scroll((event) => {
    if ($(window).scrollTop() > 940) {
      $('.bckColor').stop().animate({ opacity: '1' }, 150);
      $('#bck').stop().animate({ opacity: '0', display: 'none' }, 500);
    }

    if ($(window).scrollTop() < 920) {
      $('.bckColor').stop().animate({ opacity: '0' }, 200);
      $('#bck').stop().animate({ opacity: '1', display: 'block' }, 200);
    }
  });

  /* AUTOMATIC COPYRIGHT YEAR CHANGE */
  const today = new Date();
  const year = today.getFullYear();
  $('footer article p, footer article p[title]').html(`©${year}, Hero-Log. All rights reserved.`);
  // $('footer article p[title]').html(`${year}, Hero-Log. All rights reserved.`);
});
