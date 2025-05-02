/*
Ce programme a pour but de dessiner la factale de Newton associé à un polynôme P de C[X].

L'écran est une partie du plan complexe, sur lequel aparraissent les n racines qui définissent le polynôme.
Chaque point du complexe est colorié selon la racine vers laquelle converge les itérations de la Méthode de
Newton débutant à ce point.
Dans le cas de non convergence de la méthode, le point sera colorié en noir.

Le but est de pouvoir observer l'évolution de la Fractale de Newton dynamiquement en fonction du polynôme, ce
qui se traduit ici par la possibilité de modifier les racines en Drag'n'Drop, et d'avoir l'actualisation de
la fractale en temp réel.

L'exploration du plan se fait par Drag'n'Drop sur l'image elle-même.

Les touches UP et Down permettent de modifier le nombre de racine, dans un maximum de 30, qui apparaisseront
au centre de l'écran par défaut.

La molette de la souris permet de zoomer sur une zone centrée sur le pointeur de la souris.

La touche ENTRER permet de réinitialiser la fractale à son état par défaut et la touche ESPACE d'avoir une
démonstration pour un polynôme de degré 7.

La touche ECHAP permet de recharger l'écran.

Les informations sur le polynôme, la partie du plan complexe observée et les paramètres de la méthode de
Newton sont affichées à droites, avec la possibilité d'en modifier certaines, telle que le critère d'arrêt.

Le mode HD (Haute Définition) permet d'avoir une image plus précise pour les actions autres que le 
Drag'n'Drop, au prix d'un léger temps de chargement.

Le mode CR (Convergence Rate) ajouter un dégradé aux couleurs en fonction de la vitesse de convergence de la
méthode de Newton pour chaque point
*/

class Complexe{
    /*
    Manipulation de nombre complexe en forme algébrique:
    - Additon
    - Soustraction
    - Multiplication
    - Division
    - Opposission
    - Copie
    - Réinistialisation à 0
    - Affichage
    */
    constructor(a,b){
        this._re = a;
        this._im = b;   
    }

    get re(){
        return this._re;
    }
    set re(x){
        this._re = x;
    }
    get im(){
        return this._im;
    }
    set im(x){
        this._im = x;
    }

    copy(){
        return new Complexe(this._re, this._im);
    }

    add(z){
        this._re += z.re;
        this._im += z.im;
    }
    sub(z){
        this._re -= z.re;
        this._im -= z.im;
    }
    mult(z){
        let x = this._re * z.re - this._im * z.im;
        let y = this._re * z.im + this._im * z.re;
        this._re = x;
        this._im = y;
    }
    div(z){
        if(z.re == 0 && z.im == 0){
            throw new Error("Cannot divide by zero")
        }else{
            let x = (this._re * z.re + this._im * z.im)/(z.re**2 + z.im**2);
            let y = (this._im * z.re - this._re * z.im)/(z.re**2 + z.im**2);
            this._re = x;
            this._im = y;
        }
    }

    oppose(){
        this._re = - this._re;
        this._im = - this._im;
    }

    reset(){
        this._re = 0;
        this._im = 0;
    }

    affiche(){
        return (this._re).toFixed(3) + " + i" + this._im.toFixed(3);
    }
}



function deep_copy(liste){
    //Copie profonde d'une liste d'objet, il faut donc que les éléments de la liste support la méthode copy
    let l = [];
    for (let value of liste){
        l.push(value.copy());
    }
    return l;
}



class Polynome{
    /*
    Manipulation de Polynôme:
    - Evaluation
    - Evaluation de la dérivée
    - Affichage

    Le coefficient de degré i du polynôme est stocké à l'indice i de 'coefficients'.
    */
    constructor(p){
        this.degre = p.length - 1;
        this.coefficients = deep_copy(p);
        this.derivative = [];
        for (let i = 1; i <= this.degre; i++){
            this.derivative[i - 1] = new Complexe(p[i].re * i, p[i].im * i);
        }
    } 

    evaluate(z){
        let p_x = this.coefficients[this.degre].copy();
        for(let i = this.degre - 1; i >= 0; i--){
            p_x.mult(z);
            p_x.add(this.coefficients[i]);
        }
        return p_x;
    }
    
    evaluate_derivative(z){
        if (this.degre == 0){
            return new Complexe(0,0);
        }else{
            let dp_x = this.derivative[this.degre - 1].copy();
            for(let i = this.degre - 2; i >= 0; i--){
                dp_x.mult(z);
                dp_x.add(this.derivative[i]);
            }
            return dp_x;
        }
    }

    affiche(){
        let txt = "P(X) = (" + this.coefficients[0].affiche() + ")";
        for(let i = 1; i <= this.degre; i++){
            txt += " + (" + this.coefficients[i].affiche() + ")X<sup>" + i + "</sup>";
        }
        return txt;
    }
}




function mult(liste, z){
    //on applique mult(z) à chaque élément de la liste de complexe
    for (let value of liste){
        value.mult(z);
    }
}
function add(u1,u2){
    //On additonne terme à terme deux listes de complexe
    let l1 = u1.length;
    let l2 = u2.length;
    if (l1 < l2){
        for(let i = 0; i < l1; i++){
            u1[i].add(u2[i]);
        }
        for(let i = l1; i < l2; i++){
            u1[i] = u2[i]
        }
    }else{
        for(let i = 0; i < l2; i++){
            u1[i].add(u2[i]);
        }
    }
}

function developpement_polynomial(roots){
    //On calcul de la forme développée d'un polynôme à partir d'une liste de complexe représentant les racines d'un polynôme.
    let p = [new Complexe(1,0,)];
    for (let z of roots){
        let temp = deep_copy(p);
        p.unshift(new Complexe(0,0));
        mult(temp,new Complexe(-z.re,-z.im));
        add(p,temp);
    }
    return new Polynome(p);
}

function distance(z1,z2){
    //Distance entre deux complexes
    let x = (z1.re - z2.re)**2 + (z1.im - z2.im)**2
    return Math.sqrt(x);
}



class Roots {
    /*
    Racines du polynôme utilisé par la méthode de Newton.
    A chaque opération, on met à jour la forme développé du polynôme, la couleur associée à chaque racine, et le nombre de racine.
    On actualise de plus la postion et la couleur des racines sur l'écran si nécessaire.

    On peut:
    - Ajouter une racine
    - Supprimer une racine
    - Réinitialiser à la valeur par défaut
    - Mettre à jour la postion d'une racine
    */
    constructor(){
        this._root = [];
        this._color = [];
        this._polynome = null;
        this._nb_root = 0;
    }

    root(){
        return this._root;
    }
    color(){
        return this._color;
    }
    polynome(){
        return this._polynome
    }
    nb_root(){
        return this._nb_root;
    }

    update_color(){
        //Calcul des nb_root couleurs, réparties uniformément sur un arc en ciel
        let step = 40 / (this._nb_root + 1);
        let smoothing = -250;
        this._color = [];
        for(var i = 1; i <= this._nb_root; i++){
            this._color[i-1] = [Math.round(255 * Math.exp((step*i-5)**2 / smoothing)),
                            Math.round(255 * Math.exp((step*i-20)**2 / smoothing)),
                            Math.round(255 * Math.exp((step*i-35)**2 / smoothing))]
        }
    }

    append(center, width, height){
        if(this._nb_root < 30){
            this._nb_root += 1;
            this.update_color();

            let element = document.createElement("p");
            element.appendChild(document.createTextNode(this._nb_root-1));
            document.body.appendChild(element);
            element.setAttribute("id","racine" + (this._nb_root-1));
            element.setAttribute("class", "racine");
            element.style.left = (width / 2 - 10) + "px";
            element.style.top = (height / 2 - 10) + "px";
            element.ondragstart = function(){
                return false;
            };
            element.addEventListener("mousedown", drag);

            for(let i = 0; i < this._nb_root; i++){
                document.getElementById("racine" + i).style.backgroundColor = "rgb(" + this._color[i][0] + "," + this._color[i][1] + "," + this._color[i][2] + ")";
            }

            this._root.push(new Complexe(center[0],center[1]));
            this._polynome = developpement_polynomial(this._root);
            console.log("Polynome : ", this._polynome.affiche());
        }     
    }

    pop(){
        if(this._nb_root > 0){
            this._nb_root -= 1;
            document.getElementById("racine" + this._nb_root).remove();
            this._root.pop();
            this._color.pop();
            this._polynome = developpement_polynomial(this._root);
            console.log("Polynome : ", this._polynome.affiche());
        }
    }

    reset(){
        for(let id = 0; id < this._nb_root; id++){
            document.getElementById("racine" + id).remove();
        }
        this._nb_root = 0;
        this._root = [];
        this._color = [];
        this._polynome = [];
        console.log("reset");
    }

    update_root(i,x,y){
        if (0 <= i && i < this._nb_root){
            this._root[i].re = x;
            this._root[i].im = y;
            this._polynome = developpement_polynomial(this._root);
            console.log("Polynome : ", this._polynome.affiche());
        }
    }
}



class Coordinates{
    /*
    Partie du plan complexe considéré par l'utilisateur.

    La description des méthodes est donnée dans leur définition.
    */
    constructor(center,x_width,y_width){
        this._center = center;
        this._xwidth = x_width;
        this._ywidth = y_width;
    }

    plane_to_viewport(x,y,width,height){
        //Associe un point du plan complexe à un pixel de l'écran
        let vector = [x - this._center[0], y - this._center[1]];
        let scale = [width / this._xwidth, height / this._ywidth];
        return [ width / 2 + scale[0] * vector[0], height / 2 - scale[1] * vector[1]];
    }

    viewport_to_plane(x,y,width,height){
        //Associe un pixel de l'écran à un point du plan comlpexe
        let vector = [x - width / 2, y - height / 2];
        let scale = [this._xwidth / width, this._ywidth / height];
        return [this._center[0] + scale[0] * vector[0], this._center[1] - scale[1] * vector[1]];
    }

    update_view_root(width, height){
        // Actualise la position de toutes les racines sur l'écran, les cachent si elle en sortent
        const n = roots.nb_root();
        for(let i = 0; i < n; i++){
            let position = this.plane_to_viewport(roots.root()[i].re,roots.root()[i].im,width,height);
            let racine = document.getElementById("racine" + i);
            if(0 < position[0] && position[0] < width - 30  &&  0 < position[1] && position[1] < height - 30){
                racine.style.visibility = "visible";
                racine.style.left = position[0] + "px";
                racine.style.top = position[1] + "px";
            }else{
                racine.style.visibility = "hidden";
            }  
        }
    }

    get center(){
        return this._center;
    }
    set center(point){
        this._center = point;
    }
    get xwidth(){
        return this._xwidth;
    }
    set xwidth(x){
        this._xwidth = x;
    }
    get ywidth(){
        return this._ywidth;
    }
    set ywidth(y){
        this._ywidth = y;
    }

    shift_center(xshift, yshift){
        //Déplace le centre de la partie du plan complexe par le vecteur fournis
        this._center[0] += xshift;
        this._center[1] += yshift;
    }

    move_center(x_dir,y_dir,width,height){
        //Déplace le centre du plan complexe vers la direction donnée,
        //d'une distance proportionnel à la norme du vecteur de déplacement
        let pointeur = this.viewport_to_plane(x_dir,y_dir,width,height);
        let direction = [pointeur[0] - this._center[0], pointeur[1] - this._center[1]];

        this._center[0] += direction[0] * 0.1;
        this._center[1] += direction[1] * 0.1;
    }

    rescale_xwidth(scaling){
        this._xwidth += scaling;
    }
    rescale_ywidth(scaling){
        this._ywidth += scaling;
    }

    reset(){
        this._center = [0,0];
        this._xwidth = 20;
        this._ywidth = 20;
    }

}



class UI{
    /*
    Gestion de :
    - la zone d'information et des événements.
    - la possibilité de changer la valeur de epsilon et itermax par une saisie.
    - mode haute résolution 
    */
    proximity(z, unused, roots){
        //test si le complexe z se trouve à un distance inférieur à epsilon d'une racine
        let close = null;
        let n = roots.length;
        for(let i = 0; i < n && !close; i++){
            if (distance(z, roots[i]) < this._epsilon){
                close = i;
            }
        }
        return close;
    }

    step(z1, z2, roots){
        //text si la distance entre x_k+1 et x_k est inférieur à epsilon, si oui renvois la racine la plus proche de x_k+1
        let k = 1;
        if(distance(z1,z2) < this._epsilon){
            return this.proximity(z1, k, roots);
        }else{
            null;
        }
    }


    constructor(){
        this._iterationMax = 50;
        this._epsilon = Math.min(25 * plan_complexe.xwidth / width, 25 * plan_complexe.ywidth / height);
        this._stopRule = this.proximity;
        this._modeHD = false;
        this._modeCR = false;
    }

    get iterationMax(){
        return this._iterationMax;
    }
    set iterationMax(n){
        this._iterationMax = n;
    }
    get epsilon(){
        return this._epsilon;
    }
    set epsilon(e){
        this._epsilon = e;
    }
    get stoprule(){
        return this._stopRule;
    }
    set stoprule(f){
        this._stopRule = f;
    }
    get modeHD(){
        return this._modeHD;
    }
    set modeHD(bool){
        this._modeHD = bool;
    }
    get modeCR(){
        return this._modeCR;
    }
    set modeCR(bool){
        this._modeCR = bool;
    }


    updateSettings(){
        //On actualise les champs 'Iteration max' et 'Epsilon'
        document.getElementById("choseItermax").value = this._iterationMax;
        document.getElementById("choseEpsilon").value = (this._epsilon).toFixed(5);
    }

    setElementSize(){
        //Calcul la taille des deux zones d'affichage pour éviter les chevauchements
        let canvas = document.getElementById("zoneAffichage");
        canvas.width = width;
        canvas.height = height;

        let image = document.getElementById("image");
        image.style.width = width + "px";

        let wrapper = document.getElementById("information");
        wrapper.style.width = window.innerWidth - width + "px";
        wrapper.style.left = width + "px";
    }

    updateInfoPolynomial(){
        //On actualise les champs 'Polynome' et 'Racines'
        document.getElementById("displayPolynomial").innerHTML = roots.polynome().affiche();
        let root_liste = "";
        let n = roots.root().length;
        for (let i = 0; i < n - 1; i++){
            root_liste += roots.root()[i].affiche() + ", "
        }
        document.getElementById("displayRoots").innerHTML = root_liste + roots.root()[n - 1].affiche();
    }

    updateInfoPlan(){
        //On actualise les informations relatives à la partie du plan complexe étudiée
        let left = (plan_complexe.center[0] - plan_complexe.xwidth / 2).toFixed(2);
        let rigth = (plan_complexe.center[0] + plan_complexe.xwidth / 2).toFixed(2);
        let top = (plan_complexe.center[1] - plan_complexe.ywidth / 2).toFixed(2);
        let bot = (plan_complexe.center[1] + plan_complexe.ywidth / 2).toFixed(2);
        document.getElementById("displayTopleft").innerHTML = "(" + left + ";" + top + ")";
        document.getElementById("displayTopright").innerHTML = "(" + rigth + ";" + top + ")";
        document.getElementById("displayCenter").innerHTML = "(" + plan_complexe.center[0].toFixed(2) + ";" + plan_complexe.center[1].toFixed(2) + ")";
        document.getElementById("displayBottomleft").innerHTML = "(" + left + ";" + bot + ")";
        document.getElementById("displayBottomright").innerHTML = "(" + rigth + ";" + bot + ")";

        document.getElementById("choseWidth").value = plan_complexe.xwidth.toFixed(5);
        document.getElementById("choseHeight").value = plan_complexe.ywidth.toFixed(5);
    }
    

    setEventListener(){
        //On crée les événements et leurs actions
        let element = document.getElementById("zoneAffichage");
        window.addEventListener("keyup", action_manager);
        element.addEventListener("wheel", zoom, {passive: false});
        element.addEventListener("mousedown", drag);

        element = document.getElementById("choseWidth");
        element.addEventListener("focusout", (event) => {
            let x = parseFloat(document.getElementById("choseWidth").value);
            if(!isNaN(x) && x > 0){
                plan_complexe.xwidth = x;
                this.updateInfoPlan();
                this._epsilon = Math.min(25 * plan_complexe.xwidth / width, 25 * plan_complexe.ywidth / height);
                this.updateSettings();
                update_view(0, 0, width, height, width, height, false);
            }
            console.log("Width : ", plan_complexe.xwidth);
        });

        element = document.getElementById("choseHeight");
        element.addEventListener("focusout", (event) => {
            let y = parseFloat(document.getElementById("choseHeight").value);
            if(!isNaN(y) && y > 0){
                plan_complexe.ywidth = y;
                this.updateInfoPlan();
                this._epsilon = Math.min(25 * plan_complexe.xwidth / width, 25 * plan_complexe.ywidth / height);
                this.updateSettings();
                update_view(0, 0, width, height, width, height, false);
            }
            console.log("Width : ", plan_complexe.ywidth);
        });

        element = document.getElementById("choseItermax");
        element.addEventListener("focusout", (event) => {
            let n = parseInt(document.getElementById("choseItermax").value);
            if(!isNaN(n) && n > 0){
                this._iterationMax = n;
            }
            console.log("Itermax : ", this._iterationMax);
        });

        element = document.getElementById("choseEpsilon");
        element.addEventListener("focusout", (event) => {
            let e = parseFloat(document.getElementById("choseEpsilon").value);
            if(!isNaN(e) && e > 0){
                this._epsilon = e;
            }
            console.log("Epsilon : ", this._epsilon);
        });

        element = document.getElementById("step");
        element.addEventListener("click", (event) => {
            this._epsilon = 0.01;
            this._stopRule = this.step;
            console.log("Mode : step");
            this.updateSettings();
        });

        element = document.getElementById("proximity");
        element.addEventListener("click", (event) => {
            this._epsilon = Math.min(25 * plan_complexe.xwidth / width, 25 * plan_complexe.ywidth / height);
            this._stopRule = this.proximity;
            console.log("Mode : proximity");
            this.updateSettings();
        });

        element = document.getElementById("resetEpsilon");
        element.addEventListener("click", (event) => {
            this._epsilon = Math.min(25 * plan_complexe.xwidth / width, 25 * plan_complexe.ywidth / height);
            console.log("Epsilon : ", this._epsilon);
            this.updateSettings();
        });

        element = document.getElementById("HDMode");
        element.addEventListener("click", (event) => {
            this._modeHD = document.getElementById("HDMode").checked;
            console.log("Mode hd : ", this._modeHD);
        });

        element = document.getElementById("CRMode");
        element.addEventListener("click", (event) => {
            this._modeCR = document.getElementById("CRMode").checked;
            console.log("Mode cr : ", this._modeCR);
        });
    }

    
    reset(){
        this._iterationMax = 50;
        this._stopRule = this.proximity;
        this._modeCR = false;

        this.updateInfoPolynomial();
        this.updateInfoPlan();
        this._epsilon = Math.min(25 * plan_complexe.xwidth / width, 25 * plan_complexe.ywidth / height);
        this.updateSettings();
    }


    start(){
        this._stopRule = this.proximity;
        this._modeCR = false;   

        this.setElementSize();
        this.setEventListener();
        

        roots.append([5,0], width, height);
        roots.append([-3,2], width, height);
        roots.append([-3,-2], width, height);
        plan_complexe.update_view_root(width, height);
        update_view(0, 0, width, height, width, height, false);

        this.updateInfoPolynomial();
        this.updateInfoPlan();
        this.updateSettings();
    }
}



var width = Math.floor(window.innerWidth * 2 / 3);
var height = Math.floor(window.innerHeight);
var resolutionFactor = 2;

var roots = new Roots;
var plan_complexe = new Coordinates([0,0],20,20);
var interface = new UI;

function start(){
    interface.start();
}




function drag(event){
    //Drag'n'Drop
    //On actualise la / les racines et l'écran dynamiquement

    event.preventDefault();
    const target = event.target.id;

    //Si on déplace une racine
    if(target.substring(0,6) == "racine"){
        const id = parseInt(target.substring(6));
        const racine = document.getElementById(target);

        console.log("Moving " + id);

        racine.style.zIndex = 200;
        racine.style.cursor = "grabbing";
        //On souhaite que la souris reste sur le même point de la figure représentant la racine lors du déplacement
        let shiftX = event.clientX - racine.getBoundingClientRect().left;
        let shiftY = event.clientY - racine.getBoundingClientRect().top;

        function moveAt(pageX,pageY){
            racine.style.left = pageX - shiftX + "px";
            racine.style.top = pageY - shiftY + "px";
            let complexe = plan_complexe.viewport_to_plane(racine.getBoundingClientRect().left, racine.getBoundingClientRect().top, width, height);

            //On actualise la racine, le polynôme et l'écran
            roots.update_root(id, complexe[0], complexe[1]);
            update_view(0, 0, width, height, width, height, true);
            interface.updateInfoPolynomial();
        }
        moveAt(event.pageX,event.pageY);
    
        function onMouseMove(event){
            moveAt(event.pageX,event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        racine.onmouseup = function(event){
            document.removeEventListener("mousemove", onMouseMove);
            racine.onmouseup = null;
            racine.style.zIndex = 100;
            racine.style.cursor = "grab";
            update_view(0, 0, width, height, width, height, false);
        }
    }

    //Si on déplace la toile
    if(target == "zoneAffichage"){
        const canvas = document.getElementById("zoneAffichage");
        let contexte = canvas.getContext("2d");
        canvas.style.cursor = "grabbing";
        let initX = event.pageX;
        let initY = event.pageY;

        //console.log("Moving canvas");

        function moveAt(pageX,pageY){
            let deltaX = pageX - initX;
            let deltaY = pageY - initY;

            //On actualise le centre et les racines
            //Le centre se déplace de façon opposé au veteur directeur du déplacement 
            plan_complexe.shift_center((-deltaX) * plan_complexe.xwidth / width, deltaY * plan_complexe.ywidth / height);
            plan_complexe.update_view_root(width, height);
            
            //On déplace la partie qui reste présente sur l'image finale, et on calcule les nouveau point.
            if(deltaX < 0){
                if (deltaY < 0){
                    contexte.drawImage(canvas, - deltaX, - deltaY, width + deltaX, height + deltaY, 0, 0, width + deltaX, height + deltaY);
                    update_view(0, height + deltaY, width + deltaX, - deltaY, width, height, true);
                    update_view(width + deltaX, 0, - deltaX, height, width, height, true);
                } else if (deltaY == 0){
                    contexte.drawImage(canvas, - deltaX, 0, width + deltaX, height, 0, 0, width + deltaX, height);
                    update_view(width + deltaX, 0, - deltaX, height, width, height, true);
                } else if (deltaY > 0){
                    contexte.drawImage(canvas, - deltaX, 0, width + deltaX, height - deltaY, 0, deltaY, width + deltaX, height - deltaY);
                    update_view(0, 0, width + deltaX, deltaY, width, height, true);
                    update_view(width + deltaX, 0, - deltaX, height, width, height, true);
                }
            } else if (deltaX == 0){
                if (deltaY < 0){
                    contexte.drawImage(canvas, 0, - deltaY, width, height + deltaY, 0, 0, width, height + deltaY);
                    update_view(0, height + deltaY, width, - deltaY, width, height, true);
                }else if(deltaY > 0){
                    contexte.drawImage(canvas, 0, 0, width, height - deltaY, 0, deltaY, width, height -deltaY);
                    update_view(0, 0, width, deltaY, width, height, true);
                }
            } else if (deltaX > 0) {
                if (deltaY < 0){
                    contexte.drawImage(canvas, 0, - deltaY, width - deltaX, height + deltaY, deltaX, 0, width - deltaX, height + deltaY);
                    update_view(0, 0, deltaX, height + deltaY, width, height, true);
                    update_view(0, height + deltaY, width, - deltaY, width, height, true);
                } else if (deltaY == 0){
                    contexte.drawImage(canvas, 0, 0, width - deltaX, height, deltaX, 0, width - deltaX, height);
                    update_view(0, 0, deltaX, height, width, height, true);
                } else if (deltaY > 0) {
                    contexte.drawImage(canvas, 0, 0, width - deltaX, height - deltaY, deltaX, deltaY, width - deltaX, height - deltaY);
                    update_view(0, 0, deltaX, height, width, height, true);
                    update_view(deltaX, 0, width - deltaX, deltaY, width, height, true);
                }
            }

            initX = pageX;
            initY = pageY;
            interface.updateInfoPlan();
        }
    
        function onMouseMove(event){
            //console.log("Deplacement : ", event.pageX - initX, " ", event.pageY - initY);
            moveAt(event.pageX,event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        canvas.onmouseup = function(){
            document.removeEventListener("mousemove", onMouseMove);
            canvas.onmouseup = null;
            canvas.style.cursor = "default";
            update_view(0, 0, width, height, width, height, false);
        }
    }
}

function action_manager(key){
    //gestion des raccourcis
    if (key.code === "ArrowUp"){
        roots.append(plan_complexe.center, width, height);
        update_view(0, 0, width, height, width, height, true);
        interface.updateInfoPolynomial();
    }
    if (key.code === "ArrowDown"){
        roots.pop();
        update_view(0, 0, width, height, width, height, true);
        interface.updateInfoPolynomial();
    }
    if (key.code === "Enter"){
        plan_complexe.reset();
        roots.reset();
        roots.append([5,0], width, height);
        roots.append([-3,2], width, height);
        roots.append([-3,-2], width, height);
        plan_complexe.update_view_root(width, height);
        update_view(0, 0, width, height, width, height, false);
        interface.reset();
    }
    if (key.code === "Space"){
        plan_complexe.reset();
        roots.reset();
        interface.reset();
        roots.append([0,0], width, height);
        roots.append([2.5,4.33], width, height);
        roots.append([-2.5,4.33], width, height);
        roots.append([-5,0], width, height);
        roots.append([-2.5,-4.33], width, height);
        roots.append([2.5,-4.33], width, height);
        roots.append([5,0], width, height);
        plan_complexe.update_view_root(width, height);
        update_view(0, 0, width, height, width, height, false);
    }
    if (key.code === "Escape"){
        plan_complexe.update_view_root(width, height);
        update_view(0, 0, width, height, width, height, false);
    }
}

function zoom(scroll){
    //Zoome sur le pointeur de la souris
    plan_complexe.rescale_xwidth(scroll.deltaY * plan_complexe.xwidth / 1020);
    plan_complexe.rescale_ywidth(scroll.deltaY * plan_complexe.ywidth / 1020);

    let x = scroll.clientX;
    let y = scroll.clientY;
    plan_complexe.move_center(x,y,width,height);

    console.log({center:plan_complexe.center, xwidth:plan_complexe.xwidth, ywidth:plan_complexe.ywidth, width:width, height:height});

    plan_complexe.update_view_root(width, height);
    update_view(0, 0, width, height, width, height, false);
    interface.updateInfoPlan(); 
    let new_eps = Math.min(30 * plan_complexe.xwidth / width, 30 * plan_complexe.ywidth / height);
    if(new_eps < interface.epsilon){
        interface.epsilon = new_eps;
        interface.updateSettings();
    }
}



function update_view(topleftx, toplefty, width, height, canvaswidth, canvasheight, optimized){

    //Mise à jour de l'écran en créant une toile vide et en la remplissant par la Fractale de Newton du polynôme courant
    let canvas = document.getElementById("zoneAffichage");
    let context = canvas.getContext("2d");
    
    //Si on est en mode HD, on crée un image plus grande, que l'on 'downscale' à la fin
    if(!optimized && interface.modeHD){
        console.log("Use of buffer");
        width = width * resolutionFactor;
        height = height * resolutionFactor;
        canvaswidth = canvaswidth * resolutionFactor;
        canvasheight = canvasheight * resolutionFactor;
        let buffer = document.getElementById("buffer");
        buffer.width = width;
        buffer.height = height;
        context = buffer.getContext("2d");
    }

    let image = context.createImageData(width, height);
    let data = image.data;

    let botrightx = width + topleftx;
    let botrighty = height + toplefty;
    
    for(let x = 0; x < width; x++){
        for(let y = 0; y < height; y++){
            //pas besoin de lancer la méthode de newton sur un point déjà étudié
            if(data[(y * width + x) * 4 + 3] == 0){
                let sequence = [(y * width + x) * 4];
                let depart = plan_complexe.viewport_to_plane(x + topleftx, y + toplefty, canvaswidth, canvasheight);

                //On applique la méthode de newton
                let z1 = new Complexe(depart[0],depart[1]);
                let z2;
                let stop = false;
                let root = null;let color = [0,0,0];let it = 0;
                let point;let pixel;let abscisse;let ordonnee;

                let k = 0;
                while(!stop && k < interface.iterationMax){
                    if(k%2 == 0){
                        z2 = roots.polynome().evaluate(z1);
                        z2.div(roots.polynome().evaluate_derivative(z1));
                        z2.sub(z1);
                        z2.oppose();

                        //Prend le numéro da la racine se trouvant à moins de epsilon de z, si elle existe
                        //La règle d'arrêt est récupéré dans interface
                        root = (interface.stoprule)(z2, z1, roots.root());
                        if (root != null) {
                            stop = true;

                            //On récupère la couleur de la racine vers la quelle la méthode converge
                            color = roots.color()[root];
                        }

                        //On stocke le point de l'écran correspondant à ce complexe
                        point = plan_complexe.plane_to_viewport(z2.re, z2.im, canvaswidth, canvasheight);
                    } else {
                        z1 = roots.polynome().evaluate(z2);
                        z1.div(roots.polynome().evaluate_derivative(z2));
                        z1.sub(z2);
                        z1.oppose();

                        root = (interface.stoprule)(z1, z2, roots.root());
                        if (root != null) {
                            stop = true;
                            color = roots.color()[root];
                        }

                        point = plan_complexe.plane_to_viewport(z1.re, z1.im, canvaswidth, canvasheight);
                    }

                    //On vérifie que le point se trouve dans la fenêtre étudié
                    abscisse = Math.round(point[0]);
                    ordonnee = Math.round(point[1]);
                    if (topleftx <= abscisse && abscisse < botrightx && toplefty <= ordonnee && ordonnee < botrighty) {
                        pixel = 4 * ((ordonnee - toplefty) * width + abscisse - topleftx);

                        //Si le pixel à déjà été colorié, pas besoin de l'ajouter
                        //* Amélioration très efficace aux prix d'une perte de résolution
                        if (data[pixel + 3] != 0 && optimized){
                            stop = true;

                            //On récupère la couleur
                            color = [data[pixel],data[pixel+1],data[pixel+2]];
                        } else {
                            if(optimized){
                                sequence.push(pixel);
                            }
                        }
                    }
                    k++;
                }
                
                //Coloration des points parcourus par la méthode de Newton. La couleur appliquée est celle associée à la racine la plus proche
                if(k >= interface.iterationMax){
                    color = [0,0,0];
                }

                let nb_point = sequence.length;
                for(let i = 0; i < nb_point; i++){
                    if(interface.modeCR && !optimized){
                        let darkness = 1 / (1 + Math.exp(0.12 * (k - 18))) + 0.1;
                        data[sequence[i]] = Math.floor(color[0] * darkness);
                        data[sequence[i] + 1] = Math.floor(color[1] * darkness);
                        data[sequence[i] + 2] = Math.floor(color[2] * darkness);
                        data[sequence[i] + 3] = 255;
                    }else{
                        data[sequence[i]] = color[0]
                        data[sequence[i] + 1] = color[1]
                        data[sequence[i] + 2] = color[2]
                        data[sequence[i] + 3] = 255; 
                    }                 
                }
            }
        }
    }

    //On affiche le résultat
    if(!optimized && interface.modeHD){
        context.putImageData(image, topleftx, toplefty);
        context = canvas.getContext("2d");
        context.scale(1 / resolutionFactor, 1 / resolutionFactor);
        context.drawImage(buffer, topleftx, toplefty);
        context.scale(resolutionFactor, resolutionFactor);
    } else {
        context.putImageData(image, topleftx, toplefty);
    }
}