import { PDFViewer } from "./Viewer";

export default function DocumentPage({
  params,
}: {
  params: { documentId: number };
}) {
  return (
    <>
      <PDFViewer documentId={params.documentId} />
    </>
  );
}
