module.exports = async (targetOptions, indexHtmlContent) => {
    indexHtmlContent = indexHtmlContent.replaceAll("type=\"module\"", 
    "");
  
    console.log("*****************");
    return indexHtmlContent;
  }
  
/*

module.exports = (targetOptions, indexHtml) => {
    console.log('KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK')
    const i = indexHtml.indexOf('</body>');
    const config = `<p>Configuration: ${targetOptions.configuration}</p>`;
    return `${indexHtml.slice(0, i)}
              ${config}
              ${indexHtml.slice(i)}`;
  };



  /*




module.exports = async (targetOptions, indexHtmlContent) => {
    indexHtmlContent = indexHtmlContent.replaceAll("type=\"module\"", 
    "crossorigin=\"use-credentials\" defer");

    console.log("*****************");
    return indexHtmlContent;
}
*/