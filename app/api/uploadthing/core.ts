import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "@/db";
import { documents } from "@/db/schema";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Code runs on server before upload
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Code runs on server after upload
      console.log("Upload complete for userId: ", metadata);
      console.log("file url", file);
      // Sent to clientside `onClientUploadComplete` callback
      return { file };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
