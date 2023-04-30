/*
let path = require('path');
const AngularCompilerPlugin = require('@ngtools/webpack/src');
 
module.exports = (config) => {
 
  // Raw Loader to load our html files
   config.module.rules.unshift(
    {test: /\.html$/, loader: 'raw-loader'}
  );


  config.module.rules.push({
    test: /\.html$/,
    use: ['attribute-remover']
  })
 


  config.resolveLoader.alias = {
    'attribute-remover': path.join(__dirname, 'html-attribute-remover.js')
  }
 
  console.log('\n\n\n\n CONFIG.RESOLVELOADER == \n', config.module.rules);
  // Angular compiler plugin has this directTemplateLoading option which overrides our loader if we do not make it false

  //console.log('\n\n\n\n ========= CONFIG =====',config)

  //console.log('================\n\n');
  //console.log(config.plugins);
  const index = config.plugins.findIndex(p => {

  //  console.log("***********");
  //  console.log(p);

  //  console.log(AngularCompilerPlugin)
    //return p instanceof AngularCompilerPlugin.AngularCompilerPlugin;
  });
 
  //config.plugins[index]._options.directTemplateLoading = false;
 
  return config;
}










/* import { Configuration, DefinePlugin } from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { version } from '@project';

/**
 * This is where you define your additional webpack configuration items to be appended to
 * the end of the webpack config.
 * /
export default {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'footer.html',
      template: 'src/footer-template.html',
    }),
    new DefinePlugin({
      APP_VERSION: JSON.stringify(version),
    }),
  ],
} as Configuration; */