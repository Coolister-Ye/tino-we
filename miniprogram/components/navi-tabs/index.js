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
    tabs: []
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
      // this.setCurrentIndexByName(data.active || this.getCurrentName());
    },

    // _getAllChildren: function() {
    //   let nodes = this.getRelationNodes('../navi-tab/index')
    //   console.log("ALL NODES: ", nodes)
    // }
  },

  lifetimes: {
    ready: function() {
      console.log(this.data.tabs);
    }
  }
})
