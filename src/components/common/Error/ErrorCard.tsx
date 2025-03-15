import React, { useState, useEffect } from "react";

type ErrorCardProps = {
  title?: string;
  message?: string;
};

const ErrorCard: React.FC<ErrorCardProps> = ({
  title = "出错了",
  message = "哇，这里好像很安静！也许你可以成为第一个留言的人。",
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-6 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

export { ErrorCard };
