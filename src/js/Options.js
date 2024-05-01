export class Options {
  constructor(observer) {
    this.observer = observer;
    (this.container = document.querySelector(".options")),
      (this.inputs = {
        filters: {
          nick: document.querySelector("#nick"),
          name: document.querySelector("#name"),
          gender: document.querySelector("#gender"),
          agefrom: document.querySelector("#agefrom"),
          ageto: document.querySelector("#ageto"),
          email: document.querySelector("#email"),
          city: document.querySelector("#city"),
        },
      }),
      (this.options = {
        filters: {},
        sort: "az",
      });
  }

  init() {
    this.inputs.filtersArray = Array.from(
      document.querySelectorAll("input[type=text],input[type=number],select")
    );
    this.inputs.sortsArray = Array.from(
      document.querySelectorAll("input[type=radio]")
    );
    // this.inputs.sorts = this.inputs.sortsArray.reduce(
    //   (sortInputsObj, input) => {
    //     sortInputsObj[input.value] = input;
    //     return sortInputsObj;
    //   },
    //   {}
    // );
    this.container.addEventListener("input", this.onInputChange.bind(this));
    this.getFiltersFromUrl();
    window.addEventListener("popstate", () => {
      this.getFiltersFromUrl();
      this.observer.emit("optionChange", this.options);
    });
    this.observer.subscribe("feedLoaded", () => {
      this.setUrl();
      this.observer.emit("optionChange", this.options);
    });
  }

  showFilters() {
    this.inputs.filtersArray.forEach((input) => {
      input.value = this.options.filters[input.name] || "";
    });
    this.inputs.sortsArray.forEach((input) => {
        if (input.value == this.options.sort) {
            input.setAttribute('checked', '')
        } else {
            input.removeAttribute('checked')
        }
    });
  }

  getFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      if (key == "sort") {
        this.options.sort = value;
      } else {
        this.options.filters[key] = value;
      }
    });
    this.showFilters();
  }

  setUrl() {
    const baseUrl = window.location.origin;
    let filterParams = Object.entries(this.options.filters).reduce(
      (string, [key, value]) => `${string}${key}=${value}&`,
      "?"
    );
    const newUrl = new URL(`${filterParams}sort=${this.options.sort}`, baseUrl);
    history.pushState(null, null, newUrl);
  }

  onInputChange({ target }) {
    if (target.name == "sort") {
      this.options.sort = target.value;
    } else if (target.value) {
      this.options.filters[target.name] = target.value;
    } else {
      delete this.options.filters[target.name];
    }
    this.setUrl();
    this.observer.emit("optionChange", this.options);
  }
}
