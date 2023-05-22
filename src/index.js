import './css/styles.css';

import Notiflix from 'notiflix';

import refs from './references';

import ServicePictures from './getPictures';
import { createMarkup, updateList, clearList, onError } from './functions';
import LoadMoreBtn from './LoadMoreBtn';

// створюємо кнопку за конструктором в файлі LoadMoreBtn. додаємо селектор на кнопку з розмітки. Робимо за замовчуванням приховану
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});
const servicePictures = new ServicePictures(); // створюємо сервіс за конструктором класу з файлу аpi

refs.form.addEventListener('submit', onSearchPictures);
loadMoreBtn.button.addEventListener('click', onLoadMore);

async function onSearchPictures(event) {
  loadMoreBtn.hide();
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim(); // searchQuery це назва імені інпуту, до значення якого звертаємось

  if (value === '') {
    Notiflix.Notify.failure('Oops, no value...');
    clearList();
  } else {
    try {
      servicePictures.searchQuery = value; // додаємо значення з інпуту в пошукову змінну searchQuery в файлі арі
      servicePictures.resetPage(); //скидаємо сторінку до номеру 1

      clearList(); // чистимо сторінку перед тим, як завантажити розмітку

      const data = await servicePictures.getPictures(); // отримання даних по запиту
      const markup = data.reduce(
        (markup, picture) => markup + createMarkup(picture),
        ''
      ); //створення розмітки
      loadMoreBtn.show(); // показуємо кнопку завантажити більше
      if (!data) {
        loadMoreBtn.hide();
        return ''; // коли не приходить нічого (undefined).запит на отримання даних не був успішним або не повернув жодних результатів
      } else if (data.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        ); // коли приходить пустий масив
        servicePictures.resetPage();
        loadMoreBtn.hide();
        form.reset(); //чистимо форму в будьякому випадку при сабміті
        return;
      } else if (data.length < servicePictures.perPage) {
        Notiflix.Notify.success(
          `Hooray! We found ${servicePictures.totalHits} images.`
        ); // якщо зображень менше ніж кількість на 1 ст, вставляємо розмітку, ховаємо кнопку
        updateList(markup);
        loadMoreBtn.hide();
        form.reset();
      } else {
        Notiflix.Notify.success(
          `Hooray! We found ${servicePictures.totalHits} images.`
        );
        updateList(markup);
        loadMoreBtn.show();
        form.reset();
      }
    } catch (err) {
      onError(err);
    }
  }
}

// функція що підвантажує розмітку
async function onLoadMore() {
  loadMoreBtn.disable(); // кнопку неактивна "йде завантаження"

  try {
    const data = await servicePictures.getPictures();
    const markup = data.reduce(
      (markup, picture) => markup + createMarkup(picture),
      ''
    );
    updateList(markup);
    loadMoreBtn.enable(); // кнопка активна
    if (!data) {
      loadMoreBtn.hide();
      return ''; // коли не приходить нічого (undefined).запит на отримання даних не був успішним або не повернув жодних результатів
    }
    // плавний скрол, при переході на 2-гу сторінку
    if (servicePictures.page > 1) {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
    // якщо зображень більше ніж totalHits
    if (
      servicePictures.page * servicePictures.perPage >=
      servicePictures.totalHits
    ) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.hide();
    }
  } catch (err) {
    onError(err);
  }
}

//! Infinite scroll
// handleScroll();

// window.addEventListener('scroll', handleScroll);

// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   if (scrollTop + clientHeight >= scrollHeight - 5) {

//     loadMoreBtn.hide();
//   }
// }
