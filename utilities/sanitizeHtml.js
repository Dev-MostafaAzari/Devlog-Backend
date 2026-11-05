// this utility will clean the html content

const sanitizeHtml = require("sanitize-html");

const SanitizeContent = (content)=>{
    return sanitizeHtml(content,{
        allowedTags : [
            "p","h1","h2","bold","ul","li","br",
        ],
    })
};

module.exports = SanitizeContent;