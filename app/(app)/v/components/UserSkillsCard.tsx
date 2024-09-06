import clsx from "clsx";

export default function UserSkillsCard({ skills }: { skills: any }) {
  return (
    <div className="divide-y">
      {skills.map(
        (
          skill: { name: string; description: string; category: any },
          index: number,
        ) => (
          <div
            className={clsx(
              "space-y-1 py-4",
              index === 0 && "pt-0",
              index === skills.length - 1 && "pb-0",
            )}
            key={skill.name}
          >
            <div>
              <span className="personal-info-value">{skill.name}</span>
              <div className="badge badge-primary mx-2">
                {skill.category.name}
              </div>
            </div>
            <p className="font-light">{skill.description}</p>
          </div>
        ),
      )}
    </div>
  );
}
