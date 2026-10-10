// The three visual styles. Rename these to match your own moods;
// the hub reads from this list, and each style has its own route folders.
export const styles = [
  { slug: "calm", name: "Calm" },
  { slug: "arcade", name: "Arcade" },
  { slug: "editorial", name: "Editorial" },
] as const;

// Your site. Rename the folder src/app/my-site to match, e.g. reading-log.
export const site = { href: "/my-site", name: "My Site" };
