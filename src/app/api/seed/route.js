import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, res) {
    try{
    const users = await prisma.user.findMany();
          for(const user of users){
      // Create first content
      const content1 = await prisma.content.create({
        data: {
          value: "This is the content for the first note."
        },
      });

      // Create first note
      await prisma.note.create({
        data: {
          title: "First Note",
          contentId: content1.id,
          userId: user.id,
        },
      });

      // Create second content
      const content2 = await prisma.content.create({
        data: {
          value: "This is the content for the second note."
        },
      });

      // Create second note
      await prisma.note.create({  
        data: {
          title: "Second Note",
          contentId: content2.id,
          userId: user.id,
        },
      });
    }
    
      return new Response("Seeded");
    } catch(e){
        return new Response(e, {status: 500});
    }
    
}
