/** Post 响应数据 */
export interface Post {
    id: number;
    title: string;
    image: string;
    visibility: string;
    content_html: string;
    category_ids: number[];
}
