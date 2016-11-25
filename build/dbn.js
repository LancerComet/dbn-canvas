/*
 * DBN.JS By LancerComet at 23:00, 2016.11.25.
 * # Carry Your World #
 */
// Define variable for DBN enviroument.
var currentCanvas = null;
var currentContext = null;
/**
 * DBN Language Lexer.
 * 词法分析器.
 *
 * @param {string} [code='']
 * @returns {Array<Token>}
 */
function lexer(code) {
    return code.split(/\s+/)
        .filter(function (words) { return words.length > 0; })
        .map(function (words) { return isNaN(parseInt(words, 10))
        ? new Token('word', words)
        : new Token('number', parseInt(words, 10)); });
}
/**
 * DBN Language Token.
 * 词法分析器转换出的标记类型.
 *
 * @class Token
 */
var Token = (function () {
    /**
     * Creates an instance of Token.
     *
     * @param {string} [type='']
     * @param {(string | number)} [value='']
     *
     * @memberOf Token
     */
    function Token(type, value) {
        if (type === void 0) { type = ''; }
        if (value === void 0) { value = ''; }
        this.type = type;
        this.value = value;
    }
    return Token;
}());
/*
 * In DBN Language, only two type of tokens are there:
 * WordToken: { type: 'word', value: string }
 * NumberToken: { type: 'number', value: Number }
 *
 * Because there are only words and numbers.
 */
/**
 * DBN Language Parser.
 * 语法分析器. 将标记转换为 AST 从而获取语法信息.
 *
 * @param {Array<Token>} [tokens=[]]
 * @returns {AST}
 */
function parser(tokens) {
    if (tokens === void 0) { tokens = []; }
    // Create an ast object to store our codes.
    var ast = new AST('Drawing');
    // Analysis first token until all tokens have been analyzed.
    var _loop_1 = function() {
        var currentToken = tokens.shift();
        // Do analysis when currentToken is "WordToken".
        // Because "NumberToken" does nothing.
        if (currentToken.type === 'word') {
            // The next token is the argument of currentToken.
            switch (currentToken.value) {
                case 'Paper': {
                    // Create a paper-expression.
                    var paperExpression = new Expression('Paper');
                    var currentTokenArg = tokens.shift();
                    // The token after currentToken (Number CallExpression) must be the paper color argument.
                    // So it must be a number, otherwise it's illegal.
                    if (currentTokenArg.type === 'number') {
                        // Push this argument's literal into the the paper expression.
                        // 将这个数字参数的子面量推送至 Paper 表达式，建立关联, 设置这个表达式的参数.
                        paperExpression.addArg(new Literal(currentTokenArg.value));
                        // Push this paper-expression to our ast.
                        ast.addExpression(paperExpression);
                    }
                    else {
                        throw new Error('[Argument TypeError] Paper command must be followed by a number.');
                    }
                    return "continue";
                }
                case 'Pen': {
                    // Same as above.
                    var penExpression = new Expression('Pen');
                    var currentTokenArg = tokens.shift();
                    if (currentTokenArg.type === 'number') {
                        penExpression.addArg(new Literal(currentTokenArg.value));
                        ast.addExpression(penExpression);
                    }
                    else {
                        throw new Error('[Argument TypeError] Pen command must be followed by a number.');
                    }
                    return "continue";
                }
                // The Line Expression must used in this way:
                // "Line START_X START_Y END_X END_Y"
                case 'Line': {
                    var lineExpression_1 = new Expression('Line');
                    var currentTokenArgs = [tokens.shift(), tokens.shift(), tokens.shift(), tokens.shift()];
                    if (currentTokenArgs.some(function (argToken) { return argToken.type === 'number'; })) {
                        currentTokenArgs.forEach(function (argToken) { return lineExpression_1.addArg(new Literal(argToken.value)); });
                        ast.addExpression(lineExpression_1);
                    }
                    else {
                        throw new Error('[Argument TypeError] Line commend must be followed by 4 numbers.');
                    }
                    return "continue";
                }
                // Use Expression defines the target canvas we would like to use
                // and must be used in this way:
                // "Use CANVAS_SELECTOR"
                case 'Use': {
                    var useExpression = new Expression('Use');
                    var currentTokenArg = tokens.shift();
                    useExpression.addArg(new Literal(currentTokenArg.value));
                    ast.addExpression(useExpression);
                    return "continue";
                }
            }
        }
    };
    while (tokens.length > 0) {
        _loop_1();
    }
    return ast;
}
/**
 * DBN Language Abstract Syntax Tree.
 * 抽象语法树.
 *
 * @class AST
 */
var AST = (function () {
    /**
     * Creates an instance of AST.
     *
     * @param {string} [type='']
     * @param {Array<Expression>} [expressions=[]]
     *
     * @memberOf AST
     */
    function AST(type, expressions) {
        if (type === void 0) { type = ''; }
        if (expressions === void 0) { expressions = []; }
        this.type = type;
        this.expressions = expressions;
    }
    /**
     * Add an expression to this ast.
     *
     * @param {Expression} expression
     *
     * @memberOf AST
     */
    AST.prototype.addExpression = function (expression) {
        this.expressions.push(expression);
    };
    return AST;
}());
/**
 * Expression type of DBN Language.
 *
 * DBN 中的语法类型.
 * 在生成 AST 时作为辅助数据类型.
 *
 * @class Expression
 */
var Expression = (function () {
    function Expression(name) {
        if (name === void 0) { name = ''; }
        this.type = 'CallExpression';
        this.arguments = [];
        this.name = name;
    }
    /**
     * Add an argument to this expression.
     *
     * @param {Literal} argument
     *
     * @memberOf Expression
     */
    Expression.prototype.addArg = function (argument) {
        this.arguments.push(argument);
    };
    return Expression;
}());
/**
 * Literal type of DBN Language.
 * There is only number-typed literal in DBN Language.
 *
 * DBN 中的字面量类型.
 * 在生成 AST 时作为辅助数据类型.
 * DBN 中只有数字类型的子面量.
 *
 * @class Literal
 */
var Literal = (function () {
    /**
     * Creates an instance of Literal.
     *
     * @param {(number | string)} value
     *
     * @memberOf Literal
     */
    function Literal(value) {
        this.type = 'NumberLiteral';
        this.value = value;
    }
    return Literal;
}());
/**
 * Run DBN code by providing ast.
 *
 * @param {AST} ast
 */
function transformer(ast) {
    // Let's find what do we have in this ast.
    while (ast.expressions.length > 0) {
        var expression = ast.expressions.shift();
        switch (expression.name) {
            case 'Use': {
                var useArg = expression.arguments[0].value;
                var canvasSelector = useArg.toString();
                var targetCanvas = document.querySelector(canvasSelector);
                if (!targetCanvas) {
                    throw new Error("[Canvas Mismatch] There is no canvas called " + canvasSelector);
                }
                currentCanvas = targetCanvas;
                currentContext = targetCanvas.getContext('2d');
                continue;
            }
            case 'Paper': {
                if (!currentCanvas) {
                    throw new Error('[Canvas Mismatch] You must use a canvas first.');
                }
                var paperArg = expression.arguments[0].value;
                var color = getColor(paperArg);
                currentContext.rect(0, 0, currentCanvas.width, currentCanvas.height);
                currentContext.fillStyle = color;
                currentContext.fill();
                continue;
            }
            case 'Pen': {
                if (!currentCanvas) {
                    throw new Error('[Canvas Mismatch] You must use a canvas first.');
                }
                var penArg = expression.arguments[0].value;
                var color = getColor(penArg);
                currentContext.strokeStyle = color;
                continue;
            }
            case 'Line': {
                if (!currentCanvas) {
                    throw new Error('[Canvas Mismatch] You must use a canvas first.');
                }
                var lineArgs = expression.arguments;
                console.log(expression);
                var start = {
                    x: lineArgs[0].value,
                    y: lineArgs[1].value
                };
                var end = {
                    x: lineArgs[2].value,
                    y: lineArgs[3].value
                };
                currentContext.beginPath();
                currentContext.moveTo(getLinePosition('width', start.x), getLinePosition('height', start.y));
                currentContext.lineTo(getLinePosition('width', end.x), getLinePosition('height', end.y));
                currentContext.stroke();
                continue;
            }
        }
    }
}
/**
 * Get hex color.
 *
 * @param {number} number
 * @returns {string}
 */
function getColor(number) {
    var hex = (Math.round(number / 100 * 255)).toString(16);
    return "#" + hex + hex + hex;
}
/**
 * Get canvas line position.
 *
 * @param {("width" | "height")} type
 * @param {number} length
 * @returns {number}
 */
function getLinePosition(type, length) {
    return currentCanvas[type] * length / 100;
}
// Start to run.
var codes = document.querySelector('script[lang=dbn]').textContent;
var tokens = lexer(codes);
var ast = parser(tokens);
transformer(ast);
