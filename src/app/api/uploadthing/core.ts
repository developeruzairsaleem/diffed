import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // this field is used to validate the frontend input prop logic
    .input(z.object({ assignmentId: z.string() }))
    // Set permissions and file types for this FileRoute
    .middleware(
      async ({
        req,
        input,
      }: {
        req: Request;
        input: { assignmentId: string };
      }) => {
        // This code runs on your server before upload
        const user = await auth(req);
        // If you throw, the user will not be able to upload
        if (!user) throw new UploadThingError("Unauthorized");
        if (!input.assignmentId)
          throw new UploadThingError("No assignment selected");
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { assignmentId: input.assignmentId };
      }
    )
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log(
        "Upload complete for following assignmentId:",
        metadata.assignmentId
      );
      console.log("file url", file.ufsUrl);
      const response = await prisma.orderAssignment.update({
        where: {
          id: metadata.assignmentId,
        },
        data: { proofUrl: file.ufsUrl, status: "COMPLETED" },
      });
      console.log("data", response);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { assignmentId: metadata.assignmentId, success: true };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
