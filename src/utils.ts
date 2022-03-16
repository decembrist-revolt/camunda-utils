export function addHeadNode(html: string) {
    document.head.appendChild(htmlToElement(html));
}

export function addBodyNode(html: string) {
    document.body.appendChild(htmlToElement(html));
}

export function htmlToElement(html: string): ChildNode {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild!;
}

export function encodeStrHtml(raw: string) {
    return raw.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
}