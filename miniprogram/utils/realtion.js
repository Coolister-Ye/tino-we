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

  // Object.defineProperty(this, 'index', {
  //   get: function() {
  //     let _a = this.parent
  //     let _b = _a === null || _a === void 0 ? void 0 : _a.children
  //     return _b === null || _b === void 0 ? void 0 : _b.indexOf(this)
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

export {getParents, getChildren, getChildrenBehavior}