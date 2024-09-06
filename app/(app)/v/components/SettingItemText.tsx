export default function SettingItemText({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <span className="block text-lg capitalize">{title}</span>
      <span className="text-sm text-text-200">{subtitle}</span>
    </div>
  );
}
