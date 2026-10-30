const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const genres = [
  {
    name: 'Rock',
    description: 'Do rock clássico ao progressivo.',
  },
  {
    name: 'Jazz',
    description: 'Improviso, swing e os grandes nomes do gênero.',
  },
  {
    name: 'Blues',
    description: 'A raiz de boa parte da música popular.',
  },
  {
    name: 'MPB',
    description: 'Música popular brasileira de todas as épocas.',
  },
  {
    name: 'Eletrônica',
    description: 'House, techno, tech house e música eletrônica.',
  },
  {
    name: 'Pop',
    description: 'Álbuns marcantes da música pop internacional.',
  },
  {
    name: 'Hip-Hop',
    description: 'Rap, beats e clássicos da cultura hip-hop.',
  },
  {
    name: 'Reggae',
    description: 'Reggae roots e suas principais vertentes.',
  },
];

const covers = {
  'Abbey Road': '/images/abbeyroad.jpg',
  'Kind of Blue': '/images/KindofBlue.jpg',
  Rumours: '/images/Rumours.png',
  'The Dark Side of the Moon': '/images/Dark_Side_of_the_Moon.png',
  'Blue Train': '/images/bluetrain.jpg',
  'Born Under a Bad Sign': '/images/BornUnder.jpg',
  Gita: '/images/Gita.jpg',
  'Elis & Tom': '/images/Elis_Regina.jpg',
  "Smack Yo'": '/images/smack_yo.jpg',
  Warning: '/images/Warning.jpg',
  Thriller: '/images/Thriller.jpg',
  'Future Nostalgia': '/images/Future_Nostalgia.png',
  Illmatic: '/images/Illmatic.jpg',
  'The Chronic': '/images/The_Chronic.jpg',
  Legend: '/images/Legend.jpg',
  'Catch a Fire': '/images/CatchaFire.jpg',
};

const records = [
  // ROCK
  {
    title: 'Abbey Road',
    artist: 'The Beatles',
    country: 'Reino Unido',
    genre: 'Rock',
    releaseYear: 1969,
    price: 149.9,
    condition: 'Excelente',
    stockQuantity: 5,
  },
  {
    title: 'Rumours',
    artist: 'Fleetwood Mac',
    country: 'Reino Unido',
    genre: 'Rock',
    releaseYear: 1977,
    price: 129.9,
    condition: 'Excelente',
    stockQuantity: 4,
  },
  {
    title: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    country: 'Reino Unido',
    genre: 'Rock',
    releaseYear: 1973,
    price: 199.9,
    condition: 'Excelente',
    stockQuantity: 5,
  },

  // JAZZ
  {
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    country: 'EUA',
    genre: 'Jazz',
    releaseYear: 1959,
    price: 179.9,
    condition: 'Muito bom',
    stockQuantity: 3,
  },
  {
    title: 'Blue Train',
    artist: 'John Coltrane',
    country: 'EUA',
    genre: 'Jazz',
    releaseYear: 1958,
    price: 169.9,
    condition: 'Muito bom',
    stockQuantity: 2,
  },

  // BLUES
  {
    title: 'Born Under a Bad Sign',
    artist: 'Albert King',
    country: 'EUA',
    genre: 'Blues',
    releaseYear: 1967,
    price: 139.9,
    condition: 'Bom',
    stockQuantity: 2,
  },

  // MPB
  {
    title: 'Gita',
    artist: 'Raul Seixas',
    country: 'Brasil',
    genre: 'MPB',
    releaseYear: 1974,
    price: 119.9,
    condition: 'Muito bom',
    stockQuantity: 3,
  },
  {
    title: 'Elis & Tom',
    artist: 'Elis Regina',
    country: 'Brasil',
    genre: 'MPB',
    releaseYear: 1974,
    price: 159.9,
    condition: 'Excelente',
    stockQuantity: 0,
  },

  // ELETRÔNICA / TECH HOUSE
  {
    title: "Smack Yo'",
    artist: 'Beltran',
    country: 'Brasil',
    genre: 'Eletrônica',
    releaseYear: 2022,
    price: 189.9,
    condition: 'Excelente',
    stockQuantity: 3,
  },
  {
    title: 'Warning',
    artist: 'Beltran',
    country: 'Brasil',
    genre: 'Eletrônica',
    releaseYear: 2022,
    price: 179.9,
    condition: 'Excelente',
    stockQuantity: 2,
  },
  {
    title: 'Thriller',
    artist: 'Michael Jackson',
    country: 'EUA',
    genre: 'Pop',
    releaseYear: 1982,
    price: 189.9,
    condition: 'Muito bom',
    stockQuantity: 4,
  },

  // POP
  {
    title: 'Future Nostalgia',
    artist: 'Dua Lipa',
    country: 'Reino Unido',
    genre: 'Pop',
    releaseYear: 2020,
    price: 199.9,
    condition: 'Excelente',
    stockQuantity: 3,
  },

  // HIP-HOP
  {
    title: 'Illmatic',
    artist: 'Nas',
    country: 'EUA',
    genre: 'Hip-Hop',
    releaseYear: 1994,
    price: 179.9,
    condition: 'Muito bom',
    stockQuantity: 2,
  },
  {
    title: 'The Chronic',
    artist: 'Dr. Dre',
    country: 'EUA',
    genre: 'Hip-Hop',
    releaseYear: 1992,
    price: 189.9,
    condition: 'Excelente',
    stockQuantity: 2,
  },

  // REGGAE
  {
    title: 'Legend',
    artist: 'Bob Marley & The Wailers',
    country: 'Jamaica',
    genre: 'Reggae',
    releaseYear: 1984,
    price: 159.9,
    condition: 'Muito bom',
    stockQuantity: 4,
  },
  {
    title: 'Catch a Fire',
    artist: 'The Wailers',
    country: 'Jamaica',
    genre: 'Reggae',
    releaseYear: 1973,
    price: 169.9,
    condition: 'Bom',
    stockQuantity: 2,
  },
];

async function main() {
  // Usuário administrador configurado por variáveis de ambiente
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'Configure ADMIN_EMAIL e ADMIN_PASSWORD no arquivo .env',
    );
  }

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Administrador',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'ADMIN',
    },
  });

  // Criar os gêneros sem duplicar os existentes
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: {
        description: genre.description,
      },
      create: genre,
    });
  }

  // Criar artistas e discos
  for (const r of records) {
    let artist = await prisma.artist.findFirst({
      where: { name: r.artist },
    });

    if (!artist) {
      artist = await prisma.artist.create({
        data: {
          name: r.artist,
          country: r.country,
          bio: `${r.artist}, ${r.country}.`,
        },
      });
    }

    const genre = await prisma.genre.findUnique({
      where: { name: r.genre },
    });

    if (!genre) {
      throw new Error(`Gênero não encontrado: ${r.genre}`);
    }

    const exists = await prisma.vinylRecord.findFirst({
      where: {
        title: r.title,
        artistId: artist.id,
      },
    });

    const coverUrl = covers[r.title] ?? null;

    if (exists) {
      // Mantém as capas em dia ao rodar o seed de novo
      if (coverUrl && exists.coverUrl !== coverUrl) {
        await prisma.vinylRecord.update({
          where: { id: exists.id },
          data: { coverUrl },
        });
      }

      continue;
    }

    await prisma.vinylRecord.create({
      data: {
        title: r.title,
        releaseYear: r.releaseYear,
        price: r.price,
        condition: r.condition,
        rpmSpeed: 33,
        stockQuantity: r.stockQuantity,
        artistId: artist.id,
        genreId: genre.id,
        coverUrl,
      },
    });
  }

  console.log('Seed concluído!');
  console.log(`Discos cadastrados no seed: ${records.length}`);
  console.log(`Gêneros configurados: ${genres.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
