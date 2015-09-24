// copied from the space fortress sandbox
// keyboard

var Key = {
  mk: function (code, id) {
    return { c: code, id: id }
  },
  range: function (a, b, id) {
    var r = []
    for (var i = a; i <= b; i++)
      r.push (Key.mk (i, id))
    return r
  },
  slug: function (e, keys) {
    var id = []
    if (e.ctrlKey) id.push ('ctrl')
    if (e.shiftKey) id.push ('shift')
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].c === e.keyCode) {
        id.push (keys[i].id)
        break
      }
    }
    return id.join ('+')
  }
}

var Kbd = {
  keys: [
    Key.mk (8, 'back'),
    Key.mk (13, 'enter'),
    Key.mk (32, 'space'),
    Key.mk (37, "left"),
    Key.mk (38, "up"),
    Key.mk (39, "right"),
    Key.mk (40, "down")
  ].concat (Key.range (65, 90, 'letter')),
  // dispatches actions depending on the key
  dispatch: function (e) {
    var slug = Key.slug (e, Kbd.keys)
    switch (slug) {
      case 'enter':
        xw.usr.toggleDir ()
        break
      case 'right':
      case 'down':
      case 'left':
      case 'up':
        xw.usr.move (slug)
        break
      case 'letter':
        xw.usr.write (String.fromCharCode (e.keyCode))
        if (xw.usr.dir === 'h') xw.usr.move ('right')
        else xw.usr.move ('down')
        break
      case 'back':
        if (xw.usr.dir === 'h') xw.usr.move ('left')
        else xw.usr.move ('up')
        xw.usr.write ('')
        break
      case 'space':
        xw.usr.write ('')
        if (xw.usr.dir === 'h') xw.usr.move ('right')
        else xw.usr.move ('down')
        break
    }
    return false
  }
}
