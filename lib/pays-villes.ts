// NB sw pays,villes monde!
import { villesFrance } from './villes-france'
import { villesAllemagne } from './villes-allemagne'
import { villesBelgique } from './villes-belgique'
import { villesCanada } from './villes-canada'
import { villesEspagne } from './villes-espagne'
import { villesEtatsUnis } from './villes-etats-unis'
import { villesItalie } from './villes-italie'
import { villesSuisse } from './villes-suisse'

//pays monde
export let paysMonde: string[] = [
    "Afrique du Sud", "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso", "Burundi", "Cameroun", "Cap-Vert", "Centrafrique", "Comores", "Congo", 
    "Congo (RDC)", "Côte d'Ivoire", "Djibouti", "Égypte", "Érythrée", "Eswatini", "Éthiopie", "Gabon", "Gambie", "Ghana", "Guinée", "Guinée-Bissau", 
"Guinée équatoriale", "Kenya", "Lesotho", "Liberia", "Libye", "Madagascar", "Malawi", "Mali", "Maroc", "Maurice", "Mauritanie", "Mozambique", 
"Namibie", "Niger", "Nigeria", "Ouganda", "Rwanda", "São Tomé-et-Principe", "Sénégal", "Seychelles", "Sierra Leone", "Somalie", "Soudan", 
    "Soudan du Sud", "Tanzanie", "Tchad", "Togo", "Tunisie", "Zambie", "Zimbabwe",
    "Allemagne", "Autriche", "Belgique", "Bulgarie", "Chypre", "Croatie", "Danemark", "Espagne", "Estonie", "Finlande", "France", "Grèce",
    "Hongrie", "Irlande", "Islande", "Italie", "Lettonie", "Lituanie", "Luxembourg", "Malte", "Norvège", "Pays-Bas", "Pologne", "Portugal",
    "Roumanie", "Royaume-Uni", "Slovaquie", "Slovénie", "Suède", "Suisse", "République tchèque",
    "Canada", "États-Unis", "Mexique",
    "Arabie saoudite", "Bahreïn", "Émirats arabes unis", "Irak", "Iran", "Israël", "Jordanie", "Koweït", "Liban", "Oman", "Palestine",
    "Qatar", "Syrie", "Turquie", "Yémen",
    "Afghanistan", "Bangladesh", "Bhoutan", "Chine", "Corée du Nord", "Corée du Sud", "Inde", "Indonésie", "Japon", "Malaisie", "Maldives",
    "Myanmar", "Népal", "Pakistan", "Philippines", "Singapour", "Sri Lanka", "Thaïlande", "Viêt Nam",
    "Argentine", "Brésil", "Chili", "Colombie", "Équateur", "Paraguay", "Pérou", "Uruguay", "Venezuela",
    "Australie", "Nouvelle-Zélande", "Fidji", "Papouasie-Nouvelle-Guinée"
]

// Villes du Maroc
const villesMaroc: string[] = [
    "Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tanger", "Meknès", "Oujda", "Kenitra", "Tétouan", "Safi", 
    "El Jadida", "Beni Mellal", "Errachidia", "Ouarzazate", "Laâyoune", "Dakhla", "Autre"
]

// Villes d'Afrique du Sud
const villesAfriqueduSud: string[] = [
    "Johannesburg", "Le Cap", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Polokwane", "Nelspruit", "Kimberley", "Autre"
]

// Villes d'Algérie
const villesAlgerie: string[] = [
    "Alger", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Djelfa", "Sétif", "Sidi Bel Abbès", "Biskra", "Tébessa", "Tlemcen", "Béjaïa", "Autre"
]

// Villes de Tunisie
const villesTunisie: string[] = [
    "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Monastir", "Ben Arous", "Kasserine", "Médenine", "Autre"
]

// Villes d'Égypte
const villesEgypte: string[] = [
    "Le Caire", "Alexandrie", "Gizeh", "Shubra El-Kheima", "Port-Saïd", "Suez", "Louxor", "Assouan", "Mansoura", "Tanta", "Ismaïlia", "Autre"
]

// Villes du Sénégal
const villesSenegal: string[] = [
    "Dakar", "Thiès", "Rufisque", "Kaolack", "Ziguinchor", "Saint-Louis", "Louga", "Mbour", "Tambacounda", "Diourbel", "Richard Toll", "Autre"
]

// Villes du Kenya
const villesKenya: string[] = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale", "Garissa", "Kakamega", "Autre"
]

// Villes d'Éthiopie
const villesEthiopie: string[] = [
    "Addis-Abeba", "Dire Dawa", "Mekele", "Gondar", "Awassa", "Bahir Dar", "Dessie", "Jimma", "Jijiga", "Shashamane", "Autre"
]

// Villes du Nigeria
const villesNigeria: string[] = [
    "Lagos", "Kano", "Ibadan", "Abuja", "Port Harcourt", "Benin City", "Kaduna", "Jos", "Ilorin", "Aba", "Maiduguri", "Autre"
]

// Villes du Cameroun
const villesCameroun: string[] = [
    "Douala", "Yaoundé", "Garoua", "Bafoussam", "Bamenda", "Maroua", "Nkongsamba", "Buea", "Kribi", "Limbé", "Autre"
]

// Villes du Ghana
const villesGhana: string[] = [
    "Accra", "Kumasi", "Tamale", "Takoradi", "Ashaiman", "Sunyani", "Cape Coast", "Obuasi", "Teshie", "Tema", "Autre"
]

// Villes de Côte d'Ivoire
const villesCotedIvoire: string[] = [
    "Abidjan", "Bouaké", "Daloa", "Yamoussoukro", "San-Pédro", "Korhogo", "Man", "Divo", "Gagnoa", "Abengourou", "Autre"
]

// Villes du Burundi
const villesBurundi: string[] = [
    "Bujumbura", "Gitega", "Muyinga", "Ruyigi", "Ngozi", "Rutana", "Bururi", "Makamba", "Muramvya", "Kayanza", "Autre"
]

// Villes du Rwanda
const villesRwanda: string[] = [
    "Kigali", "Butare", "Gitarama", "Ruhengeri", "Gisenyi", "Byumba", "Cyangugu", "Kibungo", "Kibuye", "Autre"
]

// Villes de Tanzanie
const villesTanzanie: string[] = [
    "Dar es Salaam", "Mwanza", "Arusha", "Dodoma", "Mbeya", "Morogoro", "Tanga", "Zanzibar", "Kigoma", "Mtwara", "Autre"
]

// Villes d'Ouganda
const villesOuganda: string[] = [
    "Kampala", "Gulu", "Lira", "Mbarara", "Jinja", "Mbale", "Mukono", "Masaka", "Entebbe", "Arua", "Autre"
]

// Villes du Mali
const villesMali: string[] = [
    "Bamako", "Sikasso", "Mopti", "Koutiala", "Kayes", "Ségou", "Gao", "Tombouctou", "Kidal", "Autre"
]

// Villes du Burkina Faso
const villesBurkinaFaso: string[] = [
    "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora", "Dédougou", "Kaya", "Tenkodogo", "Fada N'gourma", "Autre"
]

// Villes de Madagascar
const villesMadagascar: string[] = [
    "Antananarivo", "Toamasina", "Antsirabe", "Mahajanga", "Fianarantsoa", "Toliara", "Antsiranana", "Ambovombe", "Autre"
]

// Villes d'Angola
const villesAngola: string[] = [
    "Luanda", "Huambo", "Lobito", "Benguela", "Lubango", "Kuito", "Malanje", "Namibe", "Soyo", "Autre"
]

// Villes du Mozambique
const villesMozambique: string[] = [
    "Maputo", "Matola", "Beira", "Nampula", "Chimoio", "Nacala", "Quelimane", "Tete", "Lichinga", "Autre"
]

// Villes du Gabon
const villesGabon: string[] = [
    "Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", "Mouila", "Lambaréné", "Tchibanga", "Autre"
]

// Villes du Tchad
const villesTchad: string[] = [
    "N'Djamena", "Moundou", "Sarh", "Abéché", "Kelo", "Koumra", "Pala", "Am Timan", "Bongor", "Autre"
]

// Villes du Niger
const villesNiger: string[] = [
    "Niamey", "Zinder", "Maradi", "Agadez", "Tahoua", "Dosso", "Diffa", "Arlit", "Tillabéri", "Autre"
]

// Villes de Zambie
const villesZambie: string[] = [
    "Lusaka", "Kitwe", "Ndola", "Kabwe", "Chingola", "Mufulira", "Livingstone", "Luanshya", "Kasama", "Autre"
]

// Villes du Zimbabwe
const villesZimbabwe: string[] = [
    "Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", "Epworth", "Kwekwe", "Kadoma", "Masvingo", "Autre"
]

// Villes génériques pour pays sans liste spécifique
const villesGeneriques: string[] = [
    "Capitale", "Ville principale", "Autre"
]

// Villes du Royaume-Uni
const villesRoyaumeUni: string[] = [
    "Londres", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Leeds", "Sheffield", "Édimbourg", "Bristol", "Cardiff", "Belfast", "Newcastle", "Nottingham", "Leicester", "Autre"
]

// Villes des Pays-Bas
const villesPaysBas: string[] = [
    "Amsterdam", "Rotterdam", "La Haye", "Utrecht", "Eindhoven", "Groningue", "Tilburg", "Almere", "Breda", "Nimègue", "Autre"
]

// Villes du Portugal
const villesPortugal: string[] = [
    "Lisbonne", "Porto", "Amadora", "Braga", "Setúbal", "Coimbra", "Queluz", "Funchal", "Cacém", "Vila Nova de Gaia", "Autre"
]

// Mapping pays -> villes
export const paysVillesMapping: Record<string, string[]> = {
    "Maroc": villesMaroc,
    "France": villesFrance,
    "Allemagne": villesAllemagne,
    "Belgique": villesBelgique,
    "Canada": villesCanada,
    "Espagne": villesEspagne,
    "États-Unis": villesEtatsUnis,
    "Italie": villesItalie,
    "Suisse": villesSuisse,
    "Afrique du Sud": villesAfriqueduSud,
    "Algérie": villesAlgerie,
    "Tunisie": villesTunisie,
    "Égypte": villesEgypte,
    "Sénégal": villesSenegal,
    "Kenya": villesKenya,
    "Éthiopie": villesEthiopie,
    "Nigeria": villesNigeria,
    "Cameroun": villesCameroun,
    "Ghana": villesGhana,
    "Côte d'Ivoire": villesCotedIvoire,
    "Burundi": villesBurundi,
    "Rwanda": villesRwanda,
    "Tanzanie": villesTanzanie,
    "Ouganda": villesOuganda,
    "Mali": villesMali,
    "Burkina Faso": villesBurkinaFaso,
    "Madagascar": villesMadagascar,
    "Angola": villesAngola,
    "Mozambique": villesMozambique,
    "Gabon": villesGabon,
    "Tchad": villesTchad,
    "Niger": villesNiger,
    "Zambie": villesZambie,
    "Zimbabwe": villesZimbabwe,
    "Royaume-Uni": villesRoyaumeUni,
    "Pays-Bas": villesPaysBas,
    "Portugal": villesPortugal,
}

// Fonction pour obtenir les villes d'un pays
export function getVillesByPays(pays: string): string[] {
    return paysVillesMapping[pays] || villesGeneriques
}

// Pour compatibilité avec l'ancien code
export let villesMonde: string[] = villesMaroc