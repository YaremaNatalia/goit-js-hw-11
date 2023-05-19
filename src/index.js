import './css/styles.css';

import Notiflix from 'notiflix';

import refs from './references';

import ApiPictures from './api';
import { createMarkup, updateList, clearList, onError } from './functions';
import LoadMoreBtn from './LoadMoreBtn';

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});
const apiPictures = new ApiPictures();

refs.input.addEventListener('submit', onSearchPictures);
loadMoreBtn.button.addEventListener('click', fetchPictures);

function onSearchPictures(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim(); // searchQuery це назва імені інпуту, до значення якого звертаємось

  if (value === '') {
    Notiflix.Notify.failure('Oops, no value...');
  } else {
    apiPictures.searchQuery = value;
    apiPictures.resetPage();

    loadMoreBtn.show();
    clearList();
    fetchPictures()
      .then(() => {
        Notiflix.Notify.success(
          `Hooray! We found ${apiPictures.totalHits} images.`
        );
      })
      .finally(() => form.reset());
  }
}
//!для чого ця функція
async function fetchPictures() {
  loadMoreBtn.disable();

  try {
    const markup = await getPicturesMarkup();
    if (!markup) throw new Error('No data');
    updateList(markup);
  } catch (err) {
    onError(err);
  }

  loadMoreBtn.enable();
}

//!перевірити цю функцію
async function getPicturesMarkup() {
  try {
    const pictures = await apiPictures.getPictures();

    if (!pictures) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.hide();
      return '';
    }
    if (pictures.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.hide();
    }

    if (apiPictures.page * apiPictures.perPage >= apiPictures.totalHits) {
      loadMoreBtn.hide();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.hide();
    }

    return pictures.reduce(
      (markup, picture) => markup + createMarkup(picture),
      ''
    );
  } catch (err) {
    onError(err);
  }
}
