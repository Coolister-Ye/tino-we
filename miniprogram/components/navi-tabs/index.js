// components/navi-tabs.js
import {getChildren, getChildrenBehavior} from '../../utils/realtion';
import {getRect, getAllRect} from '../../utils/common';

Component({
  behaviors: [getChildrenBehavior('navi-tab')],

  relations: getChildren('navi-tab', function() {
    this.updateTabs()
  }),

  /**
   * Component properties
   */
  properties: {
    lineColor: String,
    lineWidth: {
      type: null,
      value: 40
    }, 
    lineHeight: {
      type: null,
      value: -1
    },
    duration: {
      type: Number,
      value: 0.3
    }
  }, 

  /**
   * Component initial data
   */
  data: {
    tabs: [],
    currentIndex: 0,
    lineOffsetLeft: 0
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
      const {data} = this;
      if(currentIndex === data.currentIndex) {
        return;
      }
      this.setData({currentIndex});
      this.resize();
    },
    resize() {
      const {currentIndex} = this.data;
      Promise.all([
        getAllRect(this, '.navi-tab'),
        getRect(this, '.navi-tabs-line')
      ]).then(([rects = [], lineRect]) => {
        const rect = rects[currentIndex];
        if(rect == null) {
          return;
        }
        let lineOffsetLeft = rect.left;
        lineOffsetLeft += (rect.width - lineRect.width) / 2;
        this.setData({
          lineOffsetLeft
        }); 
      })
    }
  },

  lifetimes: {
    attached: function() {
      this.resize();
    },
    ready: function() {
      console.log(this.data.tabs);
    }
  }
})
