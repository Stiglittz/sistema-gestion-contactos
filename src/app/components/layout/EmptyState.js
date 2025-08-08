'use client';

export default function EmptyState({
  icon,
  title,
  description,
  actionButton,
  size = "large" // "large" | "medium" | "small"
}) {
  const getSizes = () => {
    switch (size) {
      case "small":
        return {
          container: "py-6 text-center text-gray-500",
          icon: "text-3xl mb-2",
          title: "text-base font-medium mb-1",
          description: "text-sm"
        };
      case "medium":
        return {
          container: "py-8 text-center text-gray-500", 
          icon: "text-4xl mb-3",
          title: "text-lg font-medium mb-2",
          description: "text-sm"
        };
      case "large":
      default:
        return {
          container: "py-12 text-center text-gray-500",
          icon: "text-5xl mb-4", 
          title: "text-lg font-medium mb-2",
          description: "text-base mb-4"
        };
    }
  };

  const sizes = getSizes();

  return (
    <div className={sizes.container}>
      {icon && (
        <div className={sizes.icon}>
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className={sizes.title}>
          {title}
        </h3>
      )}
      
      {description && (
        <p className={sizes.description}>
          {description}
        </p>
      )}
      
      {actionButton && actionButton}
    </div>
  );
}