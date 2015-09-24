fait:

+ le crossword, à son arrivée dans le programme, doit être transformé pour être
  plus accessible:
  + on ajoute 'dirs' qui liste les tips selon leur direction (déjà fait mais
    stocké nulle part)
  + on ajoute 'cells' qui liste les id des tips liés par cellule
+ les cellules ont en classe les id des tips liés
+ les tips on des ids

+ après ça on code un hover sur les cellules qui highlight les tips liés
+ et un autre sur les tips qui highlight les cellules liées
+ le tout dans une jolie fonction hook, ou bind, enfin de l'io

+ un objet user
+ se déplacer au clavier sur la grille
+ -tab- enter pour changer de dir
+ entrer du texte !
+ backspace et space pour effacer
+ focus sur un clic de souris
+ vrais indices

+ bouton d'erreur
+ fonction de diff avec la solution
+ affichage des erreurs

+ afficher le succès

après:

* refactoring pour pas faire honte à philippe
- version tout en 1 fichier
- rotation alternative (direction d'écriture par les flèches)
- homogénisation des tips : toujours les ombres de mots et leurs indices de
  montrés
- fonction pour générer un crossword + indices à partir d'une usr grid
- d'où vient que je ne puisse pas affecter le comportement par défaut? je dois
  rater un truc
