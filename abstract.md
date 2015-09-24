les choses qui sont essentiellement là :

* une source (grille, indices)
* des cellules (position, traits)
* un grille (cellules)
* un survol souris (position)
* un focus clavier (position, direction)
* une emphase -- ombre sur indices et cellules
* des indices (numéro, traits)
* des listes directionnelles (indices)
* un mapping clavier (touches)
* un état (source, grille, survol souris, focus clavier, traits)
* des templates
* des références au dom

un regroupement du code en fichiers clairs?

* input = touches, mapping, souris, extraction de source
* output = templates, références, rendu
* tools = les bouts de code portables
* models = cellule, grille, indices, traits
* main = map des touches, initialisation de l'état, premier rendu, attache des
  évènements
