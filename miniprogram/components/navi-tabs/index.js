// components/navi-tabs.js
import {getParents, getChildren, getParentsBehaviors} from '../../utils/realtion'

Component({
  /**
   * Component properties
   */
  behaviors: [getParentsBehaviors],

  properties: {

  },

  relations: getChildren('navi-tab', function() {
    console.log(this)
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
    updateNaviTabs: function() {
      children = this.children === void 0 ? [] : this.children
      this.setData({
        naviTabs: children.map(child => child.data)
      })
    }
  }
})
