export default function SponsorPage() {
  return (
    <div className="flex justify-center items-start pt-16 min-h-[calc(100vh-4rem)] px-3">
      <div className="w-full max-w-xl mx-auto">
        <div className="space-y-5">
          {/* 赞助者板块 */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎗️ 赞助者
              </span>
            </h1>
            <p className="text-sm text-foreground/70 dark:text-foreground/70">
              感谢以下赞助者的支持
            </p>
          </div>

          <div className="mt-2.5 space-y-1.5">
            <div className="rounded-xl border border-border dark:border-border bg-background dark:bg-background p-3 shadow-sm">
              <a
                href="https://github.com/vxincode"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 transition-colors duration-200 hover:text-blue-600"
              >
                <img
                  src="https://github.com/vxincode.png"
                  alt="vxincode"
                  className="w-10 h-10 rounded-full border border-border/40 dark:border-border/40"
                />
                <span className="text-base font-medium">vxincode</span>
              </a>
            </div>
          </div>

          {/* 贡献者板块 */}
          <div className="space-y-2 text-center pt-2">
            <h2 className="text-xl font-bold">👥 贡献者</h2>
            <p className="text-sm text-foreground/70 dark:text-foreground/70">
              感谢以下贡献者的帮助
            </p>
          </div>

          <div className="mt-2.5 space-y-1.5">
            <div className="rounded-xl border border-border dark:border-border bg-background dark:bg-background p-3 shadow-sm">
              <a
                href="https://github.com/yanfd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 transition-colors duration-200 hover:text-blue-600"
              >
                <img
                  src="https://github.com/yanfd.png"
                  alt="yanfd"
                  className="w-10 h-10 rounded-full border border-border/40 dark:border-border/40"
                />
                <span className="text-base font-medium">yanfd</span>
              </a>
            </div>
          </div>

          {/* 社区板块 */}
          <div className="rounded-xl border border-blue-500/50 dark:border-blue-400/50 bg-blue-50 dark:bg-blue-900/20 p-3.5 shadow-sm mt-4">
            <h2 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-1">
              🤝 成为项目支持者
            </h2>
            <a className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:underline cursor-pointer" href="https://github.com/Done-0/Jank">
              项目地址：github.com/Done-0/Jank
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
