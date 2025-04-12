<p style="text-align: center;">
  <a><img src="https://s2.loli.net/2025/03/14/BnchjpPLeIaoO75.png" alt="Jank"></a>
</p>
<p style="text-align: center;">
  <em>Jank, a lightweight blog system based on Go language and Echo framework, emphasizing simplicity, low coupling, and high extensibility</em>
</p>
<p style="text-align: center;">
  <a href="https://img.shields.io/github/stars/Done-0/Jank?style=social" target="_blank">
    <img src="https://img.shields.io/github/stars/Done-0/Jank?style=social" alt="Stars">
  </a> &nbsp;
  <a href="https://img.shields.io/github/forks/Done-0/Jank?style=social" target="_blank">
    <img src="https://img.shields.io/github/forks/Done-0/Jank?style=social" alt="Forks">
  </a> &nbsp;
  <a href="https://img.shields.io/github/contributors/Done-0/Jank" target="_blank">
    <img src="https://img.shields.io/github/contributors/Done-0/Jank" alt="Contributors">
  </a> &nbsp;
  <a href="https://img.shields.io/github/issues/Done-0/Jank" target="_blank">
    <img src="https://img.shields.io/github/issues/Done-0/Jank" alt="Issues">
  </a> &nbsp;
  <a href="https://img.shields.io/github/issues-pr/Done-0/Jank" target="_blank">
    <img src="https://img.shields.io/github/issues-pr/Done-0/Jank" alt="Pull Requests">
  </a> &nbsp;
  <a href="https://img.shields.io/github/license/Done-0/Jank" target="_blank">
    <img src="https://img.shields.io/github/license/Done-0/Jank" alt="License">
  </a>
</p>
<p align="center">
  <a href="README.md" style="text-decoration: none;">简体中文</a> | <span style="text-decoration: underline; color: grey;">English</span>
</p>

---

Jank is a lightweight blog system developed with Go language and Echo framework. Its design philosophy emphasizes simplicity, low coupling, and high extensibility, aiming to provide users with a feature-rich, clean interface, easy-to-operate, and secure blogging experience.

> Note: This project currently lacks the frontend part. We sincerely invite developers interested in frontend development to join and participate in the development work. We look forward to your valuable opinions and contributions!

## Quick Look

👉 Demo Site: [https://jank.org.cn](https://jank.org.cn)

👉 [【Jank Blog System】New Tech Stack & UI】](https://www.bilibili.com/video/BV1bjQ8YNEEo/?share_source=copy_web&vd_source=6fd45877cd498bfb9c2b449d1197363c)

👉 Backend Repository: [https://github.com/Done-0/Jank](https://github.com/Done-0/Jank)

![home-page.png](https://s2.loli.net/2025/03/18/CVYwRJOaXtH4nb8.png)
![posts-page.png](https://s2.loli.net/2025/03/18/s6WH3BVmlbyarRS.png)
![post2-page.png](https://s2.loli.net/2025/03/18/TS1j9Zr7UpnVPOY.png)

> Note: As the project is still in the launch phase, some configuration files may need to be modified according to the actual situation. Please contact the author using the contact information below or join the developer community for discussion.

## Tech Stack

- **Frontend**: React + Next.js + shadcn/ui + Tailwind CSS.

## Project Structure

```bash
src/
├── app/                        # Next.js App Router
│   ├── (portal)/               # Frontend route group (public pages)
│   ├── (dashboard)/            # Backend route group (admin system)
│   ├── (auth)/                 # Authentication route group (login/register)
│   └── layout.tsx              # Global layout
│
├── modules/                    # Business modules (domain-driven)
│   ├── account/                # Account module
│   │   ├── api/                # API requests
│   │   ├── services/           # Business logic services
│   │   ├── actions/            # Server action functions
│   │   ├── components/         # Module-specific components
│   │   ├── hooks/              # Custom hooks
│   │   └── types/              # Type definitions
│   │
│   ├── category/               # Category module
│   ├── post/                   # Post module
│   └── verification/           # Verification module
│
├── shared/                     # Shared resources
│   ├── components/             # Shared components
│   │   ├── custom/             # Custom business components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # UI base components
│   │
│   ├── config/                 # Global configuration
│   ├── hooks/                  # Shared hooks
│   ├── lib/                    # Function libraries
│   │   ├── animations/         # Animation library
│   │   ├── api/                # API client
│   │   ├── seo/                # SEO-related
│   │   ├── theme/              # Theme-related
│   │   └── utils/              # Utility functions
│   │
│   ├── providers/              # Global context providers
│   ├── store/                  # Global state
│   ├── styles/                 # Global styles
│   └── types/                  # Shared types
│
└── public/                     # Static resources
    └── images/                 # Image resources
```

## Local Development

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Modify Configuration**:  
   Modify the database and email configurations in the `.env` or `.env.development` file, for example:

   ```yaml
   NEXT_PUBLIC_SITE_URL=http://127.0.0.1:9010
   ```

3. **Start the Service**:  
   Use the following command to start the application:

   ```bash
   pnpm dev
   ```

4. **Access the Homepage**:  
   After starting the application locally, visit [http://localhost:3000](http://localhost:3000) in your browser.

## Roadmap

![image.png](https://s2.loli.net/2025/03/09/qJrtOeFvD95PV4Y.png)

> Note: Black items are completed features, white items are pending features.

## Official Community

If you have any questions or suggestions, feel free to join the official community for discussion.

<img src="https://s2.loli.net/2025/03/31/GA3jRfYrglL8ItJ.jpg" alt="Official Community" width="300" />

## Special Thanks

Thanks to everyone who supports the open-source community. We sincerely thank each sponsor!

<p>
  <a href="https://github.com/vxincode">
    <img src="https://github.com/vxincode.png" width="80" height="80" style="border-radius: 50%;" />
  </a>
  <a href="https://github.com/WowDoers">
    <img src="https://github.com/WowDoers.png" width="80" height="80" style="border-radius: 50%;" />
  </a>
</p>

## Contact & Collaboration

- **QQ**: 927171598
- **WeChat**: l927171598
- **Email**: fenderisfine@outlook.com

## Contributors

<a href="https://github.com/Done-0/Jank/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Done-0/Jank" alt="Contributors List" />
</a>

## Code Statistics

<p align="left">
  <img src="https://img.shields.io/github/languages/top/Done-0/Jank?label=Main%20Language&color=00ADD8" alt="Main Language" />
  <img src="https://img.shields.io/github/languages/code-size/Done-0/Jank?label=Code%20Size&color=success" alt="Code Size" />
  <img src="https://img.shields.io/github/last-commit/Done-0/Jank?label=Last%20Commit&color=blue" alt="Last Commit" />
  <img src="https://img.shields.io/github/commit-activity/m/Done-0/Jank?label=Monthly%20Commits&color=orange" alt="Commit Frequency" />
</p>

### Detailed Statistics
| Language | Files | Code Lines | Comment Lines | Blank Lines | Percentage |
|:--------:|:-----:|:----------:|:-------------:|:-----------:|:----------:|
| TypeScript | 129 | 9779 | 1126 | 1215 | 92.6% |
| JavaScript | 3 | 76 | 65 | 21 | 0.7% |
| CSS | 4 | 408 | 25 | 36 | 3.9% |
| Config Files | 3 | 233 | 1 | 8 | 2.2% |
| Markdown | 0 | 0 | 0 | 0 | 0.0% |
| Others | 2 | 60 | 15 | 11 | 0.6% |
| **Total** | **141** | **10556** | **1232** | **1291** | **100%** |

*Note: Statistics are automatically updated by GitHub Actions, last updated on 2025-04-12*
*Excluded node_modules, .next, public directories and package-lock.json, pnpm-lock.yaml, components.json, LICENSE, .gitignore, .dockerignore, README.md, README_en.md files*
## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Growth Trend

<img src="https://api.star-history.com/svg?repos=Done-0/Jank&type=timeline" width="100%" height="65%" alt="GitHub Stats">
