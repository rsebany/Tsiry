PLAN DU DOCUMENT
01 · Design Principles — principes, profondeur, densité, identité, valeur ajoutée & bordure drapeau national malgache
02 · Design Tokens
03 · Components
04 · Layout
05 · Pages UI (Tableau de bord · Nouveau RDV · Mes RDV · Historique · Profil · Salle de triage)
06 · UX Rules
07 · User Flows
08 · Business Rules
09 · Accessibility
10 · Responsive
11 · Implementation
01 · DESIGN PRINCIPLES
1.1 Principes directeurs
Chaque décision visuelle répond à la question : « Améliore-t-il réellement la compréhension, la navigation ou l'action de l'utilisateur ? » — sinon l'élément est supprimé.

Principe	Valeur priorisée
CLARTÉ	> décoration
LISIBILITÉ	> effets
RAPIDITÉ	> animation
ACCESSIBILITÉ	> esthétique
CONFIANCE	> marketing
1.2 PRINCIPE DE PROFONDEUR (règle fondamentale)
La hiérarchie visuelle est produite en priorité par, dans cet ordre :

typographie
espacement
contraste
surfaces
bordures
Les ombres sont secondaires et restent très légères. Les effets lumineux et gradients décoratifs sont interdits. C'est ce principe qui permet de sortir du look « AI-generated dashboard ».

1.3 DENSITÉ UI (règle)
La densité doit être adaptée au contexte utilisateur, jamais au détriment de la lisibilité :

Contexte	Densité
Patient	Confortable (espaces plus généreux)
Agent / Médecin	Moyenne à élevée
Triage	Élevée, priorité absolue à l'information critique
Aucune page ne sacrifie la lisibilité pour afficher davantage d'informations. Tsiry sert patient + agent + médecin + triage : la densité est un paramètre de la plateforme, pas un style uniforme.

1.4 Identité visuelle
Drapeau malgache (blanc / rouge / vert) interprété de façon désaturée et institutionnelle, jamais comme un drapeau littéral ni folklorique.
Vert = fonction principale · Rouge = strictement sémantique · Blanc = base. Le rouge est réservé à l'urgence, l'erreur, l'état critique, l'action destructive ; jamais décoratif.
Élement identitaire discret : une ligne tricolore (rouge/blanc/vert) de 3 px sous le monogramme de marque — identité sans transformer l'interface en drapeau.
Interdits actés : glassmorphism, bordures lumineuses, gradients décoratifs, blobs, glow, parallax, hover-lift, badges fluo, icônes hétérogènes, ombres marquées.
1.5 Orientation produit
Tsiry est un logiciel métier institutionnel (usage long, 8 h/jour), non un dashboard SaaS marketing. Titres fonctionnels uniquement (« Mes rendez-vous », « Nouveau rendez-vous », « Historique », « Informations personnelles », « État du ticket »). Aucun slogan marketing (« Welcome back », « Your journey starts here », etc.).

1.6 Valeur ajoutée du design & bordure du drapeau national malgache
1.6.1 Valeur ajoutée du design pour l'établissement
La démarche de design de Tsiry apporte des bénéfices concrets et mesurables, au-delà de l'esthétique :

Confiance institutionnelle : une interface calme, cohérente et professionnelle inspire crédibilité au patient comme à l'agent hospitalier ; la charte évite l'aspect « maquette IA » et positionne Tsiry comme un véritable produit métier.
Réduction de la fatigue visuelle : lisibilité, densité adaptée au rôle (patient / agent / triage) et suppression des effets décoratifs permettent un usage prolongé (8 h/jour) sans épuisement.
Vitesse d'action : hiérarchie claire (où je suis, ce que je peux faire, quelle action ensuite) et parcours guidés (stepper de réservation, priorisation triage) accélèrent les décisions, en particulier en contexte d'urgence.
Identité malgache élégante : une référence nationale sobre et digne — sans folklore ni caricature — renforçant le sentiment d'appartenance et l'image publique de l'hôpital.
Accessibilité et conformité : viser WCAG 2.2 AA réduit les risques et garantit l'usage par tous les profils (patients, soignants, administration).
Pérennité : tokens + bibliothèque de composants réutilisables facilitent l'évolution sans refonte coûteuse.
1.6.2 Bordure du drapeau national malgache (élément signature)
Le drapeau national malgache — bande verticale blanche à la hampe, puis bandes horizontales rouge et verte à parts égales — est réinterprété en un liséré d'identité institutionnelle : la bordure drapeau.

Spécifications :

Composition : blanc · rouge · vert, dans l'ordre et la proportion du drapeau national (sur un liseré horizontal : blanc, puis rouge, puis vert).
Épaisseur : 2 à 3 px (finition fine et sobre — jamais une large bande, jamais de dégradé ni de motif).
Nature : bordure d'appui périphérique, strictement neutre et géométrique. Emplacements prévus :
le liseré inférieur du monogramme de marque dans la sidebar (déjà observé : 3 px sous le monogramme) ;
facultativement, un liséré horizontal fin en haut/accueil d'un écran de borne ou de kiosque ou de la page de connexion ;
l'accent en pied de document imprimé (compte-rendu, attestation, ticket) pour renforcer l'officialité.
Règle d'institution : la bordure drapeau est un marqueur d'identité discret et périphérique — elle n'est jamais posée sur le contenu métier, jamais clignotante, jamais interactive. Les couleurs du contenu restent strictement sémantiques (vert fonction / rouge urgence / blanc base) ; la bordure drapeau ne véhicule aucune information fonctionnelle et ne transforme pas l'interface en drapeau.
02 · DESIGN TOKENS
Source : section « Design System » de la maquette. Valeurs reproduites à l'identique (observées).

2.1 Couleurs
Marque / fonctionnelles
Token	HEX	Usage exclusif
--green (Primary Green)	#16803C	Action primaire, succès, navigation active
--green-dark	#116B32	Hover bouton primaire
--green-deep	#0C5624	Pressed bouton primaire, texte sur vert pâle
--green-soft	#EAF5EE	Fond nav active, statuts succès
--green-border	#BFDCC8	Bordure états succès
--red	#C93C3C	Erreur, critique, destructif (sémantique)
--red-dark	#A02E2E	Hover/texte états destructifs
--red-soft	#FBECEC	Alertes erreur, ligne critique, danger hover
--red-border	#EABEBE	Bordure erreur / danger
--amber	#B7791F	Avertissement
--amber-soft	#FBF3E3	Fond alertes avertissement
--amber-border	#EAD9B0	Bordure avertissements
--blue-info	#2563A8	Sémantique d'information uniquement (voir règle 2.3)
--info-soft	#EAF2FB	Fond alertes information
Neutres
Token	HEX	Usage
--bg	#F7F8F7	Fond de page
--surface	#FFFFFF	Panneaux, tableaux, sidebar, header
--surface-2	#F1F3F2	En-têtes tableaux, hover, champs désactivés
--surface-3	#E9ECE9	Pressed boutons secondaires
--border	#D9DEDB	Bordure standard
--border-strong	#C4CCC8	Contrôles, sélection
--border-soft	#E4E8E6	Séparateurs internes
--text	#17201B	Titres / texte primaire
--text-2	#53605A	Texte secondaire
--text-muted	#737D77	Libellés secondaires
--text-faint	#8B938E	Texte très discret
--focus	#16803C	Focus ring
--white	#fff	Texte sur vert
2.2 Règle sémantique des couleurs
Success → Green · Warning → Amber · Error/Critique → Red · Information → Neutre ou Green selon le contexte.
Interdits : vert néon, rouge vif décoratif.
2.3 Règle du bleu (--blue-info)
Le bleu est autorisé uniquement comme couleur sémantique d'information (statut « En attente », alertes d'information). Il ne doit jamais devenir une couleur de marque, une couleur dominante ni une couleur décorative. Toute utilisation de --blue-info hors d'un contexte d'information est proscrite.

2.4 Typographie
Police : Inter · Fallback : system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.
Graisses : 400 (body), 500 (labels/statuts), 600 (titres, valeurs, actions), 700 (monogramme).
Règle de conduite typographique : la typographie ne doit jamais être utilisée pour créer un effet marketing. La lisibilité prime sur l'expressivité. Pas d'ExtraBold systématique, pas d'uppercase excessif, pas de tracking artificiel, pas de gros titres marketing.
Échelle
Style	Size	Weight	Apparence / notes
H1 / Display	1.875rem (30 px)	600	letter-spacing −0.01em
H2	1.375rem (22 px)	600	Titres de section
H3	1.125rem (18 px)	600	Sous-blocs
Body	0.9063rem (≈14.5 px)	400	Texte courant, line-height 1.55
Label	0.8125rem (13 px)	500	Étiquettes de champ
Small / Muted	0.75rem (12 px)	400–500	Métadonnées, dates
2.5 Grille & espacements
Système 4/8 px : 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48.
Grille de contenu : max-width: 1180 px, centré ; padding page 28 px (haut) / 32 px (latéral) / 64 px (bas) sur desktop.
2.6 Rayons de bordure
Token	Valeur	Usage
--r-sm	4 px	Petits boutons (btn-sm), onglets
--r-md	6 px	Boutons, inputs, select, nav
--r-lg	8 px	Panneaux, tableaux, alertes, items de sélection
--r-xl	12 px	Dialog, empty state, preview sidebar
Pas de rounded-2xl/rounded-3xl généralisé.

2.7 Ombres
Token	Valeur	Usage
--shadow-xs	0 1px 2px rgba(23,32,27,.04)	Onglet / switch actif
--shadow-sm	0 1px 2px rgba(23,32,27,.05), 0 2px 6px rgba(23,32,27,.04)	Élévation légère
--shadow-md	0 4px 12px rgba(23,32,27,.08)	Dialog, toast, sidebar mobile
Symbiose avec le Principe de profondeur (§1.2) : les ombres restent secondaires, jamais colorées ni luminescentes.

2.8 Mouvement (--dur / --ease)
--dur : 150ms ; --ease : cubic-bezier(.2,.75,.3,1).
Autorisé : changement d'état, ouverture/fermeture, navigation, feedback d'action.
prefers-reduced-motion: reduce → toute animation/transition coupée.
Interdits : floating cards, blobs animés, glow, parallax, hover-lift, zoom permanent.
2.9 Iconographie
Bibliothèque unique : Lucide Icons (CDN lucide@latest, rendu lucide.createIcons()).
Trait uniforme : stroke-width 2, stroke-linecap/linejoin: round, fill: none.
Tailles : 17 px navigation sidebar / icon-boutons · 16 px boutons · 18 px alertes · 22 px états vides.
--green sur l'icône active en navigation ; jamais d'icône décorative sans fonction.
03 · COMPONENTS
Référence : bibliothèque de la maquette. Chaque composant implémente les états : default · hover · focus · active · pressed · disabled · loading · error (selon pertinence).

3.1 Boutons (.btn)
Variante	Classe	Défaut
Primaire	.btn-primary	fond --green, texte blanc
Secondaire	.btn-secondary	fond blanc, bordure --border-strong, texte --text
Tertiaire	.btn-tertiary	transparent, texte --green
Danger (contour)	.btn-danger	fond blanc, bordure --red-border, texte --red
Danger (plein)	.btn-danger-solid	fond --red, texte blanc
Nominal : hauteur 40 px, padding 0 16 px, radius 6 px, font 13.5 px/500, icône 16 px, espace icône–texte 8 px.
Modificateurs : .btn-sm (34 px · padding 0 12 px · radius 4 · font 13), .btn-icon (carré 40 px, icône 17 px).
États : hover — prim.--green-dark, sec.--surface-2, tert.--green-soft, danger--red-soft, danger-solid--red-dark ; active — prim.--green-deep, sec.--surface-3 ; disabled — opacity .55, cursor:not-allowed ; focus — :focus-visible contour 2px solid --green + offset 2.
Aucun dégradé, aucune ombre colorée, aucun glow. Transition --dur/--ease.
3.2 Champs (.control : input / select / textarea)
Hauteur 42 px, padding 0 12 px, font 14 px, fond blanc, border: 1px solid --border-strong, radius 6 px.
Label toujours persisté au-dessus du champ (13/500, marge basse 6 px) — un placeholder (.text-faint) ne remplace jamais le label.
Hover → bordure #aeb8b3 ; focus → bordure --green + ring 0 0 0 3px rgba(22,128,60,.14) ; erreur (.has-error) → bordure --red + ring rgba(201,60,60,.12) + message sous le champ (12 px, --red, icône circle-alert) ; disabled → fond --surface-2, texte muted, curseur interdit.
select : chevron SVG --text-2, padding droit 36 px. textarea : min-height 90 px, resize: vertical.
3.3 Contrôles binaires
Checkbox .check : 18×18, accent-color: var(--green), label 13.5 px.
Switch .switch : piste 38×22, curseur blanc 16×16 ; ON = --green + curseur translateX(16px) ; OFF = --border-strong ; focus visible ; disabled opacity .5.
3.4 Tableaux (.tbl)
Conteneur .table-wrap : border 1px --border, radius 8, fond blanc, overflow-x:auto.
Header : 12 px/600, --text-muted, fond --surface-2, padding 10 px 16 px, bordure basse --border, aligné gauche.
Lignes : padding 12 px 16 px, bordure basse --border-soft ; hover ligne → --surface-2 (150 ms).
Hiérarchie : .cell-main (600 --text) / .cell-sub (12.5 muted). Actions alignées à droite (.tbl-actions).
3.5 Statuts / badges (.status · .dottext)
Pills .status (réservées à Statut / Priorité / État / Catégorie) : 12.5px/500, padding 3px 9px, radius 999, toujours point + libellé.
success : fond --green-soft, texte --green-deep, bord --green-border, point --green.
info : fond --info-soft, texte #1d4f8f, bord #c4d8ee, point --blue-info.
warning : fond --amber-soft, texte #8a5a12, bord --amber-border, point --amber.
danger : fond --red-soft, texte --red-dark, bord --red-border, point --red.
neutral : --surface-2 / --text-2 / --border / point --text-faint.
.dottext : point 8×8 + texte 13 px, sans pilule (couleurs .dot-green/.dot-red/.dot-amber/.dot-gray).
Accessibilité : l'état n'est jamais communiqué par la couleur seule.
3.6 Alertes (.alert)
Padding 12px 16px, radius 8, gap 12, icône 18 px + titre strong + description.

info : --info-soft / #c4d8ee / #1d4f8f · success : --green-soft / --green-border / --green-deep · warning : --amber-soft / --amber-border / #7c5210 · error : --red-soft / --red-border / --red-dark.
3.7 Toast (.toast)
Fond blanc, border: 1px --border-strong, border-left: 3px (vert pour succès ; rouge pour erreur critique), radius 8, --shadow-md, font 13.5 px.
Position : bas-droit (bottom:24px; right:24px), z-index 200.
Durée (règle produit, non figée dans le DS) :
Succès informatif : disparition automatique 2–4 s.
Erreur critique : persiste jusqu'à lecture ou action explicite de l'utilisateur (bouton fermer) — ne disparaît pas seule.
3.8 Dialog / Modale (.dialog)
Fond .dialog-mask : rgba(23,32,27,.42), plein écran, padding: 9vh 20px 40px, z-index:100.
Panneau : blanc, max-width 520 px, radius 12, --shadow-md, bordure --border.
Parties : .dialog-head (titre 17/600 + X, bordure basse), .dialog-body (padding 20px 22px), .dialog-foot (actions alignées à droite, gap 10, bordure haute).
Règle produit de fermeture (deux régimes) :
Type de dialog	Fermeture autorisée
Standard / non critique	X · Escape · clic sur le fond
Critique / destructif (annuler un RDV, clôturer un compte)	X · Escape · bouton « Annuler »/« Retour ». Le clic sur le fond ne ferme jamais un dialog destructif et n'effectue jamais l'action.
3.9 Onglets
Segmented .tabs : fond --surface-2, bordure --border, radius 6, padding 3 ; .tab padding 6px 14px, radius 4, 13/500 ; actif = fond blanc + --green-deep/600 + --shadow-xs.
Underline .underline-tab : actif = --green-deep, bordure basse 2px solid --green.
3.10 Stepper (.stepper) — référentiel
Cercle .step-dot 30×30, rond, border 1.5px --border-strong, chiffre 13/600.
États : done (cercle --green, icône check, ligne précédente verte), active (cercle --green-soft, bordure verte + ring rgba(22,128,60,.14), label --text/600), locked (opacité .5, non accessible).
Règles de progression : revenir en arrière librement ; avancer uniquement si l'étape active a une sélection ; les étapes futures restent verrouillées. L'utilisateur sait toujours où il est, ce qu'il a choisi, ce qui vient ensuite.
3.11 Items de sélection (.selection-item) — ex-« cards cliquables »
Changement conceptuel : ces composants sont des options de sélection, pas des cartes décoratives — en cohérence avec la philosophie « zéro carte inutile ». Le vocabulaire Selection Item lève l'ambiguïté pour l'équipe.

Item simple (spécialité / médecin) : .selection-item, flex:1, min-width:210–220 px, border: 1px --border-strong, radius 8, padding 16, fond blanc, texte introductif 600 + sous-texte muted.
États : hover → bordure verte ; .selected → bordure --green + fond --green-soft + texte --green-deep/600 ; êtes indisponibles → opacité .5 + cursor:not-allowed (non sélectionnables).
--selection-item de date (jour) : tuile compacte ; jour (12 muted) + date (15/600) + indicateur « Disponible » (vert) / « Complet » (voilé, désactivé).
3.12 Grille de créneaux (.slot-grid / .slot)
Grille repeat(auto-fill, minmax(120px,1fr)), gap 10.
.slot : bordure --border-strong, radius 6, padding 10, centré, 13.5 px/500, texte --text-2.
Hover → bordure/texte verts ; .selected → fond --green-soft + bordure verte + texte --green-deep/600 ; disabled → opacité .4 + barré + curseur interdit.
3.13 Nav (sidebar / header) — voir §04.
3.14 États vides / chargement / erreur
Empty .empty : centré, padding 48px 24px, border 1px dashed --border-strong, radius 12, fond blanc ; icône 22 px dans anneau 46×46 --surface-2 ; titre 15/600 ; texte muted (max 40 ch) ; toujours une action.
Skeleton .skeleton : barres grises animées. Avertissement : le /dégradé du skeleton est exclusivement fonctionnel et limité à l'animation de chargement — il ne constitue ni un élément de branding ni de décoration (conforme à l'interdiction des gradients décoratifs).
Erreur : .alert-error + lien « Réessayer » (texte vert 500).
04 · LAYOUT
4.1 Architecture générale
┌─ SIDEBAR 244px (sticky) ─┬─ HEADER 60px (sticky) ────────┐
│  Brand + tricolore       │  Breadcrumb · actions · bell  │
│  Nav (groupes)           ├───────────────────────────────┤
│  ·············            │  PAGE max 1180px              │
│  Utilisateur             │  (padding 28/32/32/64)         │
└──────────────────────────┴───────────────────────────────┘
--sidebar-w: 244px · --header-h: 60px. Header z-index:40.

4.2 Sidebar
Fond --surface, bordure droite --border. Aucun glassmorphism / dégradé / glow.
Marque : hauteur 60 px, bordure basse, padding 0 20px. Monogramme 30×30 --green, texte blanc (initiales Ts) + ligne tricolore 3 px en bas ; texte Tsiry 600 + small « Centre Hospitalier ».
Navigation : padding 12 ; groupes label 11/600 uppercase --text-faint. Item .nav-item : gap 10, padding 8px 10px, radius 6, 13.5px/500, --text-2, icône 17 px muted ; actif = fond --green-soft, texte --green-deep/600, icône verte + indicateur vertical 3 px vert (gauche) ; hover = --surface-2.
Groupes : « Fondation » (Design System, Layout global) · « Pages » (Accueil, Nouveau RDV, Mes RDV, Historique, Profil, 🚨 Salle de triage).
Pied : avatar 34×34 rond (--green-soft/--green-deep) + nom 13/600 + rôle muted + bouton settings.
4.3 Header
Fond blanc, bordure basse, hauteur 60, padding 0 24px, display:flex gap 16. Contenu : breadcrumb (13 px, séparateurs /), espace flexible, bouton bell, bouton primaire « Nouveau RDV ». Le titre de page vit dans la zone contenu (.page-head h1), pas dans le header.

4.4 Zone de contenu
.page : padding 28px 32px 64px; max-width 1180px; margin: 0 auto.
.page-head : marge basse 24 ; h1 30/600 + sous-texte 14 muted (max 60 ch). .crumb-row : Tsiry / Parent / Courant, lien hover vert.
.sec : margin-bottom 40px ; .sec-head : h2 + border-bottom --border + .tag 12 muted.
.panel : blanc, border 1px --border, radius 8, padding 20 — seule carte tolérée, réservée à l'isolation conceptuelle ; jamais imbriquée.
05 · PAGES UI
5.1 Tableau de bord (Accueil)
Objectif : vue de synthèse immédiate de l'activité du patient (prochain RDV, RDV à venir, ticket) et accès rapide aux actions.

Structure : header (breadcrumb Tsiry / Accueil) · h1 « Accueil » + sous-texte + bouton « Nouveau rendez-vous » (primaire) à droite · puis Résumé opérationnel → Actions principales → Prochains rendez-vous → Activité récente.

Résumé opérationnel (remplace le concept de « KPI cards ») — 3 informations utiles, sans mimétisme de dashboard SaaS :

Information	Valeur exemple	Sous-texte
Prochain rendez-vous	18 août 2026 · 09h30	Dr. H. Raveloson — Cardiologie
Rendez-vous à venir	2	Dont 1 à confirmer
État du ticket	En attente	Dernière activité il y a 40 min
Rendu : tuiles .panel discrètes (border, radius 8, padding 16) ; libellé .k-label 12.5 muted ; valeur 22/600 ; sous-info muted.

Actions principales : bouton primaire « Prendre rendez-vous » (icône calendar-plus) ; secondaires « État de mon ticket » (shield-alert), « Mon historique » (file-text).

Prochains rendez-vous : tableau .tbl (Date / Médecin / Spécialité / Établissement / Statut / Action) — 2 lignes. Sous le tableau, alerte .alert-info « Prochain RDV mis en avant » (rappel : carte d'identité + numéro patient).

Activité récente : liste .panel à rows (icône 17 px + texte 13.5 + horodatage 12 muted), bordure basse.

Interactions : « Nouveau rendez-vous » → page Nouveau RDV ; « Tout voir » → Mes rendez-vous ; « Détails » → vue détail (impl.). Les vues basculent avec fondu fadeIn 150 ms, scroll en haut.

5.2 Nouveau rendez-vous
Objectif : guider l'utilisateur d'une intention à un rendez-vous réservé, en sachant toujours où il en est.

Structure : breadcrumb Tsiry / Rendez-vous / Nouveau rendez-vous · h1 + sous-texte · stepper 5 étapes (Spécialité → Médecin → Date → Heure → Confirmation) · corps .step-body (max-width 760) · barre d'action « Précédent » (secondaire, désactivée à l'étape 1) / « Continuer » (primaire).

Progression : uniquement en avant par étapes (états done/active/locked), retour libre. Changement d'étape → toast « Étape suivante : [Nom] ». Validation finale → toast de succès, puis → Mes rendez-vous.

Étapes (détaillées au §08 Business Rules / §07 User Flows) :

Spécialité — 6 .selection-item (Cardiologie, Gynécologie, Médecine interne, Pédiatrie, Dermatologie, Ophtalmologie) chacune avec praticien référent.
Médecin — .selection-item avec avatar 38 px + cabinet + disponibilité (verte) ; contexte : « Spécialité : Cardiologie ».
Date — 6 tuiles .selection-item de jour, avec état « Disponible » / « Complet » (désactivé) + note « Les jours complets sont désactivés ».
Heure — .slot-grid (créneaux 30 min), contexte « Dr. X — [date] » ; créneaux indisponibles désactivés.
Confirmation — tableau récap (labels muted gauche / valeurs 600 droite) + alerte .alert-warning « Vérifiez avant validation ».
Dates : le document présente les dates au format « 18 août 2026 » pour le jour de la semaine est calculé dynamiquement par le système — jamais codé en dur dans l'interface ni dans la logique.

5.3 Mes rendez-vous
Objectif : consulter, filtrer, détailler, reporter ou annuler des rendez-vous.

Structure : breadcrumb · h1 « Mes rendez-vous » + sous-texte + bouton « Nouveau rendez-vous » · filtres segmented (À venir — actif / Passés / Annulés) · tableau .tbl.

Colonnes : Date (main + sub heure) / Médecin (main + sub cabinet) / Spécialité / Établissement / Statut / Actions (droite).

Actions par statut : Confirmé → Détails + Reporter (tertiaire) ; En attente → Détails + Annuler (danger → dialog destructif) ; À confirmer → Détails.
Lignes exemple : 18 août 2026 · 09h30 / Dr. Raveloson · Cardiologie · Bloc B · Confirmé ; 22 août 2026 · 14h00 / Dr. Andria · Gynécologie · Bloc C · En attente ; 28 août 2026 · 11h00 / Dr. Rasolo · Médecine interne · Urgences · À confirmer.

Interactions : changement d'onglet → bascule active + toast « Filtre : [nom] » ; catégorie vide → empty state « Aucun rendez-vous dans cette catégorie ».

Dialog d'annulation : titre « Annuler ce rendez-vous ? », corps rappelant le RDV + conséquence + checkbox « Envoyer une notification à l'établissement », actions Retour / Annuler le RDV (danger-solid). Régime destructif : fermeture par X / Escape / Retour uniquement (pas de clic extérieur, §3.8).

5.4 Historique
Objectif : lire l'historique médical et les consultations passées, de façon lisible et filtrable.

Structure : breadcrumb · h1 « Historique » + sous-texte · barre de filtres (recherche control placeholder « Rechercher un médecin, une date… » max 300 px + select spécialité max 220 px) · tableau .tbl · section « Dernière consultation ».

Tableau : Date / Médecin (main + cabinet) / Spécialité / Type / Compte-rendu (statut .status « Disponible » success, « En cours » neutral). Lignes exemple : 12 mars 2026 · 02 février 2026 · 17 janvier 2026.

Dernière consultation : .panel — titre 15/600 « Suivi cardiologique — Dr. H. Raveloson », métadonnées (12 mars 2026 · 09h30 · Bloc B), texte du compte-rendu (max 60 ch) + mention « Compte-rendu signé numériquement », bouton « Télécharger » (download).

Interactions : filtrage temps réel ; « Télécharger » → export (impl.).

5.5 Profil
Objectif : gestion des données personnelles, coordonnées, administratif, préférences, sécurité — façon paramètres de logiciel professionnel.

Structure : breadcrumb · h1 · bandeau identité .panel (avatar 56 px + nom 16/600 + statut « Dossier actif » + bouton Modifier) · 2 colonnes : principale (flex 2) à 4 sections formulaires ; latérale sticky (flex 1) « Informations administratives ».

Informations personnelles (form 2×2) : Nom complet, Date de naissance, Sexe (select), Groupe sanguin (input désactivé « O+ », non modifiable).
Coordonnées : E-mail, Téléphone, Adresse (pleine largeur).
Préférences : 3 switchs — « Recevoir un SMS de rappel de RDV » (ON), « Recevoir les comptes-rendus par e-mail » (OFF), « Notifications de passage en file » (ON).
Sécurité : « Changer le mot de passe » (key-round), « Vérifier mon numéro » (smartphone) → workflows associés (impl.) ; séparateur ; « Demander la clôture du compte » (danger user-round-x) + note « réversible dans un délai de 30 jours ». Clôture → dialog destructif obligatoire.
Colonne latérale (lecture seule) : Numéro patient « TSR-0041 » · Mutuelle « CNaPS » · Dossier depuis « 2019 » · Médecin traitant « Dr. H. Raveloson » · bouton « Exporter mon dossier » (download, largeur complète).
Interactions : « Enregistrer » par section → toast succès ; switchs persistés immédiatement ; champs désactivés non éditables ; actions destructives → dialog de confirmation.

5.6 Salle de triage / Urgences (documentation détaillée)
Objectif : module critique visant VISIBILITÉ · RAPIDITÉ · HIÉRARCHIE · ZÉRO DISTRACTION. L'information critique ressort immédiatement ; le rouge est réservé aux situations réellement critiques ; aucun effet lumineux ni animation excessive pour signaler une urgence. Densité élevée (§1.3).

5.6.1 File des tickets
Tableau unique .tbl trié par niveau de triage puis heure d'arrivée. Structure des colonnes : Ticket · Patient · Constantes · Triage · Section · Attente · Actions. Chaque ligne = un ticket.
Ordre de priorité : Critique → Urgent → Standard → Non urgent ; à gravité égale, ordre d'arrivée.

5.6.2 Identification
Recherche ticket : champ .control en haut de zone (critère : n° de ticket, nom, n° patient). Résultats en liste .list-row compacte.
Identification patient : récupération du dossier après sélection du ticket/nom ; si dossier introuvable → alert-error + proposition de création de dossier rapide (impl.).
5.6.3 Saisie des constantes
Bloc .panel dédié à la saisie des constantes : PA, Pouls, Température, SatO2, Glasgow. Champs .control, saisie rapide clavier-first, Enter navigue vers le champ suivant. Validation de plage immédiate (erreur .has-error si valeur hors bornes). Bouton « Valider les constantes » (primaire).

5.6.4 Calcul / affichage du niveau de triage
Après validation, niveau calculé et affiché via .status :

Critique → .status-danger (fond --red-soft) + libellé explicite, jamais la couleur seule.
Urgent → .status-warning.
Standard → .status-info.
Non urgent → .status-neutral.
Un récapitulatif des constantes et du score est affiché (texte).
5.6.5 Position dans la file
Colonne dédiée montrant la position (« Pos. 3 »). La position n'est pas figée : elle est recalculée dynamiquement à chaque modification de la file (arrivée de cas plus critiques, départ de patients, changement de triage).

5.6.6 Temps d'attente
Colonne Attente affichant une fourchette estimée (ex. « ≈ 8 min », « ≈ 42 min », « Immédiat » pour les cas critiques). Estimation dérivée de la position + cadence moyenne du service (règle métier, §08).

5.6.7 États critiques
La ligne d'un patient critique se distingue par : lignage sur fond --red-soft, badge ticket .status-danger, temps d'attente « Immédiat », signal d'alerte en tête de zone (alert-error « Patient en état critique — salle 1 · #CR-3321 · prise en charge immédiate requise »). Aucune animation clignotante : l'alerte est statique mais visuellement forte (couleur + icon + libellé). Le rouge est utilisé uniquement ici.

5.6.8 Recalcul de position
Règle : à chaque événement de file (nouveau ticket prioritaire, changement de triage, prise en charge, sortie), les positions et temps d'attente de toute la file sont recalculés. Les lignes concernées se mettent à jour ; un toast éventuel informe l'agent d'une reclassement (s'il y a lieu).

5.6.9 Workflow complet
Patient enregistré (borné/accueil)
   → [Recherche ticket]
   → [Identification patient]
   → [Saisie constantes]
   → [Calcul & affichage triage]
   → ◆ Niveau critique ? → alerte critique + placement tête de file
   → Position + temps d'attente affichés
   → Prise en charge → sortie de file / transfert salle
Actions par ligne : Critiques → Prendre en charge (.btn-danger-solid) ; autres → Fiche (secondaire) + Orienter (tertiaire) selon contexte.

5.6.10 États d'erreur
Ticket introuvable → alert-error + invite à correction/saisie.
Constantes hors bornes → .has-error + message sous champ.
Surcharge de file (attente > seuil) → alert-warning « File saturée », sans alerte lumineuse.
5.6.11 Responsive
Tablette : tableau défilable horizontalement, conservation de l'ordre de priorité.
Mobile : le tableau devient une liste de fiches --selection-item/.list-row structurées triées par priorité, chaque fiche regroupant ticket, patient, constantes, triage, position, attente, action. La fiche critique reste surlignée --red-soft.
06 · UX RULES (règles transversales)
Zéro carte décorative : une info n'appelle pas une carte ; elle appelle section → titre → contenu → séparation. Les .panel/.selection-item sont réservés à l'isolation conceptuelle ou à la sélection (cf. §03.11).
Zéro badge décoratif : les badges ne couvrent que Statut / Priorité / État / Catégorie.
Toujours l'état suivant : chaque page/vue indique où je suis, ce que je peux faire, l'information importante, l'action suivante, l'état de mon dossier/ticket/RDV.
Redondance sémantique : couleur + libellé + (parfois) icône — jamais la couleur seule.
Feedback de toute action : toast succès (2–4 s) ou toast erreur persistant selon criticité.
Progression guidée : stepper ; les algorithmes/validations sont expliqués en clair.
Réduction des animations : transitions d'état uniquement, 150 ms ; utilisable avec animations désactivées.
Texte de service hospitalier réel : « Prenez rendez-vous avec un médecin », « Consultez vos prochains rendez-vous », « Vérifiez l'état de votre ticket » — jamais de slogan marketing.
07 · USER FLOWS
Notation : [Écran] page · {Action} interaction · → transition · ◆ décision. (impl.) = comportement métier prévu, non représenté figé par la maquette.

7.1 Création d'un rendez-vous
[Accueil] → {clique "Nouveau rendez-vous"} → [Nouveau RDV : Spécialité]
  {sélectionne une spécialité} {Continuer}
  → [Médecin] {sélectionne un médecin} {Continuer}
  → [Date] {sélectionne un jour disponible} {Continuer}
  → [Heure] {sélectionne un créneau} {Continuer}
  → [Résumé] {vérifie} {clique "Confirmer le rendez-vous"}
  → ◆ Confirmation réussie ?
      Oui → toast « RDV confirmé » → [Mes rendez-vous]
      Non → alert-error (ex. créneau perdu) → retour à [Heure]
Points de blocage : jour complet (désactivé), créneau occupé (désactivé). Abandon possible à tout moment.

7.2 Consultation des rendez-vous
[Accueil]/[Header] → [Mes rendez-vous]
  {Filtre onglet : À venir / Passés / Annulés}
  ◆ catégorie vide ? → empty state + action
  : → tableau avec statuts (point + libellé)
  {clique "Détails"} → détail RDV *(impl.)* {Retour}
  {clique "Tout voir"} depuis Accueil → même écran
7.3 Modification / annulation
Annulation (chemin complet) :

[Mes rendez-vous] ligne "En attente" {clique "Annuler"}
  → Dialog destructif « Annuler ce rendez-vous ? »
     ◆ {Retour} → ferme, aucune modification
     {coche "Envoyer une notification…"}
     {clique "Annuler le RDV"} → toast succès, ligne passe en "Annulé"
     {Escape / X} → ferme sans action
     (*le clic sur le fond ne ferme pas un dialog destructif*)
Report (modification) :

[Mes rendez-vous] {clique "Reporter"} → reprise du parcours de réservation
   (étapes Spécialité→…→Confirmation pré-remplies) → nouvelle date/heure
   → Confirmer → toast + mise à jour *(impl.)*
7.4 Consultation de l'historique
[Sidebar: Historique] → [Historique]
  {saisit mot-clé} → filtre du tableau
  {sélectionne une spécialité} → filtre du tableau
  {clique "Télécharger"} → export du compte-rendu *(impl.)*
7.5 Consultation / modification du profil
[Sidebar: Profil] → [Profil]
  ◆ Infos personnelles / Coordonnées : modifie → {Enregistrer} → toast succès
  Préférences : {bascule un switch} → sauvegarde immédiate
  Sécurité : {Changer le mot de passe} · {Vérifier mon numéro} → workflows *(impl.)*
  Danger : {Demander la clôture} → dialog destructif → confirmation serveur *(impl.)*
  Administration : {Exporter mon dossier} → export *(impl.)*
7.6 Triage (chemin agent)
[Sidebar: Salle de triage] → [File des tickets]
  {recherche ticket / patient}
  → [Identification patient]
  → [Saisie constantes] → validation
  → [Calcul & affichage du triage]
  → ◆ critique ? → alert-error + placement tête de file
  → position + attente affichées
  {Prendre en charge} → sortie / transfert salle
7.7 Navigation globale
Sidebar change d'écran (item actif = fond vert pâle + indicateur vertical) ; fondu fadeIn 150 ms + scroll en haut ; breadcrumb reflète la position ; bouton « Nouveau RDV » atteignable d'Accueil & Mes RDV ; mobile ≤ 820 px → drawer + scrim.

08 · BUSINESS RULES
8.1 Réservation
Spécialité : liste fermée du catalogue de l'établissement ; chaque spécialité a un praticien référent affiché.
Médecin : liste limitée à la spécialité choisie ; seuls les praticiens disponibles sont proposés ; un praticien peut avoir des jours de disponibilité propres.
Date : seuls les jours ouverts avec reste de créneaux sont sélectionnables ; les jours complets sont visibles mais désactivés.
Heure : créneaux de 30 min ; un créneau déjà pris n'est plus sélectionnable ; verrouillage atomique (premier arrivé, premier servi) — si le créneau est perdu pendant la saisie, erreur renvoyée à l'étape Heure.
Confirmation : écriture serveur + notification de confirmation ; le statut résultant est « En attente » ou « Confirmé » selon la règle de l'établissement.
Dates : le jour de la semaine est toujours calculé dynamiquement à partir de la date ; jamais de libellés de jour codés en dur (évite les erreurs calendaires).
8.2 Rdv / Historique
Filtres par catégorie (À venir / Passés / Annulés) ; « Reporter » = reprise du parcours pré-rempli.
Compte-rendu « Disponible » / « En cours » / téléchargeable.
Conservation d'un historique lisible et filtrable (recherche + spécialité).
8.3 Profil & RGPD hospitalier
Champs réglementés (groupe sanguin, identité) en lecture seule selon le rôle de l'utilisateur.
Clôture de compte réversible 30 jours ; toujours confirmée par dialog destructif.
Données d'exemple fictives, non exploitables en production.
8.4 Triage (règles métier)
Priorité de file : Critique > Urgent > Standard > Non urgent, puis ordre d'arrivée.
Position et temps d'attente recalculés dynamiquement sur tout événement (nouveau cas plus critique, changement de triage, prise en charge, sortie).
Niveau de triage calculé à partir des constantes (PA, pouls, T°, SatO2, Glasgow) avec validation de plages.
Un cas critique est placé en tête et signalé par alert-error statique (couleur + icône + libellé) ; la prise en charge le sort de la file.
Alerte de saturation (attente > seuil) en .alert-warning, sans animation.
Aucune information véhiculée par la couleur seule.
09 · ACCESSIBILITY
WCAG 2.2 AA visé : contrastes assurés sur les verts/gris (textes sur fonds), texte body 14–15 px.
Jamais la couleur seule : statuts = point + libellé ; danger = dfanger + texte.
Focus clavier : :focus-visible 2px solid --green + offset 2 sur tous les éléments interactifs ; inputs → ring vert ; zones cliquables ≥ 34–40 px.
prefers-reduced-motion: reduce désactive toute animation/transition.
Labels persistés (jamais remplacés par des placeholders) ; messages d'erreur sous les champs, associables via aria-describedby.
Hiérarchie sémantique (h1/h2/h3 logiques), zones cliquables correctes pour lecteurs d'écran.
Densité adaptée au rôle pour limiter la fatigue visuelle (patient = confortable ; agent/triage = dense mais lisible).
10 · RESPONSIVE
Breakpoint	Comportement
Desktop (défaut)	Sidebar 244 px fixe ; contenu max 1180 px
≤ 1024 px	Sidebar 220 px ; padding page 24 px
≤ 820 px	Sidebar → drawer (position fixed, translation X), scrim rgba(23,32,27,.4), toggle bouton menu ; KPIs/résumé opérationnel 2 colonnes
≤ 520 px	Résumé opérationnel 1 colonne ; padding 20/16 ; breadcrumb masqué ; grilles de créneaux 3 colonnes ; tableaux complexes → listes structurées (.list-row / .selection-item)
Un dashboard desktop n'est jamais simplement « réduit » jusqu'à devenir illisible : il est restructuré en listes/fiches. Le triage conserve, sur mobile, l'ordre de priorité et le surlignage critique.

11 · IMPLEMENTATION (recommandations)
Ces recommandations consolident la stratégie de mise en œuvre à partir des spécifications ci-dessus — elles ne font référence à aucun style non observé.

Tokenisation : exporter le Design System en variables CSS (--green…, neutralies, espacements, radius, ombres, --dur/--ease) + éventuellement .tokens.json/ts.
Bibliothèque de composants (cf. §03) : Button, Input, Select, Textarea, Checkbox, Radio, Switch, Tabs (segmented + underline), Table, Status/Badge, Alert, Toast, Dialog (2 régimes), Breadcrumb, Stepper, TimeSlot, SelectionItem, Avatar, EmptyState, Skeleton, ErrorState, Field.
États complets sur chaque composant : default / hover / focus / active / pressed / disabled / loading / error.
Icônes : intégration stable de Lucide, tailles 16/17/18/22, trait 2 arrondi.
Services/API : spécialités, médecins/disponibilités, créneaux (verrouillage atomique), rendez-vous, tickets/triage (recalcul position), historique, profil. Erreurs mappées sur les composants alert/error définis.
Accessibilité : audits AA, prefers-reduced-motion, labels persistés, contrastes vérifiés.
Tests : exécution des user flows (§07) en desktop / tablette / mobile, y compris les cas de file de triage.
