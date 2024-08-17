export default function FolderPage({
  params,
}: {
  params: { folderId: number };
}) {
  console.log(params);
  return <p className="text-2xl">Click on something</p>;
}
