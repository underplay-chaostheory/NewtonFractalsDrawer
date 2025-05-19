# NewtonFractalsDrawer
Ce programme dessine la fractale de Newton associé à un polynôme P de C[X] de façon dynamique.
Le but est de pouvoir observer l'évolution de la Fractale de Newton dynamiquement en fonction du polynôme, ce qui se traduit ici par la possibilité de modifier les racines en Drag'n'Drop, et d'avoir l'actualisation de la fractale en temps réel.
Le lien permettant d'accéder à l'application est fourni.

![Image de démo](Demo.png)

# Motivation
Ce projet m’a permis d’appréhender JavaScript et de réfléchir sur des problématiques d’optimisation des calculs. Deux approches ont concentré mes efforts :
- profiter des spécificité des objets Canvas en html pour faire exécuter un maximum de calcul par la carte graphique
- utiliser la programmation parallèle

La seconde solution n’a pour l’instant pas donné de résultats concluants.

# Utilisation
L'écran est une partie du plan complexe, sur lequel apparaissent les n racines qui définissent le polynôme.
Chaque point du complexe est colorié selon la racine vers laquelle converge les itérations de la Méthode de Newton débutant à ce point.
Dans le cas de non convergence de la méthode, le point sera colorié en noir.

- L'exploration du plan se fait par Drag'n'Drop sur l'image elle-même.

- Les touches UP et DOWN permettent de modifier le nombre de racine, dans un maximum de 30, qui apparaîtront au centre de l'écran par défaut.

- La molette de la souris permet de zoomer sur une zone centrée sur le pointeur de la souris.

- La touche ENTRER permet de réinitialiser la fractale à son état par défaut et la touche ESPACE d'avoir une
démonstration pour un polynôme de degré 7.

- La touche ECHAP permet de recharger l'écran.

- Les informations sur le polynôme, la partie du plan complexe observée et les paramètres de la méthode de
Newton sont affichées à droites, avec la possibilité d'en modifier certaines, telle que le critère d'arrêt.

- Le mode HD (Haute Définition) permet d'avoir une image plus précise pour les actions autres que le 
Drag'n'Drop, au prix d'un léger temps de chargement.

- Le mode CR (Convergence Rate) ajouter un dégradé aux couleurs en fonction de la vitesse de convergence de la
méthode de Newton pour chaque point

# A venir

Tentative de parallélisation des calculs en utilisant une structure de données Union-Find.
La méthode de Newton appliquée à un point z fourni une suite de point (z)<sub>k</sub>. Une idée fondamentale pour accélérer les calculs est que si au cours du calcul de (z)<sub>k</sub>, on tombe sur un point déjà calculé, il n’est pas nécessaire de continuer le calcul. En pratique, cela introduit des approximations : un pixel déjà étudié est une approximation d’un élément de (z<sub>0</sub>)<sub>k</sub> pour un certain z<sub>0</sub>.
L’idée serait de diviser la zone de calcul sur N thread. Chaque thread applique la méthode de Newton sur les points de sa zone, et si lors d’un calcul, la suite (z)<sub>k</sub> sort de cette zone, le thread fait remonter l’information que tous ces points appartiennent au même bassin d’attraction (implémenter par une structure Union-Find).
