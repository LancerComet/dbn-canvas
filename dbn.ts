/*
 * DBN.JS By LancerComet at 23:00, 2016.11.25.
 * # Carry Your World #
 */

/**
 * DBN Language Lexer.
 * 词法分析器.
 * 
 * @param {string} [code='']
 * @returns {Array<Token>}
 */
function lexer (code: string) : Array<Token> {
  return code.split(/\s+/)
    .filter(words => words.length > 0)
    .map(words => isNaN(parseInt(words, 10))
      ? new Token('word', words)
      : new Token('number', parseInt(words, 10))
    )
}

/**
 * DBN Language Token.
 * 词法分析器转换出的标记类型.
 * 
 * @class Token
 */
class Token {
  type: string
  value: (string | number)
  
  
  /**
   * Creates an instance of Token.
   * 
   * @param {string} [type='']
   * @param {(string | number)} [value='']
   * 
   * @memberOf Token
   */
  constructor (type: string = '', value: string | number = '') {
    this.type = type
    this.value = value
  }
}

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
function parser (tokens: Array<Token> = []) {
  // Create an ast object to store our codes.
  const ast: AST = new AST('Drawing')

  // Analysis first token until all tokens have been analyzed.
  while (tokens.length > 0) {
    let currentToken = tokens.shift()

    // Do analysis when currentToken is "WordToken".
    // Because "NumberToken" does nothing.
    if (currentToken.type === 'word') {
      // The next token is the argument of currentToken.
      switch (currentToken.value) {
        case 'Paper': {
          // Create a paper-expression.
          let paperExpression = new Expression('Paper')
          let currentTokenArg = tokens.shift()                

          // The token after currentToken (Number CallExpression) must be the paper color argument.
          // So it must be a number, otherwise it's illegal.
          if (currentTokenArg.type === 'number') {
            // Push this argument's literal into the the paper expression.
            // 将这个数字参数的子面量推送至 Paper 表达式，建立关联, 设置这个表达式的参数.
            paperExpression.addArg(new Literal(currentTokenArg.value))

            // Push this paper-expression to our ast.
            ast.addExpression(paperExpression)
          } else {
            throw new Error('[Argument TypeError] Paper command must be followed by a number.')
          }
          continue
        }
          
        case 'Pen': {
          // Same as above.
          let penExpression = new Expression('Pen')
          let currentTokenArg = tokens.shift()                
          
          if (currentTokenArg.type === 'number') {
            penExpression.addArg(new Literal(currentTokenArg.value))
            ast.addExpression(penExpression)
          } else {
            throw new Error('[Argument TypeError] Pen command must be followed by a number.')
          }
          continue
        }         

        // The Line Express must used in this way:
        // "Line startX startY endX endY"
        case 'Line': {
          let lineExpression = new Expression('Line')
          let currentTokenArgs = [ tokens.shift(), tokens.shift(), tokens.shift(), tokens.shift() ]

          if (currentTokenArgs.some(argToken => argToken.type === 'number')) {
            currentTokenArgs.forEach(argToken => lineExpression.addArg(new Literal(argToken.value)))
            ast.addExpression(lineExpression)
          } else {
            throw new Error('[Argument TypeError] Line commend must be followed by 4 numbers.')
          }

          continue          
        }

        case 'Use': {
          let useExpression = new Expression('Use')
          let currentTokenArg = tokens.shift()

          useExpression.addArg(new Literal(currentTokenArg.value))
          ast.addExpression(useExpression)

          continue
        }
      }
    }
  }

  return ast
}

/**
 * DBN Language Abstract Syntax Tree.
 * 抽象语法树.
 * 
 * @class AST
 */
class AST {
  type: string
  expressions: Array<Expression>
  
  /**
   * Creates an instance of AST.
   * 
   * @param {string} [type='']
   * @param {Array<Expression>} [expressions=[]]
   * 
   * @memberOf AST
   */
  constructor (type = '', expressions: Array<Expression> = []) {
    this.type = type
    this.expressions = expressions
  }

  /**
   * Add an expression to this ast.
   * 
   * @param {Expression} expression
   * 
   * @memberOf AST
   */
  addExpression (expression: Expression) {
    this.expressions.push(expression)
  }
}

/**
 * Expression type of DBN Language.
 * 
 * DBN 中的语法类型.
 * 在生成 AST 时作为辅助数据类型.
 * 
 * @class Expression
 */
class Expression {
  type: string = 'CallExpression'
  name: string
  arguments: Array<Literal> = []

  constructor (name = '') {
    this.name = name
  }

  /**
   * Add an argument to this expression.
   * 
   * @param {Literal} argument
   * 
   * @memberOf Expression
   */
  addArg (argument: Literal) {
    this.arguments.push(argument)
  }
}

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
class Literal {
  type: string = 'NumberLiteral'
  value: number | string

  /**
   * Creates an instance of Literal.
   * 
   * @param {(number | string)} value
   * 
   * @memberOf Literal
   */
  constructor (value: number | string) {
    this.value = value
  }
}

function transformer (ast: AST) {

}

