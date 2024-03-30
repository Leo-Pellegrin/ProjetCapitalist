const { writeFile } = require("fs");
const { lastupdate } = require("./world");

function saveWorld(context) {
    console.log(context.user)
    writeFile("../userworlds/" + context.user + "-world.json", JSON.stringify(context.world), err => {
        if (err) {
            console.error(err)
            throw new Error(`Erreur d'écriture du monde coté serveur`)
        }
    })
    console.log("World saved")
}

// TODO : Revoir la fonction 
function CalcNbProduct(product, tempsEcoule) {
    let tempsRestant = product.timeleft - tempsEcoule;
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
    let total = 0
    let w = context.world
    context.world.products.forEach(p => {
        let time = Date.now() - Number(w.lastupdate)
        let qtProduit = CalcNbProduct(p, time)      
        total += qtProduit * p.quantite * p.revenu * (1 + context.world.activeangels * context.world.angelbonus / 100)

    })
    w.lastupdate = Date.now().toString()
    console.log(Date(w.lastupdate).toString())
    console.log("Avant", context.world.money)
    context.world.money += total
    console.log("Apres", context.world.money)
    context.world.score += total
}

function calcUpgrade(context, upgrade, product) {
    if (upgrade.unlocked && upgrade.typeratio == "vitesse") {
        context.world.products[product.id].vitesse = context.world.products[product.id].vitesse / upgrade.ratio;
    }
    else if (upgrade.unlocked && upgrade.typeratio == "gain") {
        context.world.products[product.id].revenu = context.world.products[product.id].revenu * upgrade.ratio;
    }
    return context;
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
            console.log("Achat de " + args.quantite + " " + args.id)
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
                for (let unlock of context.world.products[product.id].paliers) {
                    if (unlock.seuil <= context.world.products[product.id].quantite && !unlock.unlocked) {
                        context.world.products[product.id].paliers.find(ul => unlock.name === ul.name).unlocked = true;
                        calcUpgrade(context, unlock, product)
                    }
                }

                for (let unlock of context.world.allunlocks) {
                    let productslist = context.world.products.filter(product => product.quantite >= unlock.seuil)
                    if (productslist.length >= context.world.products.length && !unlock.unlocked) {
                        if (unlock.idcible == -1) {
                            for (let productall of context.world.products) {
                                calcUpgrade(context, unlock, productall)
                            }
                        }
                        else {
                            calcUpgrade(context, unlock, context.world.products[unlock.idcible])
                        }
                        context.world.allunlocks.find(ul => unlock.name === ul.name).unlocked = true;
                    }
                }

                product.cout = product.cout * Math.pow(product.croissance, args.quantite)
                context.world.money -= couttotal
                saveWorld(context)
                console.log("Achat de " + args.quantite + " " + product.name)
            }
            return product

        },
        lancerProductionProduit(parent, args, context) {
            updateScore(context)
            let product;
            try {
                product = context.world.products.find(p => p.id === args.id)
            }
            catch (error) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`);
            }

            if (product && product.timeleft === 0) {
                product.timeleft = product.vitesse;
                product.lastupdate = Date.now();
                saveWorld(context)
                console.log("Lancement de la production du produit " + product.name)
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
                product = context.world.products.find(p => p.id === manager.idcible)
            }
            catch {
                throw new Error(`Le produit avec l'id ${manager.id} n'existe pas`);
            }
            if (manager && product) {
                context.world.managers.find(p => p.name === args.name).unlocked = true;
                context.world.products[product.id].managerUnlocked = true;
                saveWorld(context);
                console.log("Manager " + manager.name + " engagé pour le produit " + product.name)
            }
        },
        acheterCashUpgrade(parent, args, context) {
            updateScore(context)
            let upgrade;
            try {
                upgrade = context.world.upgrades.find(p => p.name === args.name)
            }
            catch (error) {
                throw new Error(`L'upgrade avec le nom ${args.name} n'existe pas`);
            }

            if (upgrade) {
                if (context.world.money < upgrade.cout) {
                    throw new Error(`Vous n'avez pas assez d'argent pour acheter l'upgrade ${upgrade.name}`)
                }
                context.world.upgrades.find(p => p.name === args.name).unlocked = true;

                if (upgrade.typeratio == "vitesse") {
                    context.world.products[upgrade.idcible].vitesse /= upgrade.ratio;
                }
                else if (upgrade.typeratio == "gain") {
                    context.world.products[upgrade.idcible].revenu *= upgrade.ratio;
                }
                context.world.money -= upgrade.cout;
                saveWorld(context);
                console.log("Achat de l'upgrade " + upgrade.name)
            }
        },
        resetWorld(parent, args, context) {
            let score = context.world.score
            let totalangels = context.world.totalangels
            let activeangels = context.world.activeangels

            let angelstoAdd = 150 * Math.sqrt(score / Math.pow(10, 15)) - totalangels

            newWorld = require("./world")

            newWorldtotalangels = totalangels + angelstoAdd
            newWorld.activeangels = activeangels + angelstoAdd

            writeFile("../userworlds/" + context.user + "-world.json", JSON.stringify(newWorld), err => {
                if (err) {
                    console.error(err)
                    throw new Error(`Erreur d'écriture du monde coté serveur`)
                }
            })
        },
        acheterAngelUpgrade(parent, args, context) {
            updateScore(context)
            let upgrade;
            try {
                upgrade = context.world.angelupgrades.find(p => p.name === args.name)
            }
            catch (error) {
                throw new Error(`L'angelupgrade avec le nom ${args.name} n'existe pas`);
            }

            if (upgrade) {
                if (context.world.activeangels < upgrade.seuil) {
                    throw new Error(`Vous n'avez pas assez d'anges pour acheter l'angelupgrade ${upgrade.name}`)
                }
                context.world.upgrades.find(p => p.name === args.name).unlocked = true;

                if (upgrade.typeratio == "ange") {
                    context.world.angelbonus += upgrade.ratio;
                }
                else if (upgrade.typeratio == "gain") {
                    context.world.products.forEach(product => {
                        product.revenu *= upgrade.ratio;
                    });
                }
                context.world.activeangels -= upgrade.seuil;
                saveWorld(context);
                console.log("Achat de l'angelupgrade " + upgrade.name)
            }
        }
    }
};