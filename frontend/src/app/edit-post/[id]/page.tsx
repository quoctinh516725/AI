import EditPostClient from "./EditPostClient";

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function EditPostPage() {
  return <EditPostClient />;
}
