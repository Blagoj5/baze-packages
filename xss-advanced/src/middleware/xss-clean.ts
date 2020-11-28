import { IFilterXSSOptions } from 'xss';
import asyncHandler from './async';
import XSSClean from './utils/XSSClean';

const defaultOptions: IFilterXSSOptions = {
  css: false,
  stripIgnoreTagBody: ['script'],
};

// Node.js Connect middleware to sanitize user input coming from POST body, GET queries, and url params. Works with Express. Built on top of xss: https://github.com/leizongmin/js-xss
/**
 * @param additionalOptions Pass additional xss options. Default: **{ css: false, stripIgnoreTagBody: ['script'] }**
 */
const xssClean = (additionalOptions = defaultOptions) =>
  asyncHandler(async (req, res, next) => {
    const myXSS = new XSSClean(additionalOptions);

    if (req.body) myXSS.cleanData(req.body);
    if (req.params) myXSS.cleanData(req.params);
    if (req.query) myXSS.cleanData(req.query);

    next();
  });

export default xssClean;
