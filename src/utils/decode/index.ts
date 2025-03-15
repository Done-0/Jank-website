/**
 * 解码HTML实体字符
 * @param html HTML 字符串
 * @returns 解码后的字符串
 */
function decodeHtml(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

/**
 * 解码 URL 编码（百分号编码）
 * @param encodedUrl URL 编码字符串
 * @returns 解码后的 URL 字符串
 */
function decodeUrl(encodedUrl: string): string {
    try {
        return decodeURIComponent(encodedUrl);
    } catch (e) {
        console.error("URL 解码失败", e);
        return encodedUrl;
    }
}

/**
 * 解码 JSON 字符串
 * @param jsonString JSON 字符串
 * @returns 解析后的对象
 */
function decodeJson(jsonString: string): any {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("JSON 解码失败", e);
        return null;
    }
}

/**
 * 解码 Base64 编码的字符串
 * @param base64String Base64 编码的字符串
 * @returns 解码后的字符串
 */
function decodeBase64(base64String: string): string {
    try {
        return atob(base64String);
    } catch (e) {
        console.error("Base64 解码失败", e);
        return base64String;
    }
}

/**
 * 解码 XML 字符串
 * @param xmlString XML 字符串
 * @returns 解析后的 XML 对象
 */
function decodeXml(xmlString: string): Document {
    try {
        const parser = new DOMParser();
        return parser.parseFromString(xmlString, "application/xml");
    } catch (e) {
        console.error("XML 解码失败", e);
        return new DOMParser().parseFromString("<error></error>", "application/xml");
    }
}

/**
 * 解码 HTML 实体字符（如 &amp; -> &）
 * @param html HTML 实体字符
 * @returns 解码后的字符串
 */
function decodeHtmlEntities(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// 统一导出所有解码工具函数
export const decodeUtils = {
    decodeHtml,
    decodeUrl,
    decodeJson,
    decodeBase64,
    decodeXml,
    decodeHtmlEntities,
};
