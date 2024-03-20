const { writeFile } = require("fs");

function saveWorld(context) {
    writeFile("userworlds/" + context.user + "-world.json", JSON.stringify(context.world), err => {
        if (err) {
            console.error(err)
            throw new Error(`Erreur d'écriture du monde coté serveur`)
        }
        else {
            console.log("World saved")
        }
    })
}

function CalcNbProduct(product, tempsEcoule) {
    let tempsRestant = product.timeleft - tempsEcoule;
    console.log("Temps restant : " + tempsRestant)
    console.log("Temps écoulé : " + tempsEcoule)
    if (!product.managerUnlocked) {
        if (product.timeleft !== 0 && tempsRestant <= 0) {
            product.timeleft = 0;
            return 1;
        }
        else if (product.timeleft !== 0 && tempsRestant > 0) {
            product.timeleft -= tempsEcoule
            return 0
        }
        else {
            return 0
        }
    }
    else {
        if (tempsRestant < 0) {
            product.timeleft = (product.vitesse - (-tempsRestant % product.vitesse))
            return (1 + (Math.floor(-tempsRestant / product.vitesse)))
        }
        else if (tempsRestant === 0) {
            product.timeleft = product.vitesse
            return 1
        }
        else {
            product.timeleft -= tempsEcoule
            return 0
        }
    }
}

function updateScore(context) {
    let addscore = 0;
    for (let product of context.world.products) {
        let tempsEcoule = Date.now() - Number(context.world.lastupdate);
        // console.log("Temps écoulé : " + tempsEcoule)
        let nbProduct = CalcNbProduct(product, tempsEcoule);
        // console.log("Nombre de produit : " + nbProduct)
        addscore += nbProduct * product.quantite * product.revenu * (1 + context.world.activeangels * context.world.angelbonus / 100)
    }
    context.world.lastupdate = Date.now().toString()
    context.world.money += addscore
    context.world.score += addscore
    return context
}

module.exports = {
    Query: {
        getWorld(parent, args, context) {
            updateScore(context)
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            updateScore(context)
            let product;
            try {
                product = context.world.products.find(p => p.id === args.id)
            }
            catch (error) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`);
            }
            if (product) {
                let couttotal = product.cout * (1 - Math.pow(product.croissance, args.quantite)) / (1 - product.croissance)

                if (context.world.money < couttotal) {
                    throw new Error(`Vous n'avez pas assez d'argent pour acheter ${args.quantite} ${product.name}`)
                }
                product.quantite += args.quantite;
                product.cout = product.cout * Math.pow(product.croissance, args.quantite)
                context.world.money -= couttotal
                saveWorld(context)
            }
            return product

        },
        lancerProductionProduit(parent, args, context) {
            console.log("Lancement de production de " + args.id)
            updateScore(context)
            let product;
            try {
                product = context.world.products.find(p => p.id === args.id)
            }
            catch (error) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`);
            }

            if (product && product.timeleft == 0) {
                product.timeleft = product.vitesse;
                product.lastupdate = Date.now();
                saveWorld(context)
            }

        },
        engagerManager(parent, args, context) {
            updateScore(context)
            let manager;
            try {
                manager = context.world.managers.find(p => p.name === args.name)
            }
            catch {
                throw new Error(`Le manager avec le nom ${args.name} n'existe pas`);
            }

            let product;
            try {
                product = context.world.produits.find(p => p.id === manager.id)
            }
            catch {
                throw new Error(`Le produit avec l'id ${manager.id} n'existe pas`);
            }

            if (manager && product) {
                manager.unlocked = true;
                product.managerUnlock = true;
                saveWorld(context);
            }
        }
    }
};