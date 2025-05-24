# NewtonFractalsDrawer

Ce programme permet de générer dynamiquement la fractale de Newton associée à un polynôme $P \in \mathbb{C}[X]$.  
L’objectif est d’observer en temps réel l’évolution de cette fractale en fonction du polynôme, avec la possibilité de modifier les racines par un système de glisser-déposer (*drag and drop*). La fractale se met alors à jour instantanément.

L’application est accessible via le lien suivant : [ici](https://underplay-chaostheory.github.io/NewtonFractalsDrawer/)

![Image de démo](Demo.png)

---

# Motivation

Ce projet m’a permis de découvrir le langage JavaScript et d’aborder des problématiques liées à l’optimisation des calculs. Deux axes principaux ont guidé mes expérimentations :

- Exploiter les capacités du canevas HTML (*Canvas*) afin de déléguer un maximum de calculs au processeur graphique (GPU) ;
- Expérimenter avec la programmation parallèle.

À ce stade, la seconde approche n’a pas encore donné de résultats satisfaisants.

---

# Utilisation

L’écran représente une portion du plan complexe, sur laquelle figurent les $n$ racines du polynôme.  
Chaque point de ce plan est colorié en fonction de la racine vers laquelle converge la méthode de Newton, lorsqu’on l’applique à ce point.  
En cas de non-convergence, le point est colorié en noir.

Fonctionnalités disponibles :

- **Navigation** dans le plan par glisser-déposer directement sur l’image ;
- **Touches UP / DOWN** : modification du nombre de racines (jusqu’à 30), positionnées par défaut au centre de l’écran ;
- **Molette de la souris** : zoom sur la zone centrée autour du pointeur ;
- **Touche ENTRER** : réinitialise la fractale à son état initial ;
- **Touche ESPACE** : lance une démonstration avec un polynôme de degré 7 ;
- **Touche ÉCHAP** : recharge l’écran ;
- **Informations affichées** sur la droite : données relatives au polynôme, à la portion du plan affichée et aux paramètres de la méthode de Newton (certains, comme le critère d’arrêt, peuvent être modifiés) ;
- **Mode HD (Haute Définition)** : améliore la qualité visuelle des rendus, en dehors des interactions en glisser-déposer, avec un léger temps de calcul supplémentaire ;
- **Mode CR (Convergence Rate)** : ajoute un dégradé aux couleurs selon la vitesse de convergence de la méthode.

---

# À venir

Une amélioration envisagée concerne la **parallélisation des calculs** via une structure de type Union-Find.  
La méthode de Newton appliquée à un point $z$ génère une suite $(z_k)$. L’intuition est que si, au cours du calcul, un point $z_k$ est déjà connu (c’est-à-dire a été traité précédemment), il devient inutile de poursuivre l’itération. En pratique, cela suppose des approximations : un pixel déjà évalué est une estimation d’un terme $z_k$ pour un certain $z_0$.

L’idée serait de **répartir la zone de calcul entre $N$ threads**. Chaque thread appliquerait la méthode de Newton aux points de sa propre région. Si la suite $(z_k)$ sort de cette région, le thread transmet l’information que les éléments la suite de points qu'il vient de calculer appartiennent au même bassin d’attraction, à l’aide d’une structure **Union-Find**.
