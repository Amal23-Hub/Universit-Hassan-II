# Nouvelle Organisation du Dashboard Membre

## Structure Proposée

```
app/dashboard-member/
├── dashboard/
│   ├── page.tsx                    # Dashboard principal
│   └── loading.tsx                 # Loading du dashboard
│
├── projects/                       # Gestion des projets
│   ├── page.tsx                    # Liste des projets
│   ├── create/
│   │   └── page.tsx               # Créer un nouveau projet
│   ├── submit/
│   │   └── page.tsx               # Soumettre un projet
│   ├── calls/
│   │   └── page.tsx               # Appels à projets
│   └── approved/
│       └── [id]/
│           └── page.tsx           # Projet approuvé (détails)
│
├── publications/                   # Gestion des publications
│   ├── page.tsx                    # Liste des publications
│   ├── create/
│   │   └── page.tsx               # Créer une publication
│   └── loading.tsx                # Loading des publications
│
├── manifestations/                 # Gestion des manifestations
│   ├── page.tsx                    # Liste des manifestations
│   ├── create/
│   │   └── page.tsx               # Créer une manifestation
│   ├── participate/
│   │   └── page.tsx               # Participation aux manifestations
│   ├── organize/
│   │   └── page.tsx               # Organisation de manifestations
│   └── loading.tsx                # Loading des manifestations
│
├── laboratory/                     # Gestion du laboratoire
│   ├── page.tsx                    # Informations du laboratoire
│   └── research/
│       └── page.tsx               # Recherche en laboratoire
│
├── programs/                       # Gestion des programmes
│   ├── page.tsx                    # Liste des programmes
│   ├── employment/
│   │   └── page.tsx               # Programme d'emploi
│   └── loading.tsx                # Loading des programmes
│
└── profile/                        # Profil et paramètres
    ├── page.tsx                    # Profil utilisateur
    ├── settings/
    │   └── page.tsx               # Paramètres
    └── history/
        └── page.tsx               # Historique des activités
```

## Avantages de cette organisation

### 1. **Regroupement logique par fonctionnalité**
- Tous les éléments liés aux projets sont dans `/projects/`
- Toutes les manifestations dans `/manifestations/`
- Publications dans `/publications/`

### 2. **Structure hiérarchique claire**
- Chaque fonctionnalité a ses sous-dossiers
- Actions CRUD bien séparées (create, edit, view)
- Pages de détails avec paramètres dynamiques

### 3. **Facilité de maintenance**
- Plus facile de trouver un fichier spécifique
- Imports plus clairs et cohérents
- Évite la duplication de code

### 4. **Évolutivité**
- Facile d'ajouter de nouvelles fonctionnalités
- Structure modulaire et extensible
- Séparation des responsabilités

## Migration des fichiers existants

### Fichiers à déplacer :

1. **Projets :**
   - `soumettre-projet/page.tsx` → `projects/create/page.tsx`
   - `soumission-appel/page.tsx` → `projects/submit/page.tsx`
   - `appels-projets/page.tsx` → `projects/calls/page.tsx`
   - `projet-approuve/[id]/page.tsx` → `projects/approved/[id]/page.tsx`

2. **Manifestations :**
   - `participation-manifestation/page.tsx` → `manifestations/participate/page.tsx`
   - `organisation-manifestation/page.tsx` → `manifestations/organize/page.tsx`
   - `manifestations-scientifiques/` → `manifestations/`

3. **Laboratoire :**
   - `laboratoire-recherche/` → `laboratory/research/`

4. **Programmes :**
   - `liste-programmes/page.tsx` → `programs/page.tsx`
   - `programme-emploi/page.tsx` → `programs/employment/page.tsx`

5. **Publications :**
   - `publications/` → reste dans `publications/`

## Mise à jour des routes et navigation

### Sidebar navigation à mettre à jour :
```typescript
const memberNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard-member/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Projets",
    href: "/dashboard-member/projects",
    icon: FolderOpen,
    children: [
      { title: "Mes Projets", href: "/dashboard-member/projects" },
      { title: "Créer un Projet", href: "/dashboard-member/projects/create" },
      { title: "Appels à Projets", href: "/dashboard-member/projects/calls" }
    ]
  },
  {
    title: "Publications",
    href: "/dashboard-member/publications",
    icon: FileText
  },
  {
    title: "Manifestations",
    href: "/dashboard-member/manifestations",
    icon: Calendar,
    children: [
      { title: "Mes Manifestations", href: "/dashboard-member/manifestations" },
      { title: "Participer", href: "/dashboard-member/manifestations/participate" },
      { title: "Organiser", href: "/dashboard-member/manifestations/organize" }
    ]
  },
  {
    title: "Laboratoire",
    href: "/dashboard-member/laboratory",
    icon: Building2
  },
  {
    title: "Programmes",
    href: "/dashboard-member/programs",
    icon: BookOpen
  }
]
```

## Étapes de migration

1. **Créer la nouvelle structure de dossiers**
2. **Déplacer les fichiers existants**
3. **Mettre à jour les imports dans chaque fichier**
4. **Mettre à jour la navigation (sidebar)**
5. **Tester toutes les routes**
6. **Supprimer les anciens dossiers vides**

Cette organisation rendra le code plus maintenable et plus facile à naviguer pour les développeurs.

