import prisma from "../config/prismaClient.js";

export async function createPage(data, userId) {
  return prisma.page.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      backgroundVideoUrl: data.backgroundVideoUrl,
      backgroundImages: {
        create: data.backgroundImages || [],
      },
      sections: {
        create:
          data.sections?.map((section) => ({
            title: section.title,
            desc: section.desc,
            backgroundImage: section.backgroundImage,
            backgroundVideo: section.backgroundVideo,
            orderIndex: section.orderIndex,
            media: { create: section.media || [] },
          })) || [],
      },
    },
    include: {
      backgroundImages: true,
      sections: { include: { media: true } },
    },
  });
}

export async function getPageById(id) {
  return prisma.page.findUnique({
    where: { id },
    include: {
      backgroundImages: true,
      sections: { include: { media: true } },
    },
  });
}

export async function getAllPages() {
  return prisma.page.findMany({
    include: {
      backgroundImages: true,
      sections: {
        include: {
          media: {
            include: {
              media: true, // 👈 pull the actual Media details
            },
          },
        },
      },
    },
  });
}

export async function updatePage(id, data, userId) {
  return prisma.page.update({
    where: { id },
    data: {
      ...data,
      backgroundImages: data.backgroundImages
        ? {
            deleteMany: { pageId: id },
            create: data.backgroundImages,
          }
        : undefined,
      sections: data.sections
        ? {
            deleteMany: { pageId: id },
            create: data.sections.map((section) => ({
              title: section.title,
              desc: section.desc,
              backgroundImage: section.backgroundImage,
              backgroundVideo: section.backgroundVideo,
              orderIndex: section.orderIndex,
              media: { create: section.media || [] },
            })),
          }
        : undefined,
    },
    include: {
      backgroundImages: true,
      sections: { include: { media: true } },
    },
  });
}

export async function deletePage(id) {
  return prisma.page.delete({ where: { id } });
}
