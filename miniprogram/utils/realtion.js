function getParents(name, onEffect) {
  let path = '../' + name + '/index'
  let relation = {}
  relation[path] = {
    type: 'ancestor',
    linked: function() {
      onEffect && onEffect()
    },
    linkedChanged: function() {
      onEffect && onEffect()
    },
    unlinked: function() {
      onEffect && onEffect()
    }
  }

  relation['Behavior'] = Behavior({
    created: function() {
      Object.defineProperties(this, 'parent', {
        get: function() {
          return this.getRelationNodes(path)[0];
        }
      });

      Object.defineProperty(this, 'index', {
        get: function() {
          let _a = this.parent
          let _b = _a === null || _a === void 0 ? void 0 : _a.children
          return _b === null || _b === void 0 ? void 0 : _b.indexOf(this)
        }
      })
    }
  })
}

function getChildren(name, onEffect) {
  let path = '../' + name + '/index'
  let relation = {}
  relation[path] = {
    type: 'descendant',
    linked: function(target) {
      onEffect && onEffect(target)
    },
    linkedChanged: function(target) {
      onEffect && onEffect(target)
    },
    unlinked: function(target) {
      onEffect && onEffect(target)
    }
  }
  return relation
}

function getParentsBehaviors(name) {
  return Behavior({
    created: function() {
      Object.defineProperty(this, 'children', {
        get: function() {
          return this.getRelationNodes(path) || []
        }
      })
    }
  })
}

export {getParents, getChildren, getParentsBehaviors};