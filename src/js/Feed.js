export class Feed {
  constructor(observer) {
    this.observer = observer;
    (this.container = document.querySelector(".feed")),
      (this.numberOfMembers = 300);
    (this.optionsFiltrationMethods = {
      nick: ({ login: { username } }, data) =>
        username.indexOf(data.toLowerCase()) !== -1,
      name: ({ name: { first, last } }, data) =>
        `${first.toLowerCase()} ${last.toLowerCase()}`.indexOf(
          data.toLowerCase()
        ) !== -1,
      gender: ({ gender }, data) => gender == data.toLowerCase(),
      agefrom: ({ dob: { age } }, data) => age >= data,
      ageto: ({ dob: { age } }, data) => age <= data,
      email: ({ email }, data) => email.indexOf(data.toLowerCase()) !== -1,
      city: ({ location: { city } }, data) =>
        city.toLowerCase().indexOf(data.toLowerCase()) !== -1,
    }),
      (this.optionSortMethods = {
        az: (
          { login: { username: username1 } },
          { login: { username: username2 } }
        ) => username1.toLowerCase().localeCompare(username2.toLowerCase()),
        za: (
          { login: { username: username1 } },
          { login: { username: username2 } }
        ) => username2.toLowerCase().localeCompare(username1.toLowerCase()),
        "az-name": (
          { name: { first: first1, last: last1 } },
          { name: { first: first2, last: last2 } }
        ) =>
          `${first1.toLowerCase()} ${last1.toLowerCase()}`.localeCompare(
            `${first2.toLowerCase()} ${last2.toLowerCase()}`
          ),
        "za-name": (
          { name: { first: first1, last: last1 } },
          { name: { first: first2, last: last2 } }
        ) =>
          `${first2.toLowerCase()} ${last2.toLowerCase()}`.localeCompare(
            `${first1.toLowerCase()} ${last1.last.toLowerCase()}`
          ),
        "young-first": ({ dob: { age: age1 } }, { dob: { age: age2 } }) =>
          age1 - age2,
        "old-first": ({ dob: { age: age1 } }, { dob: { age: age2 } }) =>
          age2 - age1,
        newfag: (
          { registered: { date: date1 } },
          { registered: { date: date2 } }
        ) => date2.localeCompare(date1),
        oldfag: (
          { registered: { date: date1 } },
          { registered: { date: date2 } }
        ) => date1.localeCompare(date2),
      });
  }

  init() {
    this.showErrorOrLoader('loader');
    this.observer.subscribe("optionChange", this.onOptionChange.bind(this));
    this.fetchFriends().then(() => {
      this.observer.emit("feedLoaded");
    });
  }

  // showLoader() {
  //   const loaderDivContainer = document.createElement('div');
  //   const loaderDiv = document.createElement('div');
  //   loaderDiv.classList.add('loader');
  //   loaderDivContainer.classList.add('loader__container');
  //   loaderDivContainer.appendChild(loaderDiv)
  //   this.container.appendChild(loaderDivContainer);
  // }

  // showErrorMessage(errorMessage) {
  //   this.clear();
  //   const errorDivContainer = document.createElement('div');
  //   const errorDiv = document.createElement('div');
  //   errorDiv.classList.add('error');
  //   errorDiv.innerHTML = errorMessage;
  //   errorDivContainer.classList.add('error__container');
  //   errorDivContainer.appendChild(errorDiv)
  //   this.container.appendChild(errorDivContainer);
  // }

  showErrorOrLoader(messageType, errorMessage) {
    this.clear();
    const divContainer = document.createElement('div');
    const elementDiv = document.createElement('div');
    elementDiv.classList.add(messageType);
    elementDiv.innerHTML = errorMessage || '';
    divContainer.classList.add(`${messageType}__container`);
    divContainer.appendChild(elementDiv)
    this.container.appendChild(divContainer);
  }

  onOptionChange(options) {
    try {this.filterArray(options);
    this.clear();
    this.createFeed();}
    catch (error) {
      this.showErrorOrLoader('error',error.message)
    }
  }

  filterArray({ filters, sort }) {
    const filtersArray = Object.entries(filters);
    this.selectedFriends = filtersArray.reduce(
      (friends, [filterKey, filterData]) => {
        if (!this.optionsFiltrationMethods[filterKey]) {
          throw new Error(
            "There's no such page on server. Check the filter options you've entered."
          );
        }
        friends = friends.filter((friend) =>
          this.optionsFiltrationMethods[filterKey](friend, filterData)
        );
        return friends;
      },
      this.friends
    );
    if (!this.optionSortMethods[sort]) {
      throw new Error(
        "There's no such page on server. Check the filter options you've entered."
      );
    }
    this.selectedFriends = this.selectedFriends.sort((friend1, friend2) =>
      this.optionSortMethods[sort](friend1, friend2)
    );
  }

  createFeed() {
    this.selectedFriends.forEach((friend) => {
      this.container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="card">
          <img src="${
            friend.picture.large
          }" class="card__img" alt="">
          <h5 class="card__nick">${friend.login.username}</h5>
          <h6 class="card__member-name">${friend.name.first} ${
          friend.name.last
        }</h6>
          <p class="card__age">${friend.dob.age} years</p>
          <p class="card__city">${friend.location.city}</p>
          <p class="card__city">${friend.registered.date}</p>
          <p class="card__phone"><a class="card__link" href="tel:${
            friend.phone
          }">${friend.phone}</a></p>
          <p class="card__email"><a class="card__link" href="mailto:${
            friend.email
          }">${friend.email}</a></p>
      `
      );
    });
  }

  async fetchFriends() {
    const response = await fetch(
      `https://randomuser.me/api/?results=${this.numberOfMembers}`
    );
    const { results } = await response.json();
    this.friends = results;
  }

  clear() {
    this.container.innerHTML = "";
  }
}
