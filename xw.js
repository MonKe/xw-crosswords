var mk = {
  clone: function (obj) {
    return JSON.parse (JSON.stringify (obj))
  }
}

var xw = {
  init: function () {
    crossword.dirs = xw.prep.sortByDir ()
    crossword.cells = xw.prep.sortByCell ()
    xw.usr.init ()
  },
  tpl: {
    cell: document.querySelector ('#templates .xw_cell').outerHTML,
    list: document.querySelector ('#templates .xw_list').outerHTML,
    row: document.querySelector ('#templates .xw_row').outerHTML,
    tipline: document.querySelector ('#templates .xw_tipline').outerHTML,
    tip: document.querySelector ('#templates .xw_tip').outerHTML
  },
  dom: {
    grid: document.querySelector ('#grid'),
    tips: document.querySelector ('#tips')
  },
  prep: {
    sortByDir: function () {
      var h = [], v = []
      for (var i = 0; i < crossword.tips.length; i++) {
        var tip = crossword.tips[i]
        tip.id = i
        if (!! tip.w) {
          if (! h[tip.y]) h[tip.y] = []
          h[tip.y].push (mk.clone (tip))
        }
        else {
          if (! v[tip.x]) v[tip.x] = []
          v[tip.x].push (mk.clone (tip))
        }
      }
      return {h: h, v: v}
    },
    sortByCell: function () {
      var cells = []
      for (var y = 0; y < crossword.h; y++) {
        cells[y] = []
        for (var x = 0; x < crossword.w; x++) {
          cells[y][x] = crossword.tips.filter (function (tip) {
            return (!!tip.w && tip.y === y && tip.x <= x && (tip.x + tip.w) > x) ||
              (!! tip.h && tip.x === x && tip.y <= y && (tip.y + tip.h) > y)
          }).map (function (tip) {
            return 't' + tip.id
          })
        }
      }
      return cells
    }
  },
  usr: {
    x: 0, y: 0, dir: 'h',
    grid: [],
    init: function () {
      for (var y = 0; y < crossword.h; y++) {
        xw.usr.grid[y] = []
        for (var x = 0; x < crossword.w; x++)
          xw.usr.grid[y][x] = ''
      }
    },
    toggleDir: function () {
      xw.usr.dir = xw.usr.dir === 'h' ? 'v' : 'h'
      xw.view.refreshCells ([{x: xw.usr.x, y: xw.usr.y}])
    },
    move: function (dir) {
      var cells = []
      if (dir === 'right' && xw.usr.x < crossword.w - 1) {
        xw.usr.x++
        xw.usr.hide (xw.usr.x - 1, xw.usr.y)
        xw.usr.show (xw.usr.x, xw.usr.y)
        cells.push ({x: xw.usr.x - 1, y: xw.usr.y})
        cells.push ({x: xw.usr.x, y: xw.usr.y})
      }
      else if (dir === 'down' && xw.usr.y < crossword.h - 1) {
        xw.usr.y++
        xw.usr.hide (xw.usr.x, xw.usr.y - 1)
        xw.usr.show (xw.usr.x, xw.usr.y)
        cells.push ({x: xw.usr.x, y: xw.usr.y - 1})
        cells.push ({x: xw.usr.x, y: xw.usr.y})
      }
      else if (dir === 'left' && xw.usr.x > 0) {
        xw.usr.x--
        xw.usr.hide (xw.usr.x + 1, xw.usr.y)
        xw.usr.show (xw.usr.x, xw.usr.y)
        cells.push ({x: xw.usr.x + 1, y: xw.usr.y})
        cells.push ({x: xw.usr.x, y: xw.usr.y})
      }
      else if (dir === 'up' && xw.usr.y > 0) {
        xw.usr.y--
        xw.usr.hide (xw.usr.x, xw.usr.y + 1)
        xw.usr.show (xw.usr.x, xw.usr.y)
        cells.push ({x: xw.usr.x, y: xw.usr.y + 1})
        cells.push ({x: xw.usr.x, y: xw.usr.y})
      }
      xw.view.refreshCells (cells)
    },
    moveTo: function (e) {
      var cells = [],
        pos = e.target.getAttribute ('id').slice (1).split ('x')
      cells.push ({x: xw.usr.x, y: xw.usr.y})
      cells.push ({x: +pos[0], y: +pos[1]})
      xw.usr.hide (xw.usr.x, xw.usr.y)
      xw.usr.show (+pos[0], +pos[1])
      xw.usr.x = +pos[0]
      xw.usr.y = +pos[1]
      xw.view.refreshCells (cells)
    },
    write: function (letter) {
      if (crossword.grid[xw.usr.y][xw.usr.x] !== ' ') {
        xw.usr.grid[xw.usr.y][xw.usr.x] = letter
        xw.view.refreshCells ([{x: xw.usr.x, y: xw.usr.y}])
      }
    },
    show: function (x, y) {
      var tips = document.getElementById ('c' + x + 'x' + y)
        .getAttribute ('class').split (' ').filter (function (t) {
        return t[0] === 't'
      })
      if (tips.length > 0) {
        tips.forEach (function (tip) {
          var t = document.getElementById (tip),
            attr = t.getAttribute ('class') + ' xw_show'
          t.setAttribute ('class', attr)
        })
      }
    },
    hide: function (x, y) {
      var tips = document.getElementById ('c' + x + 'x' + y)
        .getAttribute ('class').split (' ').filter (function (t) {
        return t[0] === 't'
      })
      if (tips.length > 0) {
        tips.forEach (function (tip) {
          var t = document.getElementById (tip),
            attr = t.getAttribute ('class').replace (/ xw_show/g, '')
          t.setAttribute ('class', attr)
        })
      }
    },
    showDiff: function (e) {
      var errs = [], empty = 0
      for (var y = 0; y < crossword.h; y++) {
        for (var x = 0; x < crossword.w; x++) {
          if (!! xw.usr.grid[y][x]) {
            if (xw.usr.grid[y][x] !== crossword.grid[y][x])
              errs.push ({x: x, y: y})
          }
          else if (crossword.grid[y][x] !== ' ')
            empty++
        }
      }
      if (empty === 0 && errs.length === 0)
        xw.usr.win ()
      xw.view.refreshCells (errs, true)
    },
    win: function () {
      var g = document.getElementById ('grid'),
        attr = g.getAttribute ('class') + ' xw_win'
      g.setAttribute ('class', attr)
      document.querySelector ('.xw_btn').innerHTML = 'Complet !'
    }
  },
  view: {
    refreshCells: function (cells, diff) {
      cells.forEach (function (cell) {
        var letter = crossword.grid[cell.y][cell.x],
          usrletter = xw.usr.grid[cell.y][cell.x],
            celltype = letter === ' ' ? 'xw_block' : 'xw_letter ' +
              crossword.cells[cell.y][cell.x].join (' '),
            id = 'c' + cell.x + 'x' + cell.y
          if (xw.usr.x === cell.x && xw.usr.y === cell.y)
            celltype += ' xw_focus xw_f' + xw.usr.dir
          if (diff) celltype += ' xw_diff'
          document.getElementById (id).outerHTML = xw.tpl.cell
            .replace ('$id', id)
            .replace ('$celltype', celltype)
            .replace ('$letter', usrletter)
      })
    },
    renderList: function (list) {
      var buff = ''
      for (var i = 0; i < list.length; i++) {
        var tipline = []
        if (!!list[i]) {
          for (var j = 0; j < list[i].length; j++) {
            var t = list[i][j]
            tipline.push (xw.tpl.tip
              .replace ('$id', 't' + t.id)
              .replace ('$def', t.def))
          }
          buff += xw.tpl.tipline
            .replace ('$n', '' + (i + 1))
            .replace ('$tips', tipline.join (' '))
        }
      }
      return buff
    },
    render: function () {
      // render the grid
      var grid = ''
      for (var y = 0; y < crossword.h; y++) {
        var row = ''
        for (var x = 0; x < crossword.w; x++) {
          var letter = crossword.grid[y][x],
            usrletter = xw.usr.grid[y][x],
            celltype = letter === ' ' ? 'xw_block' : 'xw_letter ' +
              crossword.cells[y][x].join (' '),
            id = 'c' + x + 'x' + y
          if (xw.usr.x === x && xw.usr.y === y)
            celltype += ' xw_focus xw_f' + xw.usr.dir
          row += xw.tpl.cell
            .replace ('$id', id)
            .replace ('$celltype', celltype)
            .replace ('$letter', usrletter)
        }
        grid += xw.tpl.row.replace ('$cells', row)
      }
      xw.dom.grid.innerHTML = grid
      // render the tips
      var tips = ''
      if (crossword.dirs.h.length > 0) {
        tips += xw.tpl.list
          .replace ('$title', 'Horizontal')
          .replace ('$tiplines', xw.view.renderList (crossword.dirs.h))
      }
      if (crossword.dirs.v.length > 0) {
        tips += xw.tpl.list
          .replace ('$title', 'Vertical')
          .replace ('$tiplines', xw.view.renderList (crossword.dirs.v))
      }
      xw.dom.tips.innerHTML = tips
      // show the first
      xw.usr.show (xw.usr.x, xw.usr.y)
    },
    addEvents: function () {
      // show events: relate tips & cells
      var cells = document.querySelectorAll ('#grid .xw_cell')
      for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener ('mouseenter', xw.view.showTips)
        cells[i].addEventListener ('mouseleave', xw.view.hideTips)
        cells[i].addEventListener ('click', xw.usr.moveTo)
      }
      var tips = document.querySelectorAll ('#tips .xw_tip')
      for (var i = 0; i < tips.length; i++) {
        tips[i].addEventListener ('mouseenter', xw.view.showCells)
        tips[i].addEventListener ('mouseleave', xw.view.hideCells)
      }
      document.querySelector ('.xw_btn').addEventListener ('click', xw.usr.showDiff)
      document.addEventListener ('keydown', Kbd.dispatch)
    },
    showTips: function (e) {
      var tips = e.target.getAttribute ('class').split (' ').filter (function (t) {
        return t[0] === 't'
      })
      if (tips.length > 0) {
        tips.forEach (function (tip) {
          var t = document.getElementById (tip),
            attr = t.getAttribute ('class') + ' xw_show'
          t.setAttribute ('class', attr)
        })
      }
    },
    showCells: function (e) {
      var cells = document.querySelectorAll ('.' + e.target.getAttribute ('id'))
      for (var i = 0; i < cells.length; i++) {
        var attr = cells[i].getAttribute ('class') + ' xw_show'
        cells[i].setAttribute ('class', attr)
      }
    },
    hideTips: function (e) {
      var tips = e.target.getAttribute ('class').split (' ').filter (function (t) {
        return t[0] === 't'
      })
      if (tips.length > 0) {
        tips.forEach (function (tip) {
          var t = document.getElementById (tip),
            attr = t.getAttribute ('class').replace (' xw_show', '')
          t.setAttribute ('class', attr)
        })
      }
    },
    hideCells: function (e) {
      var cells = document.querySelectorAll ('.' + e.target.getAttribute ('id'))
      for (var i = 0; i < cells.length; i++) {
        var attr = cells[i].getAttribute ('class').replace (' xw_show', '')
        cells[i].setAttribute ('class', attr)
      }
    }
  }
}
xw.init ()
xw.view.render ()
xw.view.addEvents ()
