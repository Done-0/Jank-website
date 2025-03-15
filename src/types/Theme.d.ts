/* 导航烂-菜单 */
export interface MenuItem {
    title: string;
    link: string;
    key: string;
    icon: string;
    children?: MenuItem[];
}

/* 侧边栏-头像卡片 */
export interface AvatarCardProps {
    avatarUrl: string;
    name: string;
    title: string;
    backDetails: string[];
    socials: {
        name: string;
        icon: string;
        url: string;
    }[];
}