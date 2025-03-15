export default function About() {
  return (
    <div className="flex justify-center items-start pt-16 min-h-[calc(100vh-4rem)] px-3">
      <div className="w-full max-w-xl mx-auto">
        <div className="space-y-5">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🌟 你终于发现了
              </span>
            </h1>
            <p className="text-sm text-foreground/70 dark:text-foreground/70">
              一个简约而不简单的博客平台
            </p>
          </div>

          <div className="relative mx-auto w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-full border border-border dark:border-border shadow-sm">
            <img
              src="https://github.com/Done-0.png"
              alt="Fender"
              className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
            />
          </div>

          <div className="mx-auto w-full">
            <div className="rounded-xl border border-border dark:border-border bg-background dark:bg-background p-3.5 shadow-sm">
              <p className="text-base text-foreground dark:text-foreground">
                嗨，这里是
                Jank，这个名字没有特别深刻的寓意，因为他像喝水一样好记 😆
              </p>
            </div>

            <div className="mt-2.5 space-y-1.5">
              {[
                "我的灵感来自于 halo、butterfly 和 heo",
                "如果你还没试过这三个博客，那就赶紧试试吧！",
                "目前来看，Jank 还不及它们，但我会努力让它更好！",
                "在这里，我诚挚欢迎你加入我们的开发者社区！",
              ].map((text, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border dark:border-border bg-background dark:bg-background p-3 shadow-sm transition-all duration-200 hover:border-accent/40"
                >
                  <p className="text-sm text-foreground dark:text-foreground m-0">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/50 dark:border-blue-400/50 bg-blue-50 dark:bg-blue-900/20 p-3.5 shadow-sm">
            <h2 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-1">
              🎉 立即加入开发者社区
            </h2>
            <p className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer">
              官方Q群：828270460
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
