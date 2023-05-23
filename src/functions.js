import 'simplelightbox/dist/simple-lightbox.min.css';

import refs from './references';
import LoadMoreBtn from './LoadMoreBtn';

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});
// функція створення розмітки. Робимо деструктуризацію необхідних параметрів
function createMarkup({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
  largeImageURL,
}) {
  return `
<div class="photo-card">
<a class="photo-link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b> ${likes}
    </p>
    <p class="info-item">
      <b>Views: </b> ${views}
    </p>
    <p class="info-item">
      <b>Comments: </b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b> ${downloads}
    </p>
  </div>
</div>
`;
}

// вставка(оновлення) розмітки на сторінці
function updateList(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearList() {
  refs.gallery.innerHTML = '';
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
  clearList();
}

export { createMarkup, updateList, clearList, onError };
