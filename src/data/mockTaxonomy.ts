import type { TaxonNode } from "../types";

// Realistic mock taxonomy data modeled after 3Bee's Taxa table
// Hierarchy: Animalia → (Aves, Mammalia, Insecta, Amphibia, Reptilia) → Orders → Families → Genera → Species
export const mockTaxonomy: TaxonNode[] = [
  // Root
  { id: 1, name: "Animalia", rank: "kingdom", parent_id: null, species_count: 2847, iconic_taxa: "animalia", has_children: false },
  { id: 47126, name: "Plantae", rank: "kingdom", parent_id: null, species_count: 1523, iconic_taxa: "plantae", has_children: false },
  { id: 47170, name: "Fungi", rank: "kingdom", parent_id: null, species_count: 312, iconic_taxa: "fungi", has_children: false },

  // Phyla
  { id: 2, name: "Chordata", rank: "phylum", parent_id: 1, species_count: 1980, iconic_taxa: "animalia", has_children: false },
  { id: 47120, name: "Arthropoda", rank: "phylum", parent_id: 1, species_count: 867, iconic_taxa: "insecta", has_children: false },
  { id: 47115, name: "Mollusca", rank: "phylum", parent_id: 1, species_count: 156, iconic_taxa: "mollusca", has_children: false },
  { id: 211194, name: "Magnoliophyta", rank: "phylum", parent_id: 47126, species_count: 1320, iconic_taxa: "plantae", has_children: false },
  { id: 47169, name: "Basidiomycota", rank: "phylum", parent_id: 47170, species_count: 210, iconic_taxa: "fungi", has_children: false },

  // Classes
  { id: 3, name: "Aves", common_name: "Birds", rank: "class", parent_id: 2, species_count: 842, iconic_taxa: "aves", has_children: false },
  { id: 40151, name: "Mammalia", common_name: "Mammals", rank: "class", parent_id: 2, species_count: 385, iconic_taxa: "mammalia", has_children: false },
  { id: 26036, name: "Amphibia", common_name: "Amphibians", rank: "class", parent_id: 2, species_count: 198, iconic_taxa: "amphibia", has_children: false },
  { id: 26036, name: "Reptilia", common_name: "Reptiles", rank: "class", parent_id: 2, species_count: 312, iconic_taxa: "reptilia", has_children: false },
  { id: 47178, name: "Actinopterygii", common_name: "Ray-finned Fishes", rank: "class", parent_id: 2, species_count: 243, iconic_taxa: "actinopterygii", has_children: false },
  { id: 47158, name: "Insecta", common_name: "Insects", rank: "class", parent_id: 47120, species_count: 756, iconic_taxa: "insecta", has_children: false },
  { id: 47119, name: "Arachnida", common_name: "Arachnids", rank: "class", parent_id: 47120, species_count: 111, iconic_taxa: "arachnida", has_children: false },

  // AVES Orders
  { id: 7251, name: "Passeriformes", common_name: "Perching Birds", rank: "order", parent_id: 3, species_count: 456, iconic_taxa: "aves", has_children: false },
  { id: 71261, name: "Accipitriformes", common_name: "Raptors", rank: "order", parent_id: 3, species_count: 89, iconic_taxa: "aves", has_children: false },
  { id: 3726, name: "Strigiformes", common_name: "Owls", rank: "order", parent_id: 3, species_count: 45, iconic_taxa: "aves", has_children: false },
  { id: 67561, name: "Piciformes", common_name: "Woodpeckers", rank: "order", parent_id: 3, species_count: 67, iconic_taxa: "aves", has_children: false },
  { id: 67563, name: "Columbiformes", common_name: "Doves & Pigeons", rank: "order", parent_id: 3, species_count: 34, iconic_taxa: "aves", has_children: false },
  { id: 67565, name: "Charadriiformes", common_name: "Shorebirds", rank: "order", parent_id: 3, species_count: 78, iconic_taxa: "aves", has_children: false },
  { id: 67567, name: "Anseriformes", common_name: "Waterfowl", rank: "order", parent_id: 3, species_count: 73, iconic_taxa: "aves", has_children: false },

  // MAMMALIA Orders
  { id: 40153, name: "Carnivora", common_name: "Carnivores", rank: "order", parent_id: 40151, species_count: 98, iconic_taxa: "mammalia", has_children: false },
  { id: 40154, name: "Chiroptera", common_name: "Bats", rank: "order", parent_id: 40151, species_count: 67, iconic_taxa: "mammalia", has_children: false },
  { id: 40155, name: "Rodentia", common_name: "Rodents", rank: "order", parent_id: 40151, species_count: 120, iconic_taxa: "mammalia", has_children: false },
  { id: 40156, name: "Artiodactyla", common_name: "Even-toed Ungulates", rank: "order", parent_id: 40151, species_count: 52, iconic_taxa: "mammalia", has_children: false },
  { id: 40157, name: "Cetacea", common_name: "Whales & Dolphins", rank: "order", parent_id: 40151, species_count: 48, iconic_taxa: "mammalia", has_children: false },

  // INSECTA Orders
  { id: 47157, name: "Lepidoptera", common_name: "Butterflies & Moths", rank: "order", parent_id: 47158, species_count: 234, iconic_taxa: "insecta", has_children: false },
  { id: 47156, name: "Coleoptera", common_name: "Beetles", rank: "order", parent_id: 47158, species_count: 189, iconic_taxa: "insecta", has_children: false },
  { id: 47201, name: "Hymenoptera", common_name: "Bees, Wasps & Ants", rank: "order", parent_id: 47158, species_count: 178, iconic_taxa: "insecta", has_children: false },
  { id: 47744, name: "Diptera", common_name: "Flies", rank: "order", parent_id: 47158, species_count: 155, iconic_taxa: "insecta", has_children: false },
  { id: 47792, name: "Odonata", common_name: "Dragonflies", rank: "order", parent_id: 47158, species_count: 56, iconic_taxa: "insecta", has_children: false },

  // Passeriformes Families
  { id: 9701, name: "Paridae", common_name: "Tits & Chickadees", rank: "family", parent_id: 7251, species_count: 34, iconic_taxa: "aves", has_children: false },
  { id: 9702, name: "Sylviidae", common_name: "Warblers", rank: "family", parent_id: 7251, species_count: 78, iconic_taxa: "aves", has_children: false },
  { id: 9703, name: "Turdidae", common_name: "Thrushes", rank: "family", parent_id: 7251, species_count: 45, iconic_taxa: "aves", has_children: false },
  { id: 9704, name: "Corvidae", common_name: "Crows & Jays", rank: "family", parent_id: 7251, species_count: 38, iconic_taxa: "aves", has_children: false },
  { id: 9705, name: "Fringillidae", common_name: "Finches", rank: "family", parent_id: 7251, species_count: 52, iconic_taxa: "aves", has_children: false },
  { id: 9706, name: "Muscicapidae", common_name: "Old World Flycatchers", rank: "family", parent_id: 7251, species_count: 43, iconic_taxa: "aves", has_children: false },
  { id: 9707, name: "Motacillidae", common_name: "Wagtails & Pipits", rank: "family", parent_id: 7251, species_count: 28, iconic_taxa: "aves", has_children: false },
  { id: 9708, name: "Hirundinidae", common_name: "Swallows", rank: "family", parent_id: 7251, species_count: 22, iconic_taxa: "aves", has_children: false },

  // Accipitriformes Families
  { id: 9711, name: "Accipitridae", common_name: "Hawks & Eagles", rank: "family", parent_id: 71261, species_count: 67, iconic_taxa: "aves", has_children: false },
  { id: 9712, name: "Falconidae", common_name: "Falcons", rank: "family", parent_id: 71261, species_count: 22, iconic_taxa: "aves", has_children: false },

  // Carnivora Families
  { id: 41944, name: "Canidae", common_name: "Dogs & Wolves", rank: "family", parent_id: 40153, species_count: 24, iconic_taxa: "mammalia", has_children: false },
  { id: 41945, name: "Felidae", common_name: "Cats", rank: "family", parent_id: 40153, species_count: 18, iconic_taxa: "mammalia", has_children: false },
  { id: 41946, name: "Mustelidae", common_name: "Weasels & Otters", rank: "family", parent_id: 40153, species_count: 32, iconic_taxa: "mammalia", has_children: false },
  { id: 41947, name: "Ursidae", common_name: "Bears", rank: "family", parent_id: 40153, species_count: 8, iconic_taxa: "mammalia", has_children: false },

  // Hymenoptera Families
  { id: 47221, name: "Apidae", common_name: "Bees", rank: "family", parent_id: 47201, species_count: 89, iconic_taxa: "insecta", has_children: false },
  { id: 47222, name: "Formicidae", common_name: "Ants", rank: "family", parent_id: 47201, species_count: 56, iconic_taxa: "insecta", has_children: false },
  { id: 47223, name: "Vespidae", common_name: "Wasps", rank: "family", parent_id: 47201, species_count: 33, iconic_taxa: "insecta", has_children: false },

  // Lepidoptera Families
  { id: 47224, name: "Nymphalidae", common_name: "Brush-footed Butterflies", rank: "family", parent_id: 47157, species_count: 67, iconic_taxa: "insecta", has_children: false },
  { id: 47225, name: "Pieridae", common_name: "Whites & Sulphurs", rank: "family", parent_id: 47157, species_count: 34, iconic_taxa: "insecta", has_children: false },
  { id: 47226, name: "Lycaenidae", common_name: "Gossamer-winged Butterflies", rank: "family", parent_id: 47157, species_count: 45, iconic_taxa: "insecta", has_children: false },

  // Paridae Genera
  { id: 14801, name: "Parus", common_name: "Great Tits", rank: "genus", parent_id: 9701, species_count: 8, iconic_taxa: "aves", has_children: false },
  { id: 14802, name: "Cyanistes", common_name: "Blue Tits", rank: "genus", parent_id: 9701, species_count: 4, iconic_taxa: "aves", has_children: false },
  { id: 14803, name: "Periparus", common_name: "Coal Tits", rank: "genus", parent_id: 9701, species_count: 3, iconic_taxa: "aves", has_children: false },

  // Corvidae Genera
  { id: 14810, name: "Corvus", common_name: "Crows & Ravens", rank: "genus", parent_id: 9704, species_count: 12, iconic_taxa: "aves", has_children: false },
  { id: 14811, name: "Pica", common_name: "Magpies", rank: "genus", parent_id: 9704, species_count: 4, iconic_taxa: "aves", has_children: false },
  { id: 14812, name: "Garrulus", common_name: "Jays", rank: "genus", parent_id: 9704, species_count: 3, iconic_taxa: "aves", has_children: false },

  // Turdidae Genera
  { id: 14820, name: "Turdus", common_name: "Thrushes", rank: "genus", parent_id: 9703, species_count: 15, iconic_taxa: "aves", has_children: false },
  { id: 14821, name: "Erithacus", common_name: "Robins", rank: "genus", parent_id: 9703, species_count: 3, iconic_taxa: "aves", has_children: false },

  // Accipitridae Genera
  { id: 14830, name: "Buteo", common_name: "Buzzards", rank: "genus", parent_id: 9711, species_count: 8, iconic_taxa: "aves", has_children: false },
  { id: 14831, name: "Accipiter", common_name: "Sparrowhawks", rank: "genus", parent_id: 9711, species_count: 6, iconic_taxa: "aves", has_children: false },
  { id: 14832, name: "Aquila", common_name: "Eagles", rank: "genus", parent_id: 9711, species_count: 5, iconic_taxa: "aves", has_children: false },

  // Felidae Genera
  { id: 41951, name: "Felis", common_name: "Small Cats", rank: "genus", parent_id: 41945, species_count: 6, iconic_taxa: "mammalia", has_children: false },
  { id: 41952, name: "Lynx", common_name: "Lynxes", rank: "genus", parent_id: 41945, species_count: 4, iconic_taxa: "mammalia", has_children: false },
  { id: 41953, name: "Panthera", common_name: "Big Cats", rank: "genus", parent_id: 41945, species_count: 5, iconic_taxa: "mammalia", has_children: false },

  // Canidae Genera
  { id: 41961, name: "Canis", common_name: "Dogs & Wolves", rank: "genus", parent_id: 41944, species_count: 8, iconic_taxa: "mammalia", has_children: false },
  { id: 41962, name: "Vulpes", common_name: "Foxes", rank: "genus", parent_id: 41944, species_count: 12, iconic_taxa: "mammalia", has_children: false },

  // Apidae Genera
  { id: 47231, name: "Apis", common_name: "Honey Bees", rank: "genus", parent_id: 47221, species_count: 7, iconic_taxa: "insecta", has_children: false },
  { id: 47232, name: "Bombus", common_name: "Bumblebees", rank: "genus", parent_id: 47221, species_count: 28, iconic_taxa: "insecta", has_children: false },
  { id: 47233, name: "Xylocopa", common_name: "Carpenter Bees", rank: "genus", parent_id: 47221, species_count: 15, iconic_taxa: "insecta", has_children: false },

  // Species - Parus
  { id: 100001, name: "Parus major", common_name: "Great Tit", rank: "species", parent_id: 14801, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100002, name: "Parus monticolus", common_name: "Green-backed Tit", rank: "species", parent_id: 14801, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Species - Cyanistes
  { id: 100003, name: "Cyanistes caeruleus", common_name: "Eurasian Blue Tit", rank: "species", parent_id: 14802, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100004, name: "Cyanistes teneriffae", common_name: "Canary Blue Tit", rank: "species", parent_id: 14802, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Species - Corvus
  { id: 100010, name: "Corvus corax", common_name: "Common Raven", rank: "species", parent_id: 14810, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100011, name: "Corvus corone", common_name: "Hooded Crow", rank: "species", parent_id: 14810, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100012, name: "Corvus monedula", common_name: "Jackdaw", rank: "species", parent_id: 14810, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Species - Pica
  { id: 100013, name: "Pica pica", common_name: "Eurasian Magpie", rank: "species", parent_id: 14811, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Species - Garrulus
  { id: 100014, name: "Garrulus glandarius", common_name: "Eurasian Jay", rank: "species", parent_id: 14812, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Species - Turdus
  { id: 100020, name: "Turdus merula", common_name: "Common Blackbird", rank: "species", parent_id: 14820, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100021, name: "Turdus philomelos", common_name: "Song Thrush", rank: "species", parent_id: 14820, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100022, name: "Turdus viscivorus", common_name: "Mistle Thrush", rank: "species", parent_id: 14820, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Species - Erithacus
  { id: 100023, name: "Erithacus rubecula", common_name: "European Robin", rank: "species", parent_id: 14821, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Species - Buteo
  { id: 100030, name: "Buteo buteo", common_name: "Common Buzzard", rank: "species", parent_id: 14830, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100031, name: "Buteo lagopus", common_name: "Rough-legged Buzzard", rank: "species", parent_id: 14830, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Species - Accipiter
  { id: 100032, name: "Accipiter nisus", common_name: "Eurasian Sparrowhawk", rank: "species", parent_id: 14831, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100033, name: "Accipiter gentilis", common_name: "Northern Goshawk", rank: "species", parent_id: 14831, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Species - Aquila
  { id: 100034, name: "Aquila chrysaetos", common_name: "Golden Eagle", rank: "species", parent_id: 14832, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100035, name: "Aquila fasciata", common_name: "Bonelli's Eagle", rank: "species", parent_id: 14832, species_count: 1, iconic_taxa: "aves", conservation_status: "VU", has_children: false },

  // Species - Felis
  { id: 100040, name: "Felis silvestris", common_name: "European Wildcat", rank: "species", parent_id: 41951, species_count: 1, iconic_taxa: "mammalia", conservation_status: "LC", has_children: false },
  { id: 100041, name: "Felis catus", common_name: "Domestic Cat", rank: "species", parent_id: 41951, species_count: 1, iconic_taxa: "mammalia", conservation_status: "NE", has_children: false },

  // Species - Lynx
  { id: 100042, name: "Lynx lynx", common_name: "Eurasian Lynx", rank: "species", parent_id: 41952, species_count: 1, iconic_taxa: "mammalia", conservation_status: "LC", has_children: false },
  { id: 100043, name: "Lynx pardinus", common_name: "Iberian Lynx", rank: "species", parent_id: 41952, species_count: 1, iconic_taxa: "mammalia", conservation_status: "EN", has_children: false },

  // Species - Panthera
  { id: 100044, name: "Panthera leo", common_name: "Lion", rank: "species", parent_id: 41953, species_count: 1, iconic_taxa: "mammalia", conservation_status: "VU", has_children: false },
  { id: 100045, name: "Panthera pardus", common_name: "Leopard", rank: "species", parent_id: 41953, species_count: 1, iconic_taxa: "mammalia", conservation_status: "VU", has_children: false },
  { id: 100046, name: "Panthera tigris", common_name: "Tiger", rank: "species", parent_id: 41953, species_count: 1, iconic_taxa: "mammalia", conservation_status: "EN", has_children: false },

  // Species - Vulpes
  { id: 100050, name: "Vulpes vulpes", common_name: "Red Fox", rank: "species", parent_id: 41962, species_count: 1, iconic_taxa: "mammalia", conservation_status: "LC", has_children: false },
  { id: 100051, name: "Vulpes zerda", common_name: "Fennec Fox", rank: "species", parent_id: 41962, species_count: 1, iconic_taxa: "mammalia", conservation_status: "LC", has_children: false },

  // Species - Canis
  { id: 100052, name: "Canis lupus", common_name: "Grey Wolf", rank: "species", parent_id: 41961, species_count: 1, iconic_taxa: "mammalia", conservation_status: "LC", has_children: false },
  { id: 100053, name: "Canis aureus", common_name: "Golden Jackal", rank: "species", parent_id: 41961, species_count: 1, iconic_taxa: "mammalia", conservation_status: "LC", has_children: false },

  // Species - Apis
  { id: 100060, name: "Apis mellifera", common_name: "Western Honey Bee", rank: "species", parent_id: 47231, species_count: 1, iconic_taxa: "insecta", conservation_status: "NE", has_children: false },
  { id: 100061, name: "Apis cerana", common_name: "Asian Honey Bee", rank: "species", parent_id: 47231, species_count: 1, iconic_taxa: "insecta", conservation_status: "NE", has_children: false },

  // Species - Bombus
  { id: 100062, name: "Bombus terrestris", common_name: "Buff-tailed Bumblebee", rank: "species", parent_id: 47232, species_count: 1, iconic_taxa: "insecta", conservation_status: "LC", has_children: false },
  { id: 100063, name: "Bombus pascuorum", common_name: "Common Carder Bee", rank: "species", parent_id: 47232, species_count: 1, iconic_taxa: "insecta", conservation_status: "LC", has_children: false },
  { id: 100064, name: "Bombus lapidarius", common_name: "Red-tailed Bumblebee", rank: "species", parent_id: 47232, species_count: 1, iconic_taxa: "insecta", conservation_status: "LC", has_children: false },

  // Additional families for Plantae branch
  { id: 211195, name: "Rosales", rank: "order", parent_id: 211194, species_count: 234, iconic_taxa: "plantae", has_children: false },
  { id: 211196, name: "Fabales", rank: "order", parent_id: 211194, species_count: 189, iconic_taxa: "plantae", has_children: false },
  { id: 211197, name: "Asterales", rank: "order", parent_id: 211194, species_count: 356, iconic_taxa: "plantae", has_children: false },
  { id: 211198, name: "Lamiales", rank: "order", parent_id: 211194, species_count: 278, iconic_taxa: "plantae", has_children: false },
  { id: 211199, name: "Poales", rank: "order", parent_id: 211194, species_count: 263, iconic_taxa: "plantae", has_children: false },

  { id: 211210, name: "Rosaceae", common_name: "Rose Family", rank: "family", parent_id: 211195, species_count: 89, iconic_taxa: "plantae", has_children: false },
  { id: 211211, name: "Fabaceae", common_name: "Legume Family", rank: "family", parent_id: 211196, species_count: 112, iconic_taxa: "plantae", has_children: false },
  { id: 211212, name: "Asteraceae", common_name: "Daisy Family", rank: "family", parent_id: 211197, species_count: 178, iconic_taxa: "plantae", has_children: false },
  { id: 211213, name: "Lamiaceae", common_name: "Mint Family", rank: "family", parent_id: 211198, species_count: 134, iconic_taxa: "plantae", has_children: false },
  { id: 211214, name: "Poaceae", common_name: "Grass Family", rank: "family", parent_id: 211199, species_count: 156, iconic_taxa: "plantae", has_children: false },

  // Strigiformes families
  { id: 9720, name: "Strigidae", common_name: "True Owls", rank: "family", parent_id: 3726, species_count: 35, iconic_taxa: "aves", has_children: false },
  { id: 9721, name: "Tytonidae", common_name: "Barn Owls", rank: "family", parent_id: 3726, species_count: 10, iconic_taxa: "aves", has_children: false },

  // Strigidae Genera & Species
  { id: 14840, name: "Strix", common_name: "Wood Owls", rank: "genus", parent_id: 9720, species_count: 6, iconic_taxa: "aves", has_children: false },
  { id: 14841, name: "Athene", common_name: "Little Owls", rank: "genus", parent_id: 9720, species_count: 4, iconic_taxa: "aves", has_children: false },
  { id: 14842, name: "Bubo", common_name: "Eagle Owls", rank: "genus", parent_id: 9720, species_count: 5, iconic_taxa: "aves", has_children: false },
  { id: 100070, name: "Strix aluco", common_name: "Tawny Owl", rank: "species", parent_id: 14840, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100071, name: "Athene noctua", common_name: "Little Owl", rank: "species", parent_id: 14841, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },
  { id: 100072, name: "Bubo bubo", common_name: "Eurasian Eagle-Owl", rank: "species", parent_id: 14842, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Tytonidae Genera & Species
  { id: 14843, name: "Tyto", common_name: "Barn Owls", rank: "genus", parent_id: 9721, species_count: 3, iconic_taxa: "aves", has_children: false },
  { id: 100073, name: "Tyto alba", common_name: "Barn Owl", rank: "species", parent_id: 14843, species_count: 1, iconic_taxa: "aves", conservation_status: "LC", has_children: false },

  // Ursidae Genera & Species
  { id: 41971, name: "Ursus", common_name: "Bears", rank: "genus", parent_id: 41947, species_count: 4, iconic_taxa: "mammalia", has_children: false },
  { id: 100080, name: "Ursus arctos", common_name: "Brown Bear", rank: "species", parent_id: 41971, species_count: 1, iconic_taxa: "mammalia", conservation_status: "LC", has_children: false },
  { id: 100081, name: "Ursus maritimus", common_name: "Polar Bear", rank: "species", parent_id: 41971, species_count: 1, iconic_taxa: "mammalia", conservation_status: "VU", has_children: false },

  // Mustelidae Genera & Species
  { id: 41981, name: "Mustela", common_name: "Weasels", rank: "genus", parent_id: 41946, species_count: 8, iconic_taxa: "mammalia", has_children: false },
  { id: 41982, name: "Lutra", common_name: "Otters", rank: "genus", parent_id: 41946, species_count: 3, iconic_taxa: "mammalia", has_children: false },
  { id: 100082, name: "Mustela erminea", common_name: "Stoat", rank: "species", parent_id: 41981, species_count: 1, iconic_taxa: "mammalia", conservation_status: "LC", has_children: false },
  { id: 100083, name: "Mustela nivalis", common_name: "Least Weasel", rank: "species", parent_id: 41981, species_count: 1, iconic_taxa: "mammalia", conservation_status: "LC", has_children: false },
  { id: 100084, name: "Lutra lutra", common_name: "Eurasian Otter", rank: "species", parent_id: 41982, species_count: 1, iconic_taxa: "mammalia", conservation_status: "NT", has_children: false },

  // Nymphalidae Genera & Species
  { id: 47241, name: "Vanessa", common_name: "Painted Ladies", rank: "genus", parent_id: 47224, species_count: 4, iconic_taxa: "insecta", has_children: false },
  { id: 47242, name: "Aglais", common_name: "Tortoiseshells", rank: "genus", parent_id: 47224, species_count: 3, iconic_taxa: "insecta", has_children: false },
  { id: 100090, name: "Vanessa cardui", common_name: "Painted Lady", rank: "species", parent_id: 47241, species_count: 1, iconic_taxa: "insecta", conservation_status: "LC", has_children: false },
  { id: 100091, name: "Vanessa atalanta", common_name: "Red Admiral", rank: "species", parent_id: 47241, species_count: 1, iconic_taxa: "insecta", conservation_status: "LC", has_children: false },
  { id: 100092, name: "Aglais io", common_name: "European Peacock", rank: "species", parent_id: 47242, species_count: 1, iconic_taxa: "insecta", conservation_status: "LC", has_children: false },
  { id: 100093, name: "Aglais urticae", common_name: "Small Tortoiseshell", rank: "species", parent_id: 47242, species_count: 1, iconic_taxa: "insecta", conservation_status: "LC", has_children: false },

  // Formicidae Genera & Species
  { id: 47251, name: "Formica", common_name: "Wood Ants", rank: "genus", parent_id: 47222, species_count: 12, iconic_taxa: "insecta", has_children: false },
  { id: 47252, name: "Lasius", common_name: "Garden Ants", rank: "genus", parent_id: 47222, species_count: 8, iconic_taxa: "insecta", has_children: false },
  { id: 100094, name: "Formica rufa", common_name: "Red Wood Ant", rank: "species", parent_id: 47251, species_count: 1, iconic_taxa: "insecta", conservation_status: "NT", has_children: false },
  { id: 100095, name: "Lasius niger", common_name: "Black Garden Ant", rank: "species", parent_id: 47252, species_count: 1, iconic_taxa: "insecta", conservation_status: "LC", has_children: false },
];

// Fix duplicate id for Reptilia
mockTaxonomy[10] = { id: 26037, name: "Reptilia", common_name: "Reptiles", rank: "class", parent_id: 2, species_count: 312, iconic_taxa: "reptilia", has_children: false };

// Compute has_children for all nodes
const parentIds = new Set(mockTaxonomy.map((n) => n.parent_id).filter(Boolean));
for (const node of mockTaxonomy) {
  node.has_children = parentIds.has(node.id);
}
