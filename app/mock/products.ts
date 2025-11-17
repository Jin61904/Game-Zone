// app/mock/products.ts

export const mockFeatured = [
  {
    id: "ps5-console",
    name: "PlayStation 5",
    description: "Máxima potencia para jugar sin límites.",
    price: 2999000,
    image:
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5b7b0358766011.5a2a6322a06fa.jpg",
  },
  {
    id: "xbox-series-x",
    name: "Xbox Series X",
    description: "Potencia brutal con Quick Resume.",
    price: 2899000,
    image:
      "https://i.pinimg.com/originals/40/69/0f/40690f99c58c2c299c24add3cb0a6c2d.jpg",
  },
];

export const mockProducts = [
  {
    id: "ps5-gow",
    name: "God of War Ragnarök",
    description: "Aventura épica, exclusivo de PlayStation",
    descriptionLong:
      "Embárcate en una aventura épica junto a Kratos y Atreus mientras viajan por los nueve reinos.",
    price: 259000,
    oldPrice: 339000,
    discount: 17,
    rating: 4.9,
    reviews: 2847,
    category: "ps5",
    categoryLabel: "PlayStation",
    image:
      "https://m.media-amazon.com/images/I/81RTQ3XTGeL._AC_UF1000,1000_QL80_.jpg",
    features: [
      "Modo rendimiento 60 FPS",
      "Audio 3D Tempest",
      "Compatible con DualSense",
      "Vibración háptica avanzada",
    ],
  },
  {
    id: "xbox-halo",
    name: "Halo Infinite",
    description: "Shooter legendario de Xbox",
    descriptionLong:
      "El Jefe Maestro está de vuelta en la mayor campaña de Halo creada hasta ahora.",
    price: 199000,
    oldPrice: 245000,
    discount: 13,
    rating: 4.7,
    reviews: 1850,
    category: "xbox",
    categoryLabel: "Xbox",
    image:
      "https://m.media-amazon.com/images/I/71C1LwZC7-L._AC_UF1000,1000_QL80_.jpg",
    features: [
      "Campaña abierta",
      "Multijugador free-to-play",
      "Optimizado para Series X/S",
      "60 FPS estable",
    ],
  },
  {
    id: "switch-zelda",
    name: "The Legend of Zelda: TOTK",
    description: "Lo mejor de Nintendo Switch",
    descriptionLong:
      "Explora el vasto Hyrule como nunca antes en esta secuela aclamada por la crítica.",
    price: 249000,
    oldPrice: 289000,
    discount: 12,
    rating: 5.0,
    reviews: 12000,
    category: "nintendo",
    categoryLabel: "Nintendo",
    image:
      "https://m.media-amazon.com/images/I/81NisZ3LLFL._AC_UF1000,1000_QL80_.jpg",
    features: [
      "Mundo abierto extenso",
      "Nueva mecánica de construcción",
      "Calidad artística espectacular",
      "Más de 100 horas de contenido",
    ],
  },
];
