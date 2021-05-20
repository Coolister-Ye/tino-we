function getParents(name, onEffect) {
  let path = '../' + name + '/index'
  let relation = {}
  relation[path] = {
    type: 'ancestor',
    linked: function() {
      onEffect && onEffect.call(this)
    },
    linkedChanged: function() {
      onEffect && onEffect.call(this)
    },
    unlinked: function() {
      onEffect && onEffect.call(this)
    }
  }
  return relation
  // relation['Behavior'] = Behavior({
  //   created: function() {
  //     Object.defineProperties(this, 'parent', {
  //       get: function() {
  //         return this.getRelationNodes(path)[0];
  //       }
  //     })
  //   }
  // })
}

function getChildren(name, onEffect) {
  let path = '../' + name + '/index'
  let relation = {}
  relation[path] = {
    type: 'descendant',
    linked: function(target) {
      console.log(this)
      onEffect && onEffect.call(this, target)
    },
    linkedChanged: function(target) {
      onEffect && onEffect.call(this, target)
    },
    unlinked: function(target) {
      onEffect && onEffect.call(this, target)
    }
  }
  return relation
}
function getChildrenBehavior(name) {
  let path = '../' + name + '/index'
  return Behavior({
    created: function() {
      Object.defineProperty(this, 'children', {
        get: function() {
          return this.getRelationNodes(path) || []
        }
      })
    }
  })
};

export {getParents, getChildren, getParentsBehaviors};
