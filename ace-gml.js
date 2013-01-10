define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var GmlLangHighlightRules = function() {
    var docComment = DocCommentHighlightRules;
    
    
    var builtinFunctions = lang.arrayToMap(
        ('distance_position|instance_create|instance_count|show_message_async').split('|')
    );

    var keywords = lang.arrayToMap(
        ('if|and|or|while|do|until|div|mod|self|other').split('|')
    );

    // http://php.net/manual/en/reserved.keywords.php
    var languageConstructs = lang.arrayToMap(
        ('exit|var|globalvar|return').split('|')
    );

    var builtinConstants = lang.arrayToMap(
        ('true|false|noone|pi|c_white').split('|')
    );

    var builtinVariables = lang.arrayToMap(
        ('x|y|image_single').split('|')
    );

    // Discovery done by downloading 'Many HTML files' from:  http://php.net/download-docs.php
    // Then search for files containing 'deprecated' (case-insensitive) and look at each file that turns up.
    var builtinFunctionsDeprecated = lang.arrayToMap(
        ('show_message|variable_exists').split('|')
    );

    var futureReserved = lang.arrayToMap([]);

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "\\/\\/.*$"
            },
            /*{
               token : "comment",
               regex : "#.*$"
            },
            //docComment.getStartRule("doc-start"),
            ,*/{
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            }, {
                token : "string.regexp",
                regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"
            }, {
                token : "string", // " string start
                regex : '"',
                next : "qqstring"
            }, {
                token : "string", // ' string start
                regex : "'",
                next : "qstring"
            }, {
                token : "constant.numeric", // hex
                regex : "\\$[0-9a-fA-F]+\\b"
            }, {
                token: "constant.language",
                regex: "\\b(?:c_(?:white|red|orange)|fa_(?:left|right|middle|bottom))\\b"
            
            },/*{
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            },*/ {
                token : function(value) {
                    if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (builtinConstants.hasOwnProperty(value))
                        return "constant.language";
                    else if (builtinVariables.hasOwnProperty(value))
                        return "variable.language";
                    else if (futureReserved.hasOwnProperty(value))
                        return "invalid.illegal";
                    else if (builtinFunctions.hasOwnProperty(value))
                        return "support.function";
                    else if (builtinFunctionsDeprecated.hasOwnProperty(value))
                        return "invalid.deprecated";
                    /*else
                        //if(value.match(/^(\$[a-zA-Z][a-zA-Z0-9_]*|self|parent)$/))
                        if(value.match(/^([a-zA-Z][a-zA-Z0-9_]*)$/))
                            return "variable";*/
                        return "identifier";
                },
                // [orig comments from PHP]
                // TODO: Unicode escape sequences
                // TODO: Unicode identifiers
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            },{
                token : "keyword.operator",
                regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:asdf)"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ],
        "qqstring" : [
            /*{
                token : "constant.language.escape",
                regex : '\\\\(?:[nrtvef\\\\"$]|[0-7]{1,3}|x[0-9A-Fa-f]{1,2})'
            }, {
                token : "constant.language.escape",
                regex : /\$[\w\d]+(?:\[[\w\d]+\])?/
            }, {
                token : "constant.language.escape",
                regex : /\$\{[^"\}]+\}?/           // this is wrong but ok for now
            }, */{
                token : "string",
                regex : '"',
                next : "start"
            }, {
                token : "string",
                regex : '.+?'
            }
        ],
        "qstring" : [
            /*{
                token : "constant.language.escape",
                regex : "\\\\['\\\\]"
            }, */{
                token : "string",
                regex : "'",
                next : "start"
            }, {
                token : "string",
                regex : ".+?"
            }
        ]
    };

    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);
};

oop.inherits(GmlLangHighlightRules, TextHighlightRules);
exports.GmlLangHighlightRules = GmlLangHighlightRules;
});
