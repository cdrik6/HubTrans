// let toto = 42;
// console.log(toto);

// ////////////////////
// // Copie par valeur
// ////////////////////
// let variableSimple1 = 25
// let variableSimple2 = variableSimple1

// variableSimple2 = 30

// // Le console.log va afficher 25, le fait d’avoir changé la valeur de variableSimple2 ne change rien pour variableSimple1
// console.log("variableSimple1", variableSimple1)
// console.log("variableSimple2", variableSimple2)

// ///////////////////////
// // Copie par référence
// ///////////////////////
// let variableComplexe1 = ['pomme', 'cerise']
// let variableComplexe2 = variableComplexe1
// let variableComplexe3 = [...variableComplexe1];

// variableComplexe2.push('poire')

// // Le console.log va afficher pomme cerise ET poire. On a modifié la seconde variable, mais le contenu de la première a été changé aussi, parce que c’est le même contenu.
// console.log('variableComplexe1', variableComplexe1)
// console.log('variableComplexe2', variableComplexe2)
// console.log('variableComplexe3', variableComplexe3)

// const mots = ["Bonjour", "ca", "va"]; // Essayez de mettre un autre mot ici !
// let mot;
// let score = 0;
// for (let i = 0; i < 3; i++)
// {
// 	mot = prompt("Entrez le mot : " + mots[i])
// 	if (mot === mots[i])
// 		score++;	
// }
// if (score === 3) {
// 		console.log("Bravo!")
// 	} else {
// 		console.log("Vous avez fait une erreur de frappe.")
// 	}

// let monBouton = document.getElementById("monBouton");
document.addEventListener("keydown", (event) => {
		console.log(event.key);
});