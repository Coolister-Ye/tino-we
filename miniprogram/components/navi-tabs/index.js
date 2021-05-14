// components/navi-tabs.js
import {getParents, getChildren} from '../../utils/realtion'

Component({
  /**
   * Component properties
   */
  properties: {

  },

  relations: getChildren('navi-content', function() {
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
