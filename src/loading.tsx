import { useTheme } from "@/components/ui/shadcn";

export default function LoadingPage() {
  const { theme } = useTheme();

  const backgroundColor = theme === "dark" ? "hsl(var(--background))" : "hsl(var(--background))";
  const loaderColor = theme === "dark" ? "hsl(var(--foreground))" : "hsl(var(--foreground))";

  return (
    <div
      className="flex items-center justify-center h-screen transition-all"
      style={{ backgroundColor }}
    >
      <div className="loader" />
      <style>{`
            .loader {
              width: fit-content;
              font-size: 40px;
              font-family: monospace;
              font-weight: bold;
              text-transform: uppercase;
              color: transparent;
              -webkit-text-stroke: 1px ${loaderColor};
              --g: conic-gradient(${loaderColor} 0 0) no-repeat text;
              background:
                var(--g) 0,
                var(--g) 1ch,
                var(--g) 2ch,
                var(--g) 3ch,
                var(--g) 4ch,
                var(--g) 5ch,
                var(--g) 6ch;
              animation:
                l20-0 1.5s linear infinite alternate,
                l20-1 3s linear infinite;
            }
            .loader:before {
              content: "Loading";
            }
            @keyframes l20-0 {
              0% {
                background-size:
                  1ch 0,
                  1ch 0,
                  1ch 0,
                  1ch 0,
                  1ch 0,
                  1ch 0,
                  1ch 0;
              }
              25% {
                background-size:
                  1ch 100%,
                  1ch 50%,
                  1ch 0,
                  1ch 0,
                  1ch 0,
                  1ch 50%,
                  1ch 100%;
              }
              50% {
                background-size:
                  1ch 100%,
                  1ch 100%,
                  1ch 50%,
                  1ch 0,
                  1ch 50%,
                  1ch 100%,
                  1ch 100%;
              }
              75% {
                background-size:
                  1ch 100%,
                  1ch 100%,
                  1ch 100%,
                  1ch 50%,
                  1ch 100%,
                  1ch 100%,
                  1ch 100%;
              }
              to {
                background-size:
                  1ch 100%,
                  1ch 100%,
                  1ch 100%,
                  1ch 100%,
                  1ch 100%,
                  1ch 100%,
                  1ch 100%;
              }
            }
            @keyframes l20-1 {
              0%,
              50% {
                background-position-y: 100%;
              }
              50.01%,
              to {
                background-position-y: 0;
              }
            }
      `}</style>
    </div>
  );
}
