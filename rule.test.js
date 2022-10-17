import { Linter } from 'eslint'

const linter = new Linter()

const codesToVerify = {
  3: `var f = 1;
    const a = 1;
    function someFunction(){
       const e = 1;
       return 1;
    }
    const c = 1;
    const d = 1;
     `,
  0: `var f = 1;
    const a = 1;
    function someFunction(){
       return 1;
    }
     `,
  1: `var f = 1;
    const a = 1;
    function someFunction(){
       return 1;
    }
    const u = 1;
     `,
}

const MessageAvoid = 'avoid'

const customRule = {
  meta: {
    type: 'problem',
    messages: {
      [MessageAvoid]: `Avoid using variable '{{name}}' not on the top`,
    },
  },
  create(context) {
    let notVar = false
    return {
      Identifier(node) {
        if (node.parent.type !== 'VariableDeclarator') {
          notVar = true
        }
        if (node.parent.type === 'VariableDeclarator' && notVar) {
          context.report({
            node,
            messageId: MessageAvoid,
            data:{
              name:node.name
            }
          })
        }
      },
    }
  },

}
describe('some test', function () {
  it('should run test', () => {

    linter.defineRule('vars-on-top', customRule)

    Object.entries(codesToVerify).forEach(([expectedLength, code]) => {
      const verifyResult = linter.verify(code, {
        rules: {
          'vars-on-top': 2,
        },
        parserOptions: {
          ecmaVersion: 'latest',
        },
        env: {
          es6: true,
        },
      })

      expect(verifyResult).toHaveLength(parseFloat(expectedLength))
    })
  })
})
