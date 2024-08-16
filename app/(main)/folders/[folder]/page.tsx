export default function FolderPage({ params }: { params: { folder: string } }) {
  console.log(params);
  return <p className="text-2xl">{params.folder}</p>;
}
