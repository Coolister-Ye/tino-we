// components/navi-tabs.js
import {getChildren, getChildrenBehavior} from '../../utils/realtion'

Component({
  behaviors: [getChildrenBehavior('navi-tab')],

  relations: getChildren('navi-tab', function() {
    this.updateTabs()
  }),

  /**
   * Component properties
   */
  properties: {

  }, 

  /**
   * Component initial data
   */
  data: {
    tabs: [],
    currentIndex: 0
  },

  /**
   * Component methods
   */
  methods: {
    updateTabs() {
      const { children = [], data } = this;
      this.setData({
        tabs: children.map((child) => child.data),
      });
      this.setCurrentIndexByName(this.getCurrentName());
    },
    onTap(event) {
      const {index} = event.currentTarget.dataset;
      this.setCurrentIndex(index);
    },
    getCurrentName() {
      const activaTab = this.children[this.data.currentIndex];
      if(activaTab) {
        return activaTab.getComputedName();
      }
    },
    setCurrentIndexByName(name) {
      const {children = []} = this;
      const matched = children.filter(
        (child) => child.getComputedName() === name
      );
      if(matched.length) {
        this.setCurrentIndex(matched[0].index);
      }
    },
    setCurrentIndex(currentIndex) {
      const {data, children = []} = this;
      if(currentIndex === data.currentIndex) {
        return;
      }
      this.setData({currentIndex});
    }
  },

  lifetimes: {
    ready: function() {
      console.log(this.data.tabs);
    }
  }
})
