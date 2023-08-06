// ==UserScript==
// @name         CW Decorator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.codewars.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codewars.com
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require      https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=198809
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    const JQUERYUI_CSS_URL = '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/dark-hive/jquery-ui.min.css';
    $.noConflict();
    $("head").append(`
        <link href="${JQUERYUI_CSS_URL}" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css" type="text/css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.15.2/css/selectize.default.min.css" type="text/css">
     `);

    let css = `
.row {
  display: flex;
}

.column {
  flex: 50%;
  padding: 10px;
}

ul.snippetsList {
  list-style-type: disc;
}
`;
    // GM_addStyle(css);

    function insertImports(cm) {

        let functionName = cm.getSelection();
        cm.execCommand('goDocStart');
        if(!functionName?.length) functionName = '*';

        cm.replaceSelection(
`from solution import ${functionName}
import codewars_test as test

`
        );
    }

    function insertNeutralIt(cm) {
        cm.replaceSelection("def test_it():");
    }

    function expand(cm, {anchor, head}) {
        let [mn, mx] = anchor.line < head.line ? [anchor.line, head.line] : [head.line, anchor.line];
        anchor = { line: mn, ch: 0 };
        head   = { line: mx, ch: cm.getLine(mx).length };
        return { anchor, head }
    }

    function replaceWithDecorator(sel, cm) {

        let { anchor, head } = expand(cm, sel);

        let code = cm.getRange(anchor, head);
        let lines = code.split('\n');
        let indent = ' '.repeat(lines[1].length - lines[1].trimLeft().length);

        let funcname = lines[0].substring(
            lines[0].indexOf('(') + 1 + 1,
            lines[0].lastIndexOf(')') - 1)
        .split(' ')
        .map(w => w.toLowerCase())
        .join('_');

        lines = [
            indent + '@' + lines[0].trimLeft(),
            indent + `def ${funcname}():`,
            ...lines.slice(1).map(line => '    ' + line)
        ];
        let newCode = lines.join('\r\n');
        cm.replaceRange(newCode, anchor, head);
    }

    function wrapWithDescribe(cm) {
        let code = cm.getSelection();
        let lines = code.split('\n');
        let indent = ' '.repeat(lines[1].length - lines[1].trimLeft().length);
        let title = lines[0];
        let funcname = title
        .split(' ')
        .map(w => w.toLowerCase())
        .join('_');

        lines = [
            indent + `@test.describe("${title}")`,
            indent + `def ${funcname}():`,
            ...lines.slice(1).map(line => '    ' + line)
        ];
        let newCode = lines.join('\n');
        cm.replaceSelection(newCode);
    }

    function wrapWithIt(cm) {
        let code = cm.getSelection();
        let lines = code.split('\n');
        let indent = ' '.repeat(lines[1].length - lines[1].trimLeft().length);
        let title = lines[0];
        let funcname = title
        .split(' ')
        .map(w => w.toLowerCase())
        .join('_');

        lines = [
            indent + `@test.it("${title}")`,
            indent + `def ${funcname}():`,
            ...lines.slice(1).map(line => '    ' + line)
        ];
        let newCode = lines.join('\n');
        cm.replaceSelection(newCode);
    }

    function allSelections(op, cm) {
        let selections = cm.listSelections();
        selections.reverse().forEach(sel => op(sel, cm));
    }

    function insertSnippet(e) {
        let snipno = e.data.snipno;
        let editorControl = document.querySelector("div.is-full-screen")?.querySelector("div.CodeMirror");
        if(!editorControl)
            return;

        let cm = editorControl.CodeMirror;

        if(snipno == '1') {
            allSelections(replaceWithDecorator, cm);
        } else if(snipno == '2') {
            wrapWithDescribe(cm);
        } else if(snipno == '3') {
            wrapWithIt(cm);
        } else if(snipno == '4') {
            insertNeutralIt(cm);
        } else if(snipno == '5') {
            insertImports(cm);
        } else {
            alert(`Missing handler for command '${snipno}'`);
        }
    }

    function getActiveLang() {
        let lang = jQuery("#language_dd");
        if(!lang.length)
            lang = jQuery("#languages");

        lang = lang.find("dd.is-active");
        let langId = lang.attr("data-language");
        let langName = lang.text();
        return { langId, langName };
    }


    $(document).arrive("div.is-full-screen", {existing: true, onceOnly: false}, function(elem) {

        let commandsContainer = $(elem).find("div.commands-container");
        if(!commandsContainer.find("li a.lnkInsertSnippet").length) {

            for(let snipno of "123456789") {

                commandsContainer.append(`<li><a class="lnkInsertSnippet" id="snipno${snipno}" accesskey="${snipno}">[ ${snipno} ]</a></li>`);
                commandsContainer.find(`#snipno${snipno}`).on("click", { snipno }, insertSnippet);
            }
        }
    });


})();
