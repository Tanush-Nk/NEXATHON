import { XPDisplay } from "../XPDisplay";

export default function XPDisplayExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 p-8">
      <div className="text-center">
        <XPDisplay xp={150} level={2} size="sm" />
        <p className="text-sm text-muted-foreground mt-2">Small</p>
      </div>
      <div className="text-center">
        <XPDisplay xp={350} level={4} size="md" />
        <p className="text-sm text-muted-foreground mt-2">Medium</p>
      </div>
      <div className="text-center">
        <XPDisplay xp={750} level={8} size="lg" />
        <p className="text-sm text-muted-foreground mt-2">Large</p>
      </div>
    </div>
  );
}
