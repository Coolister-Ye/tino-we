// components/navi-tabs.js
import {getChildren, getChildrenBehavior} from '../../utils/realtion'

Component({
  behaviors: [getChildrenBehavior('navi-tab')],

  /**
   * Component properties
   */
  behaviors: [getParentsBehaviors],

  properties: {

  },

  relations: getChildren('navi-tab', function() {
    this.updateNaviTabs()
  }),

  /**
   * Component initial data
   */
  data: {
    naviTabs: []
  },

  /**
   * Component methods
   */
  methods: {
    updateNaviTabs() {
      const { children = [], data } = this;
      this.setData({
        naviTabs: children.map((child) => child.data),
      });
      // this.setCurrentIndexByName(data.active || this.getCurrentName());
    },

    // _getAllChildren: function() {
    //   let nodes = this.getRelationNodes('../navi-tab/index')
    //   console.log("ALL NODES: ", nodes)
    // }
  },

  // lifetimes: {
  //   ready: function() {
  //     this._getAllChildren()
  //   }
  // }
})
