import { notFound } from "next/navigation";
import { MoodBoard } from "@/components/MoodBoard";
import { getStyle, styles } from "@/lib/styles";

// Every style is prerendered from generateStaticParams, so there's no data to wait on.
export const instant = false;

export function generateStaticParams() {
  return styles.map((s) => ({ style: s.slug }));
}

export default async function MoodBoardPage({ params }: PageProps<"/mood-boards/[style]">) {
  const style = getStyle((await params).style);
  if (!style) notFound();
  return <MoodBoard style={style} />;
}
