// components/waterfall-layout/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    gap: {
      type: Number,
      value: 10
    }
  },

  /**
   * Component initial data
   */
  data: {
    leftList: [],
    rightList: []
  },

  /**
   * Component methods
   */
  methods: {
    render(list) {
      this._list = list;
      this.update();
    },

    reset() {
      this.setData({
        leftList: [],
        rightList: []
      });
      this._leftIndex = 0;
      this._rightIndex = 0;
    },

    update() {
      if (this._list.length) {
        const item = this._list.shift();
        this.createObserver().then(position => {
          this.data[`${position}List`].push(item);
          this.setData({[`${position}List`]: this.data[`${position}List`]}, () => {
            this[`${position}Index`] += 1;
            this.update();
          });
        });
      }
    },

    createObserver() {
      return new Promise(resolve => {
        this._observer && this._observer.disconnect();
        this._observer = this.createIntersectionObserver({observeAll: true});
        this._observer
          .relativeTo('.waterfall__observer')
          .observe('.waterfall__view', ({dataset: {nextposition = ""}}) => resolve(nextposition));
      });
    }
  },
  /**
   * Component lifttimes
   */
  lifetimes: {
    attached() {
      this._list = [];
      this._leftIndex = 0;
      this._rightIndex = 0;
    },
  }
})
