import axios from 'axios';

const API_KEY = '36560176-389977c64a520682aab26cdb9';
const URL = 'https://pixabay.com/api/';

export default class ApiPictures {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = 0;
  }

  async getPictures() {
    const { data } = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );
    this.incrementPage();
    this.totalHits = data.totalHits;
    return data.hits; //hits це назва масиву (дивитись в документації або через post) з картками в обєкті, який приходить data
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
