function decoration(t) {
    let em_and_strong = false;
    let now_strong = false;
    let now_em = false;
    let now_code = false;
    let now_s = false;
    while (t.match(/\[[^!\[\]\(\)]*\]\([^!\[\]\(\)]*\)/)) {
        let about_link = t.match(/\[([^!\[\]\(\)]*)\]\(([^!\[\]\(\)]*)\)/);
        t = t.replace(/\[[^!\[\]\(\)]*\]\([^!\[\]\(\)]*\)/,`<a href="${about_link[2]}" target="_blank">${about_link[1]}</a>`);
    };
    for (let i = 0; t.match(/\*{3}/) != null; i++) {
        if (em_and_strong) {
            t = t.replace("***", "</em></strong>");
            em_and_strong = false;
        } else {
            t = t.replace("***", "<em><strong>");
            em_and_strong = true;
        };
    };
    for (let i = 0; t.match(/\*{2}/) != null; i++) {
        if (now_strong) {
            t = t.replace("**", "</strong>");
            now_strong = false;
        } else {
            t = t.replace("**", "<strong>");
            now_strong = true;
        };
    };
    for (let i = 0; t.match(/\*{1}/) != null; i++) {
        if (now_em) {
            t = t.replace("*", "</em>");
            now_em = false;
        } else {
            t = t.replace("*", "<em>");
            now_em = true;
        };
    };
    for (let i = 0; t.match(/\`{1}/) != null; i++) {
        if (now_code) {
            t = t.replace("`", "</code>");
            now_code = false;
        } else {
            t = t.replace("`", "<code class='lm-c'>");
            now_code = true;
        };
    };
    for (let i = 0; t.match(/\~{2}/) != null; i++) {
        if (now_s) {
            t = t.replace("~~", "</s>");
            now_s = false;
        } else {
            t = t.replace("~~", "<s>");
            now_s = true;
        };
    };
    return t
};

function markdown(t) {
    t = t.replace(/</g,"&lt;").replace(/>/g,"&gt;");
    let cs = t.split("\n");
    let rs = ""
    let now_code = false;
    for (let i = 0; i < cs.length; i++) {
        let e = cs[i];
        if (now_code != true) {
            switch (true) {
                case /^#\s/.test(e):
                    e = e.replace("# ", "<h1>") + "</h1>";
                    rs += e;
                    break
                case /^#{2}\s/.test(e):
                    e = e.replace("## ", "<h2>") + "</h2>";
                    rs += e;
                    break
                case /^#{3}\s/.test(e):
                    e = e.replace("### ", "<h3>") + "</h3>";
                    rs += e;
                    break
                case /^#{4}\s/.test(e):
                    e = e.replace("#### ", "<h4>") + "</h4>";
                    rs += e;
                    break
                case /^#{5}\s/.test(e):
                    e = e.replace("##### ", "<h5>") + "</h5>";
                    rs += e;
                    break
                case /^#{6}\s/.test(e):
                    e = e.replace("###### ", "<h6>") + "</h6>";
                    rs += e;
                    break
                case /^-{5}/.test(e):
                    e = "<hr>";
                    rs += e;
                    break
                case /^\`{3}/.test(e):
                    if (e.startsWith("``` ")) {
                        let lang = e.split(" ")[1];
                        e = `<pre><code class="${lang}">`;
                    } else {
                        e = "<pre><code>";
                    };
                    now_code = true;
                    rs += e;
                    break
                case /^:::message/.test(e):
                    e = "<div class='md-message'>";
                    rs += e;
                    break
                case /^:::comment/.test(e):
                    break
                case /^:::/.test(e):
                    e = "</div>"
                    rs += e;
                    break
                case /^!\[.*\]\(.*\)/.test(e):
                    let about_img = t.match(/!\[(.*)\]\((.*)\)/);
                    let img_ele = `<img src="${about_img[2]}" loading="lazy" alt="${about_img[1]}">`;
                    rs += img_ele;
                    break
                case /^@youtube\s/.test(e):
                    let yt_es = e.split(" ");
                    let yt_ele = `<div class="iframe-youtube"><iframe loading="lazy" width="100%" height="56.85%" src="https://www.youtube.com/embed/${yt_es[1]}" frameborder="0" allowfullscreen></iframe></div>`
                    rs += yt_ele;
                    break
                case /^@twitter\s/.test(e):
                    let tw_es = e.split(" ");
                    let tw_id = tw_es[1].replace(/https:\/\/twitter.com\/.*\//,"");
                    let iframe_url = `https://platform.twitter.com/embed/index.html?dnt=false&embedId=twitter-widget-1&frame=false&hideCard=false&hideThread=false&id=${tw_id}&lang=jawidgetsVersion=ed20a2b%3A1601588405575&width=550px`;
                    let tw_ele = `<div class="iframe-twitter"><iframe loading="lazy" src="${iframe_url}" frameborder="0" scrolling="no"></iframe></div>`;
                    
                    rs += tw_ele;
                    break
                case /^&gt;*\s/.test(e):
                    let quote_es = e.split(" ");
                    let bq_n = (quote_es[0].match(/&gt;/g) || []).length;
                    let bq = "<blockquote><p>";
                    let bq_end = "</p></blockquote>";
                    let content = e.replace(quote_es[0] + " ", "");
                    rs += bq.repeat(bq_n) + content + bq_end.repeat(bq_n);
                    break
                default:
                    rs += decoration(e) + "<br>";
            };
        } else if (now_code == true && e.startsWith("```")) {
            now_code = false;
            rs += "</code></pre>"
        } else {
            rs += e + "<br>";
        };
    };
    return rs
};