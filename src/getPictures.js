import axios from 'axios'; // бібліотека для реалізації http запитів замість fetch

// створюємо конструктор для отримання запиту
export default class ServicePictures {
  constructor() {
    this.URL = 'https://pixabay.com/api/';
    this.API_KEY = '36560176-389977c64a520682aab26cdb9';
    this.perPage = 40;
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = 0; // ініціалізуємо значення змінної. totalHits параметр в обєкті pixabay (загальна кількість доступних зображень)
  }
  // axios повертає обєкт в форматі js не потрібно застосовувати метод .json як у разі використання fetch
  async getPictures() {
    const params = {
      key: this.API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
      page: this.page,
    };
    const { data } = await axios.get(`${this.URL}`, { params }); // назва обєкту params визначена документацією бібліотеки, data це деструктуризація даних з обєкту, що надходить
    // Результат GET-запроса будет распакован с помощью деструктуризации объекта. Синтаксис { data } указывает, что мы хотим извлечь значение свойства data из объекта-результата запроса. Переменная data будет содержать данные, полученные в ответ на GET-запрос.
    // Таким образом, после выполнения этой строки кода, переменная data будет содержать данные, полученные в ответе на GET-запрос.

    this.incrementPage();
    this.totalHits = data.totalHits; // присвоюємо значення з обєкту, який надходить від запиту
    return data.hits; //hits це назва масиву (дивитись в документації або через post) з картками в обєкті, який приходить data
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
