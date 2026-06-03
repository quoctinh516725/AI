import PostDetailClient from "./PostDetailClient";

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function PostDetailPage() {
  return <PostDetailClient />;
}
