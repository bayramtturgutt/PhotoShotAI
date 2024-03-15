import { NextPage, GetServerSideProps } from "next";
import GalleryPage from "@/components/pages/GalleryPage";
import db from "@/core/db";
import { Shot } from "@/types"; // Assuming you have Shot type defined

interface GalleryProps {
  shots: Shot[];
}

const Gallery: NextPage<GalleryProps> = ({ shots }) => {
  return <GalleryPage shots={shots} />;
};

export const getServerSideProps: GetServerSideProps<GalleryProps> = async ({ params }) => {
  const userId = params?.userId as string;

  const shots = await db.shot.findMany({
    select: { outputUrl: true, blurhash: true },
    orderBy: { createdAt: "desc" },
    where: {
      outputUrl: { not: { equals: null } },
      bookmarked: true,
      Project: {
        userId: {
          equals: userId,
        },
      },
    },
  });

  return { props: { shots } };
};

export default Gallery;