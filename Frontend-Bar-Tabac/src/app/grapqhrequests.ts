import { gql } from "@urql/core";

export const GET_WORLD = gql`
    query getWorld {
        getWorld {
        
        name
        logo
        money
        score
        totalangels
        activeangels
        angelbonus
        lastupdate
        products {
            id
            name
            logo
            cout
            croissance
            revenu
            vitesse
            quantite
            timeleft
            managerUnlocked
            paliers {
            name
            logo
            seuil
            idcible
            ratio
            typeratio
            unlocked
            }
        }
        allunlocks {
            name
            logo
            seuil
            idcible
            ratio
            typeratio
            unlocked
        }
        upgrades {
            name
            logo
            seuil
            idcible
            ratio
            typeratio
            unlocked
        }
        angelupgrades {
            name
            logo
            seuil
            idcible
            ratio
            typeratio
            unlocked
        }
        managers {
            name
            logo
            seuil
            idcible
            ratio
            typeratio
            unlocked
        }
        }
    }`

export const LANCER_PRODUCTION = gql`
    mutation lancerProductionProduit($id: Int!) {
        lancerProductionProduit(id: $id) {
            id
        }
    }`

export const HIRE_MANAGER = gql`
    mutation hireManager($id: Int!) {
        hireManager(id: $id) {
            id
        }
    }`

export const BUY_UPGRADE = gql`
    mutation buyUpgrade($id: Int!) {
        buyUpgrade(id: $id) {
            id
        }
    }`

export const BUY_QT_PRODUIT = gql`
    mutation acheterQtProduit($id: Int!, $quantite: Int!) {
        acheterQtProduit(id: $id, quantite: $quantite) {
            id
        }
    }`
