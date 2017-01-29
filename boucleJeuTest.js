//setInterval fonction en milliseconde s'execute tout les xIntervaldonné
//initialisation de 1 seconde (1000ms)
//définition du nombre d'image par seconde fps = 60
//interval de temps  est exécuté setInterval tick = seconde/fps
var seconde = 1000, fps = 60, tick = seconde/fps;
//Appelle l'élément html zoneJeu
var zoneJ = $(".zoneJeu");
//initialisation globalle de la balle et des joueurs
var balle, joueur2, joueur1;
//pause : définit si le jeu est en pause ou non
//pauseCode : variable ayant pour objectif de récupérer le code de la touche P
var pause = true, pauseCode = 0;

//Permet la récupération du code de la touche clavier appuyée
//Et permet de mettre en pause le jeu quand on appuie sur la touche P;
$("body").on("keydown", function noName() {
  joueur1._code =  event.keycode || event.which;
  joueur2._code =  event.keycode || event.which;
  pauseCode = event.keycode || event.which;
  if (pauseCode === 80) {
    if (pause === true) {
      pause = false;
    }
    else {
      pause = true;
    }
    pauseCode = 0;
    $(".infoDepart").hide();
    $(".infoIG").show();
  }
});

//Remet à 0 les variable de code de touche des joueurs
$("body").on("keyup",function(){
  joueur1._code = 0;
  joueur2._code = 0;
});

//Fonction Random
//Renvoi une valeur entre 0 inclus et 1 exclus. Exemple: 0.7280822143439332
function getRand(){
  return Math.random();
}

//Méthode qui met en pause le jeu quand on clique sur le bouton s'y référant
$("#pause").click(function(){
  if (pause === true) {
    pause = false;
  }
  else {
    pause = true;
  }
  $(".infoDepart").hide();
  $(".infoIG").show();
});

//Initialisation du jeux;
//Permet de créer tout les paramètres et tout les éléments de base du jeu
function init(){
  $(".infoIG").hide();
  //Instanciation de la balle
  balle = Object.create(classBalle);
  balle._zoneJ = zoneJ; //Récupération de la balise de la zone de jeu
  //Appel de son constructeur
  balle.constructeur(40,40,2,"white","#949494", "#ffffff" , "premierObjet", "", 0, 0, 4);
  //Création de l'élément HTML
  balle.fabriquerElement();

  //Initialisation du joueur 1
  joueur1 = Object.create(classJoueur);
  //Appel de son constructeur
  joueur1.constructeur(160, 40,1, "#cc0000", "#710404" , "red", "J1Bloc", "", 200, 30 ,20);
  //Définition du codes de touches Haut et Bas
  joueur1._up = 81;    //81 correspond à la touche 'Q'
  joueur1._down = 68;  //68 correspond à la touche 'D'
  joueur1._limiteHaute = -40;
  joueur1._limiteBasse = 700;
  //Création de l'élément HTML
  joueur1.fabriquerElement();

  //Initialisation du joueur 2
  joueur2 = Object.create(classJoueur);
  //Appel de son contrcuteur
  joueur2.constructeur(160, 40,1, "#0618bd", "black" , "#0100ff", "J2Bloc", "", 60, zoneJ.width()-80 ,20);
  //Définition du codes de touches Haut et Bas
  joueur2._up = 100;   //52 correspond à la touche '4' du pavé numérique
  joueur2._down = 102; //54 correspond à la touche '6' du pavé numérique
  joueur2._limiteHaute = -200;
  joueur2._limiteBasse = 540;
  //Création de l'élément HTML
  joueur2.fabriquerElement();
  //Redéfinition de la méthode collide pour le joueur2
  //Ne peut être fait que la ou à été instancié l'objet
  joueur2.collideJ2 = function(objetExt){
    if (((objetExt.getX()+objetExt.getLongueur()) >= (this.getX())) && ((objetExt.getY()+this._limiteHaute)< this.getY()+this.getHauteur()) && ((objetExt.getY()+objetExt.getHauteur()+this._limiteHaute)>=(this.getY())) /*&& (objetExt.getX()+objetExt.getLongueur()<this.getX()+this.getLongueur())*/) {
      if (this._inBox !==true) {
        this.vitesseBalle(objetExt);
        objetExt._incrementX *= -1;
        if (this.getX()-objetExt.getX()<5) {
          objetExt._incrementY *= -1;
        }
        this._inBox = true;
      }
    }
    else {
      this._inBox = false;
    }
  };
  //Place la balle au centre de l'écran
  balle.resetBallPosition();

  balle.departBalle();
}

$(document).ready(function(){

  //Appel de la fonction init
  init();

  //Boucle de jeux
  //Dépend du nombre de fps qui est determiné
  //par le nombre de tick par seconde
  //Appelle les méthode update et draw
  setInterval(function () {
    if (pause=== false) {
      update();
      draw();
    }
  }, tick );

  //Méthode de mise à jour des éléments visuels
  function draw(){
      balle.draw();
      joueur1.draw();
      joueur2.draw();
  }

  //Méthode de mise à jour des variables
  function update(){
    joueur1.update();
    joueur2.update();
    balle.update();
    joueur1.collide(balle);
    joueur2.collideJ2(balle);
    $("#J1").html(balle._scoreJ1);
    $("#J2").html(balle._scoreJ2);
  }
});

//Objet Bloc
//Permet la création d'élements html
//Avec quelques paramètre css;
var objetBloc = {
  //Champs
  _hauteur : 0,       //hauteur de l'élément
  _longueur : 0,      //longueur de l'élément
  _planZ : 0,         //plan sur l'axe Z de l'élément:
  _id : "",           //id de la balide html
  _couleurFond : "",      //background-color de l'élément
  _couleurInt : "",      //shadow inset color de l'élément
  _couleurExt : "",      //shadow color de l'élément
  _positionInit : "", //position de l'élément par rapport à la zone de jeu
  _x : 0,             //valeur X de l'objet
  _y : 0,             //valeur Y de l'objet
  _incrementX : 1,    //Facteur d'incrementation de X
  _incrementY : 1,    //Facteur d'incrementation de Y
  _scoreJ1 : 0,       //Score du joueur 1
  _scoreJ2 : 0,       //Score du joueur 2
  //Propriétés
  getHauteur : function getH(){
    return this._hauteur;
  },
  setHauteur : function setH(val){
    this._hauteur = val;
  },
  getLongueur : function getW(){
    return this._longueur;
  },
  setLongueur : function setW(val){
    this._longueur = val;
  },
  getZindex : function getZ(){
    return this._planZ;
  },
  setZindex : function setZ(val){
    this._planZ = val;
  },
  getID : function getId(){
    return this._id;
  },
  setID : function setId(val){
    this._id = val;
  },
  getCouleur : function getCol(){
    return this._couleurFond;
  },
  setCouleur : function setCol(val){
    this._couleurFond = val;
  },
  getCouleurInt : function getColIn(){
    return this._couleurInt;
  },
  setCouleurInt : function setColIn(val){
    this._couleurInt = val;
  },
  getCouleurExt : function getColEx(){
    return this._couleurExt;
  },
  setCouleurExt : function setColEx(val){
    this._couleurExt = val;
  },
  getFloat : function getFlo(){
    return this._positionInit;
  },
  setFloat : function setFlo(val){
    this._positionInit = val;
  },
  getX : function getX(){
    return this._x;
  },
  setX : function setX(val){
    this._x = val;
  },
  getY : function getY(){
    return this._y;
  },
  setY : function setY(val){
    this._y = val;
  },
  getIncrementX : function getIncrementX(){
    return this._incrementX;
  },
  setIncrementX : function setIncrementX(val){
    this._incrementX = val;
  },
  getIncrementY : function getIncrementY(){
    return this._incrementY;
  },
  setIncrementY : function setIncrementY(val){
    this._incrementY = val;
  },
  getScoreJ1 : function getScoreJ1(){
    return this._scoreJ1
  },
  setScoreJ1 : function setScoreJ1(val){
    this._scoreJ1 = val;
  },
  getScoreJ2 : function getScoreJ2(){
    return this._scoreJ2
  },
  setScoreJ2 : function setScoreJ2(val){
    this._scoreJ2 = val;
  },
  //Constructeur
  //Initialise les propriétés de l'objet
  //Prend en paramètres les élements css, html, js
  constructeur : function construit(height,width,deep,colorFond, colorShadowInt, colorShadowExt,id, float, y, x, vit){
    this._hauteur = height;
    this._longueur = width;
    this._planZ = deep;
    this._couleurFond = colorFond;
    this._couleurInt = colorShadowInt;
    this._couleurExt = colorShadowExt;
    this._id = id;
    this._positionInit = float;
    this._x = x;
    this._y = y;
    this._incrementX = vit;
    this._incrementY = vit;
  },
  //Construit le bloc HTML
  fabriquerElement : function fabrique(){
    var elem = document.createElement("div");
    elem.setAttribute("id", this._id);
    zoneJ.append(elem);
    this.defCss("height", this._hauteur);
    this.defCss("width", this._longueur);
    this.defCss("z-index", this._planZ);
    this.defCss("background-color", this._couleurFond);
    this.defCss("position", "relative");
    this.defCss("box-shadow", "inset 1px 1px 40px "+this.getCouleurInt() +", 0 0 75px -3px "+this.getCouleurExt());
    this.defCss("border", "1px solid black")
    if (this._positionInit === "right" || this._positionInit === "left") {
      this.defCss("float", this._positionInit);
    }
  },
  //Permet de faciliter la création de paramètres css.
  defCss : function defineCss(parametre, valeur){
    var getelem = $("#"+this._id);
    getelem.css(parametre, valeur);
  },
  //Mise à jour parametres de l'objet en appelant les méthodes appropriée
  update : function update(){

  },
  //Mise à jour Graphique de l'objet
  draw : function dessiner(){
    $("#"+this.getID()).css("left", this.getX()+"px");
    $("#"+this.getID()).css("top", this.getY()+"px");
  }
};

//Héritage, polymorphisme et implémentation de nouvelles méthodes

//Objet Balle, hérite de objetBloc
var classBalle = Object.create(objetBloc);
//Définition de la zone de jeu. A définir juste après instanciation
classBalle._zoneJ;
classBalle._initIncrementX = this._incrementX;
classBalle._initIncrementY = this._incrementY;
classBalle.constructeur = function construitBalle(height,width,deep,colorFond, colorShadowInt, colorShadowExt,id, float, y, x, vit){
  this._hauteur = height;
  this._longueur = width;
  this._planZ = deep;
  this._couleurFond = colorFond;
  this._couleurInt = colorShadowInt;
  this._couleurExt = colorShadowExt;
  this._id = id;
  this._positionInit = float;
  this._x = x;
  this._y = y;
  this._incrementX = vit;
  this._incrementY = vit;
  this._initIncrementX = vit;
  this._initIncrementY = vit;
}
//Place la balle au centre de la zone de jeu
classBalle.resetBallPosition = function(){
  this._x = this._zoneJ.width()/2-this.getHauteur()/2;
  this._y = this._zoneJ.height()/2-this._hauteur/2;
  this._incrementX = this._initIncrementX;
  this._incrementY = this._initIncrementY;
};
//Appelle les méthode de placement et direction de la balle sur X et Y
classBalle.mvtBall = function(){
  this.mvtBallX();
  this.mvtBallY();
};
//Mise à joueur direction et position de la balle sur X
//Affectation du score
classBalle.mvtBallX = function(){
  if (this.getX()+this.getLongueur()>=this._zoneJ.width()) {
    this.resetBallPosition();
    this._incrementX *= -1;
    this._scoreJ1++;
  }
  else if (this.getX()<=-1) {
    this.resetBallPosition();
    this._scoreJ2++;
  }
  this._x += this._incrementX;
};
//Mise à joueur direction et position de la balle sur Y
classBalle.mvtBallY = function(){
  if(this.getY()+this.getHauteur()>=this._zoneJ.height() || this.getY()<=-1){
    this._incrementY *= -1
    //console.log((this.getY()+this.getHauteur())+" supEg "+(zoneJ.height()) +" ou "+ (this.getY())+" infEg "+(-1))
  }
  this._y += this._incrementY;
};
//Polymorphisme méthode Update
classBalle.update = function balleUpdate(){
    this.mvtBall();
};
//Définit aléatoirement la direction de la balle en X et Y
classBalle.departBalle = function(){
  var departX = getRand();
  var departY = getRand();
  if (departX <= 0.5) {
    this._incrementX *= -1;
  }
  if (departY <= 0.5) {
    this._incrementY *= -1;
  }
};


//Objet Joueur, hérite de objetBloc
var classJoueur = Object.create(objetBloc);
classJoueur._up = 0;          //Pour attribuer le code de la tocuhe de déplacement Haut du bloc
classJoueur._down = 0;        //Pour attribuer le code de la tocuhe de déplacement Bas du bloc
classJoueur._code = 0;        //Code de la touche préssée courante
classJoueur._limiteHaute = 0; //Définit la limite haute de la zone de jeu (est décalée a cause de la hauteur des éléments HTML précédents dans la zone)
classJoueur._limiteBasse = 0; //Définit la limite basse de la zone de jeu (est décalée a cause de la hauteur des éléments HTML précédents dans la zone)
classJoueur._inBox = false;   //Objectif : Verouiller l'inversion d'incrémentation X tant que la balle est à l'intérieur du joueur
//Vérifie si un element est dans la zone du bloc
//Si oui lui change sa direction
classJoueur.collide = function(objetExt){
  if ((objetExt.getX() <= (this.getLongueur()+this.getX())) && ((objetExt.getY()+this._limiteHaute+objetExt.getHauteur())> this.getY()) && ((objetExt.getY()+this._limiteHaute)<(this.getY()+this.getHauteur())) && (objetExt.getX()+objetExt.getLongueur()>this.getX())) {
    if (this._inBox !== true) {
      this.vitesseBalle(objetExt);
      objetExt._incrementX *= -1;
      if (objetExt.getX()-this.getX()<5) {
        objetExt._incrementY *= -1;
      }
      this._inBox = true;
    }
  }else {
    this._inBox = false;
  }
};
//Verifie que la touche préssée correspond à la touche attibuée
classJoueur.keyPressed = function(){
  if (this._code === this._up) {
    this._y -= this._incrementY;
  }
  if (this._code === this._down) {
    this._y += this._incrementY;
  }
};
//Polymorphisme méthode Update
//Appelle la méthode keyPressed, limiteBasse et limiteHaute
classJoueur.update = function joueurUpdate(){
    this.keyPressed();
    this.limiteBasse();
    this.limiteHaute();
};
//Si le joueur dépace la zone replace le joueur en position Y minimale
classJoueur.limiteHaute = function(){
  if (this.getY()<this._limiteHaute) {
    this.setY(this._limiteHaute+1);
  }
};
//Si le joueur dépace la zone replace le joueur en position Y maximale
classJoueur.limiteBasse = function(){
  if (this.getY()+this.getHauteur()>this._limiteBasse) {
    this.setY(this._limiteBasse-this.getHauteur()-1);
  }
};
//Appelle les methode d'augmentation de vitesse de balle X et Y
classJoueur.vitesseBalle = function(objetBalle){
  this.vitesseBalleX(objetBalle);
  this.vitesseBalleY(objetBalle);
};
//Si les conditions sont remplies, augmente la vitesse de la balle en X
classJoueur.vitesseBalleX = function(objetExt){
  if (objetExt._incrementX>0) {
    objetExt._incrementX++;
  }else {
    objetExt._incrementX--;
  }
}
//Si les conditions sont remplies, augmente la vitesse de la balle en
classJoueur.vitesseBalleY = function(objetExt){
  if (objetExt._incrementY>0) {
    objetExt._incrementY++;
  }else {
    objetExt._incrementY--;
  }
}
