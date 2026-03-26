import { PrismaClient } from "@prisma/client";
import { normalizeCompanyName } from "../lib/domain/companyNormalize";

const prisma = new PrismaClient();

const SEED = [
  {
    company: "Telco Roja",
    text: "4 horas en espera y me cortaron. El bot es un insulto a la inteligencia.",
    intensity: 9,
    reactions: { meToo: 42, indignante: 18 },
  },
  {
    company: "Delivery Ya",
    text: "Pedí sin cebolla. Trajeron solo cebolla. Cobraron delivery premium.",
    intensity: 8,
    reactions: { meToo: 103, indignante: 56 },
  },
  {
    company: "Banco Central",
    text: "Me cobraron comisión por respirar cerca del cajero.",
    intensity: 7,
    reactions: { meToo: 28, indignante: 12 },
  },
  {
    company: "Streaming Frío",
    text: "Subieron el plan y bajaron la calidad. Buffer eterno.",
    intensity: 6,
    reactions: { meToo: 91, indignante: 33 },
  },
  {
    company: "Aerolíneas Perdidas",
    text: "Perdieron mi valija y me dieron un cupón de $5.",
    intensity: 10,
    reactions: { meToo: 210, indignante: 189 },
  },
  {
    company: "Seguro Nada",
    text: "Leí la letra chica: no cubre nada que te pueda pasar.",
    intensity: 9,
    reactions: { meToo: 67, indignante: 44 },
  },
  {
    company: "Energía Cara",
    text: "Factura inventada. Nadie atiende el reclamo.",
    intensity: 8,
    reactions: { meToo: 55, indignante: 40 },
  },
  {
    company: "App rota S.A.",
    text: "Login imposible. 'Error desconocido' en loop infinito.",
    intensity: 7,
    reactions: { meToo: 38, indignante: 22 },
  },
];

async function main() {
  const existing = await prisma.complaint.count();
  if (existing > 0) {
    console.log("Seed omitido: ya hay quejas en la base.");
    return;
  }

  const now = Date.now();
  for (let i = 0; i < SEED.length; i++) {
    const row = SEED[i]!;
    const norm = normalizeCompanyName(row.company);
    const brand = await prisma.brand.upsert({
      where: {
        normalizedName_countryCode: {
          normalizedName: norm,
          countryCode: "AR",
        },
      },
      create: {
        normalizedName: norm,
        countryCode: "AR",
        displayName: row.company.trim(),
      },
      update: {},
    });
    await prisma.complaint.create({
      data: {
        brandId: brand.id,
        text: row.text,
        intensity: row.intensity,
        visitorHash: "seed",
        noise: false,
        reactionMeToo: row.reactions.meToo,
        reactionIndignante: row.reactions.indignante,
        createdAt: new Date(now - (i + 1) * 120_000),
      },
    });
  }
  console.log(`Seed: ${SEED.length} quejas de ejemplo.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
